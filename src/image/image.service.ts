/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { ImageRepository } from '../shared/repository.interface';
import { S3, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ProductsService } from '../products/products.service';
import { CreateImageInput } from './dto/input/';
import { ImageNotFoundException } from './exception/image-not-found.expection';

@Injectable()
export class ImageService {
  private s3Client: S3;
  private readonly region = this.configService.get('aws.region')!;
  private readonly accessKeyId = this.configService.get<string>('aws.key')!;
  private readonly secretKey = this.configService.get('aws.secret')!;
  private readonly bucketName = this.configService.get('aws.bucket')!;
  private readonly EXPIRE_5MIN = 300;

  constructor(
    @Inject('ImageRepository')
    private readonly imageRepository: ImageRepository,
    @Inject(forwardRef(() => ProductsService))
    private readonly productService: ProductsService,
    private readonly configService: ConfigService,
  ) {
    this.s3Client = new S3({
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretKey,
      },
      region: this.region,
    });
  }

  async findOne(imageId: number) {
    const image = await this.imageRepository.findOne({ id: imageId });

    if (!image) {
      throw new ImageNotFoundException();
    }

    return image;
  }

  async create(createImageInput: CreateImageInput) {
    const { productId, mimetype } = createImageInput;

    const { name: productName } = await this.productService.findOneById(
      productId,
    );

    const fileName = `${uuid()}-${productName}.${mimetype.split('/')[1]}`;

    const url = this.createUrlToUploadImage(fileName, mimetype);

    const image = await this.imageRepository.create({
      name: fileName,
      mimetype,
      productId,
    });

    const response = { ...image, url };

    return response;
  }

  async createUrlToUploadImage(fileName: string, mimetype: string) {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
      ContentType: mimetype,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }

  async getImagesByProductId(producId: number) {
    const response = [];
    const images = await this.imageRepository.findAllByProductId(producId);

    for (const image of images) {
      response.push({ ...image, url: this.generateUrlS3Image(image.name) });
    }

    return response;
  }

  async generateUrlS3Image(key: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, {
      expiresIn: this.EXPIRE_5MIN,
    });
  }
}

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { ImageRepository } from '../shared/repository.interface';
import { S3, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ProductsService } from '../products/products.service';
import { CreateImageInput } from './dto/input/';
import { ImageNotFoundException } from './exception/image-not-found.exception';

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
    private readonly configService: ConfigService,
    private readonly productService: ProductsService,
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

    const url = this.createPresignedUrl(fileName, mimetype);

    const image = await this.imageRepository.create({
      name: fileName,
      mimetype,
      productId,
    });

    const response = { ...image, url };

    return response;
  }

  async createPresignedUrl(fileName: string, mimetype: string) {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
      ContentType: mimetype,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }

  private getTypeFile(origiName: string): string {
    const fileType = origiName.split('.');
    //get the type of file example .png .jpg
    return `${fileType[fileType.length - 1]}`;
  }

  async generateLinksImageSpecificProduct(producId: number) {
    const imagesLinks = [];
    const images = await this.imageRepository.findAllByProductId(producId);

    for (const image of images) {
      imagesLinks.push(await this.generateLink(image.name));
    }

    return imagesLinks;
  }

  async generateLinkToGetImage(imageId: number): Promise<string> {
    const { name } = await this.findOne(imageId);

    return this.generateLink(name);
  }

  async generateLink(key: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, {
      expiresIn: this.EXPIRE_5MIN,
    });
  }
}

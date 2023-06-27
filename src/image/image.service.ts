/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { ImageRepository } from '../shared/repository.interface';
import { Upload } from '@aws-sdk/lib-storage';
import {
  S3,
  CompleteMultipartUploadCommandOutput,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ProductsService } from '../products/products.service';
import { plainToInstance } from 'class-transformer';
import Image from './dto/response/image-response.dto';
import NoFileException from './exception/not-file.exception';

@Injectable()
export class ImageService {
  private s3Client: S3;
  private readonly region = this.configService.get('aws.region')!;
  private readonly accessKeyId = this.configService.get<string>('aws.key')!;
  private readonly secretKey = this.configService.get('aws.secret')!;
  private readonly bucketName = this.configService.get('aws.bucket')!;

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

  async uploadFile(file: Express.Multer.File, filename: string) {
    if (!file) {
      throw new NoFileException();
    }

    const { buffer, mimetype, originalname } = file;

    const name = `${uuid()}-${filename}.${this.getTypeFile(originalname)}`;

    const upload = new Upload({
      client: this.s3Client,
      params: {
        Bucket: this.bucketName,
        Body: buffer,
        Key: name,
        ContentType: mimetype,
        Tagging: 'public=yes',
      },
    });
    const {
      Location: url,
      Key: nameFile,
    }: CompleteMultipartUploadCommandOutput = await upload.done();

    return { url, nameFile };
  }

  async create(productId: number, file: Express.Multer.File) {
    const { name: productName } = await this.productService.findOneById(
      productId,
    );

    const { url, nameFile } = await this.uploadFile(file, productName);

    const image = await this.imageRepository.create({
      name: url!,
      url: nameFile!,
      productId,
    });

    return plainToInstance(Image, image);
  }

  async createPresignedUrl(productId: number) {
    const { name: productName } = await this.productService.findOneById(
      productId,
    );
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: `${uuid()}-${productName}.jpg`,
      ContentType: 'image/jpg',
      Tagging: 'public=yes',
    });

    return getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }

  private getTypeFile(origiName: string): string {
    const fileType = origiName.split('.');
    //get the type of file example .png .jpg
    return `${fileType[fileType.length - 1]}`;
  }
}

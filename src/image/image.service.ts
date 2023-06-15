/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { ImageRepository } from '../shared/repository.interface';
import { Upload } from '@aws-sdk/lib-storage';
import { S3, CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3';
import { ProductsService } from '../products/products.service';
import { plainToInstance } from 'class-transformer';
import ImageReponse from './dto/response/image-response.dto';

@Injectable()
export class ImageService {
  private s3Client: S3;
  constructor(
    @Inject('ImageRepository')
    private readonly imageRepository: ImageRepository,
    private readonly configService: ConfigService,
    private readonly productService: ProductsService,
  ) {
    this.s3Client = new S3({
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY')!,
      },
      region: this.configService.get('AWS_REGION'),
    });
  }

  async uploadFile(file: Express.Multer.File, filename: string) {
    const { buffer, mimetype, originalname } = file;

    const name = `${uuid()}-${filename}.${this.getTypeFile(originalname)}`;

    const upload = new Upload({
      client: this.s3Client,
      params: {
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME')!,
        Body: buffer,
        Key: name,
        ContentType: mimetype,
        Tagging: 'public=yes',
      },
    });
    const { Location, Key }: CompleteMultipartUploadCommandOutput =
      await upload.done();

    return { Location, Key };
  }

  async create(productId: number, file: Express.Multer.File) {
    const { name: productName } = await this.productService.findOneById(
      productId,
    );

    const { Location, Key } = await this.uploadFile(file, productName);

    const image = await this.imageRepository.create({
      name: Key!,
      url: Location!,
      productId,
    });

    return plainToInstance(ImageReponse, image);
  }

  private getTypeFile(origiName: string): string {
    const fileType = origiName.split('.');
    //get the type of file example .png .jpg
    return `${fileType[fileType.length - 1]}`;
  }
}

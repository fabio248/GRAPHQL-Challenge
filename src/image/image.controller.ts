import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/request/create-image.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('images')
@UseInterceptors(ClassSerializerInterceptor)
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post(':productId')
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Param('productId') productId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.imageService.create(productId, file);
  }

  @Get()
  findAll() {
    return 'hola';
  }
}

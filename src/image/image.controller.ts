import {
  ClassSerializerInterceptor,
  Controller,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import RoleGuard from '../auth/strategies/role.guard';

@Controller('images')
@UseInterceptors(ClassSerializerInterceptor)
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post(':productId')
  @UseGuards(RoleGuard('MANAGER'))
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Param('productId') productId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.imageService.create(productId, file);
  }
}

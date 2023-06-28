import { Image, Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { ImageRepository } from '../shared/repository.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class PrismaImageRepository implements ImageRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAllByProductId(productId: number): Promise<Image[]> {
    return this.prisma.image.findMany({ where: { productId } });
  }

  async create(data: Prisma.ImageUncheckedCreateInput): Promise<Image> {
    return this.prisma.image.create({ data });
  }

  async findOne(where: Prisma.ImageWhereUniqueInput): Promise<Image | null> {
    return this.prisma.image.findUnique({ where });
  }
}

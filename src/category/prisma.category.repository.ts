import { Injectable } from '@nestjs/common';
import { Category, Prisma } from '@prisma/client';
import { GenericRepository } from '../shared/repository.interface';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export default class PrismaCategoryRepository
  implements GenericRepository<Category>
{
  constructor(private readonly prisma: PrismaService) {}
  findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CategoryWhereUniqueInput;
    where?: Prisma.CategoryWhereInput;
  }): Promise<Category[]> {
    const { skip, take, cursor, where } = params;

    return this.prisma.category.findMany({
      skip,
      take,
      cursor,
      where,
    });
  }
  findOne(where: Prisma.CategoryWhereUniqueInput): Promise<Category | null> {
    return this.prisma.category.findUnique({ where });
  }
  create(data: Prisma.CategoryCreateInput): Promise<Category> {
    return this.prisma.category.create({ data });
  }
  update(params: {
    where: Prisma.CategoryWhereUniqueInput;
    data: Prisma.CategoryUpdateInput;
  }): Promise<Category> {
    const { where, data } = params;

    return this.prisma.category.update({ where, data });
  }
  delete(where: Prisma.CategoryWhereUniqueInput): Promise<Category> {
    return this.prisma.category.delete({ where });
  }
}

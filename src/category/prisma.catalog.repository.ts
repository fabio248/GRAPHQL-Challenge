import { Injectable } from '@nestjs/common';
import { Catalog, Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { GenericRepository } from 'src/shared/repository.interface';

@Injectable()
export default class PrismaCatalogRepository
  implements GenericRepository<Catalog>
{
  constructor(private readonly prisma: PrismaService) {}
  findAll(): Promise<Catalog[]> {
    return this.prisma.catalog.findMany();
  }
  findOne(where: Prisma.CatalogWhereUniqueInput): Promise<Catalog | null> {
    return this.prisma.catalog.findUnique({ where });
  }
  create(data: Prisma.CatalogCreateInput): Promise<Catalog> {
    return this.prisma.catalog.create({ data });
  }
  update(params: {
    where: Prisma.CatalogWhereUniqueInput;
    data: Prisma.CatalogUpdateInput;
  }): Promise<Catalog> {
    const { where, data } = params;

    return this.prisma.catalog.update({ where, data });
  }
  delete(where: Prisma.CatalogWhereUniqueInput): Promise<Catalog> {
    return this.prisma.catalog.delete({ where });
  }
}

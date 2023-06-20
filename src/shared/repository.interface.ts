import { Image, Order, Product, UserLikeProduct } from '@prisma/client';

export interface GenericRepository<T> {
  findAll(params: {
    skip?: number;
    take?: number;
    cursor?: object;
    where?: object;
    include?: object;
  }): Promise<T[]>;
  findOne(where: object): Promise<T | null>;
  create(data: object): Promise<T>;
  update(params: { where: object; data: object }): Promise<T>;
  delete(where: object): Promise<T>;
}

export interface ImageRepository {
  create(data: object): Promise<Image>;
  findOne(where: object): Promise<Image | null>;
}

export interface ProductRepository extends GenericRepository<Product> {
  createLike(data: object): Promise<UserLikeProduct>;
  findLike(userId: number, productId: number): Promise<UserLikeProduct | null>;
}

export interface OrderRepository {
  findAll(params: {
    skip?: number;
    take?: number;
    cursor?: object;
    where?: object;
    include?: object;
  }): Promise<Order[]>;
  findOne(where: object): Promise<Order | null>;
}

import { Exclude, Expose } from 'class-transformer';

export default class CategoryReponse {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  stock: number;

  @Expose()
  price: number;

  @Expose()
  catalogId: number;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}

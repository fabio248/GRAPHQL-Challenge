import { Exclude, Expose } from 'class-transformer';

export default class ImageReponse {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  url: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}

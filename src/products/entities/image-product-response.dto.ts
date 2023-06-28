import { Exclude } from 'class-transformer';
import ImageEntity from '../../image/entities/image.entity';

export default class ImageProductResponse extends ImageEntity {
  @Exclude()
  id: number;

  @Exclude()
  productId: number;
}

import { Exclude } from 'class-transformer';
import Image from '../../image/dto/response/image-response.dto';

export default class ImageProductResponse extends Image {
  @Exclude()
  id: number;

  @Exclude()
  productId: number;
}

import { Exclude } from 'class-transformer';
import ImageReponse from '../../../image/dto/response/image-response.dto';

export default class ImageProductResponse extends ImageReponse {
  @Exclude()
  id: number;

  @Exclude()
  productId: number;
}

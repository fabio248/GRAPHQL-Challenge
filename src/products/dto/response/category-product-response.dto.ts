import { Exclude } from 'class-transformer';
import CategoryReponse from '../../../category/dto/response/category.dto';

export default class CategoryProductResponse extends CategoryReponse {
  @Exclude()
  id: number;
}

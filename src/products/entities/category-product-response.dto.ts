import { Exclude } from 'class-transformer';
import CategoryEntity from '../../category/entity/category.entity';

export default class CategoryProductResponse extends CategoryEntity {
  @Exclude()
  id: number;
}

import { PartialType } from '@nestjs/graphql';
import { CreateCategoryInput } from './create-category.input';

export class UpdateCatalogInput extends PartialType(CreateCategoryInput) {}

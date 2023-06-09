import { PartialType } from '@nestjs/swagger';
import { CreateCatalogDto } from './create-category.dto';

export class UpdateCatalogDto extends PartialType(CreateCatalogDto) {}

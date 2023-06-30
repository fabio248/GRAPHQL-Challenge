import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsBoolean, IsInt, IsOptional, IsPositive, Min } from 'class-validator';

@ArgsType()
export class ProductArgs {
  @Field(() => Boolean, {
    nullable: true,
    description: 'add products that are disable',
    defaultValue: false,
  })
  @IsOptional()
  @IsBoolean()
  embedDisabledProducts?: boolean;

  @Field(() => Int, {
    nullable: true,
    description: 'numbers of products to skip',
    defaultValue: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  skip?: number;

  @Field(() => Int, {
    nullable: true,
    description: 'numbers of products to take',
    defaultValue: 10,
  })
  @IsOptional()
  @IsPositive()
  take?: number;

  @Field(() => Int, {
    nullable: true,
    description: 'filter product by category',
  })
  @IsOptional()
  @IsPositive()
  categoryId?: number;
}

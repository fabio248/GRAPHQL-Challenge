import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ImageService } from './image.service';
import ImageEntity from './entities/image.entity';
import { CreateImageInput } from './dto/input';

@Resolver()
export class ImageResolver {
  constructor(private readonly imageService: ImageService) {}

  @Mutation(() => ImageEntity, {
    name: 'addImageToProduct',
    description: 'Manager can add image to specific product',
  })
  async addImage(
    @Args('createImageInput', { type: () => CreateImageInput })
    createImageInput: CreateImageInput,
  ) {
    return this.imageService.create(createImageInput);
  }
}

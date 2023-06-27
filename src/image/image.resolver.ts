import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { ImageService } from './image.service';

@Resolver()
export class ImageResolver {
  constructor(private readonly imageService: ImageService) {}

  @Mutation(() => String, {
    name: 'getPresignedUrlS3',
    description: 'get url to upload image',
  })
  async getPresignedUrl(
    @Args('productId', { type: () => Int }) productId: number,
  ) {
    return this.imageService.createPresignedUrl(productId);
  }
}

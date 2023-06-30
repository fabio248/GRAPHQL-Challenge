import { registerEnumType } from '@nestjs/graphql';

export enum mimeType {
  jpg = 'image/jpg',
  png = 'image/png',
  jpge = 'image/jpge',
}

registerEnumType(mimeType, { name: 'mimeType' });

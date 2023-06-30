import { Image } from '@prisma/client';

export type PayloadJwt = {
  sub: string;
  role: string;
  iat?: number;
};

export type ImageWithUrl = Image & { url: string | Promise<string> };

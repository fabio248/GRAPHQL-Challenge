import { UserDto } from 'src/users/dto/user-response.dto';
import { PayloadJwt } from './generic';

declare global {
  namespace Express {
    export interface Request {
      user?: UserDto | PayloadJwt;
    }
  }
}

export {};

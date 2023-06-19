import { UserResponse } from 'src/users/dto/response/user-response.dto';
import { PayloadJwt } from './generic';

declare global {
  namespace Express {
    export interface Request {
      user?: UserResponse | PayloadJwt;
    }
  }
}

export {};

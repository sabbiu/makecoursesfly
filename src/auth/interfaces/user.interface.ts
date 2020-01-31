import { Document } from 'mongoose';

export interface User extends Document {
  name: string;
  username: string;
  password: string;
  salt: string;
  photo: string;

  validatePassword(password: string): Promise<boolean>;
}

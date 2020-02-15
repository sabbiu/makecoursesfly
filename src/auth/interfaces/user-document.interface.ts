import { Document } from 'mongoose';

export interface UserDoc extends Document {
  name: string;
  email: string;
  username: string;
  password: string;
  salt: string;
  photo: string;
  googleId: string;
  createdAt: Date;
  updatedAt: Date;

  validatePassword(password: string): Promise<boolean>;
}

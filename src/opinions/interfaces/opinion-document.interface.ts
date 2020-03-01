import { Document } from 'mongoose';

export interface OpinionDoc extends Document {
  text: string;
  createdBy: string;
  post: string;
  createdAt: Date;
  updatedAt: Date;
}

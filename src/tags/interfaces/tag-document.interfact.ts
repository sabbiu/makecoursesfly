import { Document } from 'mongoose';

export interface TagDoc extends Document {
  title: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

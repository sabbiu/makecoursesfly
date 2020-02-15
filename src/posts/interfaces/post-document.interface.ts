import { Document } from 'mongoose';

export interface PostDoc extends Document {
  title: string;
  url: string;
  createdBy: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

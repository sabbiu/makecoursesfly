import { Schema } from 'mongoose';
import * as mongooseUniqueValidator from 'mongoose-unique-validator';

export const PostSchema = new Schema(
  {
    title: {
      type: Schema.Types.String,
      required: true,
      index: true,
    },
    url: {
      type: Schema.Types.String,
      required: true,
      index: true,
      unique: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Tag',
        },
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

PostSchema.index({ title: 'text', url: 'text' });

PostSchema.pre('find', function() {
  this.populate('tags', 'title');
});

PostSchema.plugin(mongooseUniqueValidator);

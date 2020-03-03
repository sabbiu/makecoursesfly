import { Schema } from 'mongoose';

export const OpinionSchema = new Schema(
  {
    text: {
      type: Schema.Types.String,
      required: true,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

OpinionSchema.pre('find', function() {
  this.populate('createdBy', '_id username photo name');
});

OpinionSchema.index({ text: 'text' });

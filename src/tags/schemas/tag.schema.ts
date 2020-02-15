import { Schema } from 'mongoose';
import * as mongooseUniqueValidator from 'mongoose-unique-validator';

export const TagSchema = new Schema(
  {
    title: {
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
  },
  {
    timestamps: true,
  }
);

TagSchema.index({ title: 'text' });

// TagSchema.pre('find', function() {
//   this.populate('createdBy', 'username photo');
// });

TagSchema.plugin(mongooseUniqueValidator);

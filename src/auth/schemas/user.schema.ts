import { Schema } from 'mongoose';
import * as bcrypt from 'bcryptjs';
const mongooseUniqueValidator = require('mongoose-unique-validator');

export const UserSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    username: {
      type: Schema.Types.String,
      required: true,
      index: true,
      unique: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
      index: true,
      unique: true,
    },
    password: Schema.Types.String,
    photo: {
      type: Schema.Types.String,
      default: 'https://i.picsum.photos/id/0/200/200.jpg',
    },
    salt: Schema.Types.String,
    googleId: Schema.Types.String,
  },
  { timestamps: true }
);

UserSchema.methods.validatePassword = async function(password: string) {
  const hash = await bcrypt.hash(password, this.salt);
  return hash === this.password;
};

UserSchema.plugin(mongooseUniqueValidator);

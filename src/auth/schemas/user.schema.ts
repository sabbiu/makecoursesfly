import { Schema } from 'mongoose';
import * as bcrypt from 'bcrypt';

export const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  photo: { type: String, default: 'https://i.picsum.photos/id/0/200/200.jpg' },
  salt: String,
});

UserSchema.methods.validatePassword = async function(password: string) {
  const hash = await bcrypt.hash(password, this.salt);
  return hash === this.password;
};

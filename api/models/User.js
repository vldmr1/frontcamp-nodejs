import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userName: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String
  },
});

userSchema.methods.verifyPassword = function(password) {
  return this.password === password;
}

export const User = mongoose.model('User', userSchema);
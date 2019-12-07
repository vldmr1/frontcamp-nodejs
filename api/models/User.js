import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.methods.verifyPassword = function(password) {
  return this.password === password;
}

export const User = mongoose.model('User', userSchema);
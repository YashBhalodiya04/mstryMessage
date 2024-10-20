import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

export interface User extends Document {
  userName: string;
  password: string;
  messages: Message[];
  createAt: Date;
  email: string;
  varifyCode: string;
  varifyCodeExpiry: Date;
  isAcceptingMessages: boolean;
  isVarified: boolean;
}

const UserSchema: Schema<User> = new Schema({
  userName: {
    type: String,
    required: [true, "Please enter a username"],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please enter a email"],
    unique: true,
    trim: true,
    match: [/.+\@.+\..+/, "Please enter a valid email"],
  },
  messages: [MessageSchema],
  varifyCode: {
    type: String,
    required: true,
  },
  varifyCodeExpiry: {
    type: Date,
    required: true,
  },
  isAcceptingMessages: {
    type: Boolean,
    required: true,
  },
  isVarified: {
    type: Boolean,
    default: false,
  },
  createAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const UserModal = (mongoose.models.User as  mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModal;

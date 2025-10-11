import mongoose, { Schema, Document } from "mongoose";

// message is the part of mongoose document, so we have extended Message with Doc
export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

// user schema
export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  messages: Message[]; // A single user can have multiple Messages.
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"], // This is how we can give the custom messgae.
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "Please use a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"], // This is how we can give the custom messgae.
  },
  verifyCode: {
    type: String,
    required: [true, "Verify code is required"], // This is how we can give the custom messgae.
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verify code expiry is required"], // This is how we can give the custom messgae.
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessages: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchema],
});

// This mean as nextjs runs on the edge, so it's not aware of are models already created or it's a new model, as we check this we also type checking it if we are getting same data from DB as our User interface.
const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;

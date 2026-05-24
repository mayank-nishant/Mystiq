import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema<Message> = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Message content is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true,
      lowercase: true,
      minlength: [2, "Username must be at least 2 characters"],
      maxlength: [20, "Username can't exceed 20 characters"],
      match: [/^[a-zA-Z0-9_]+$/, "Username must not contain special characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+\@.+\..+/, "Please use a valid email address"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },

    verifyCode: {
      type: String,
      required: [true, "Verify Code is required"],
    },

    verifyCodeExpiry: {
      type: Date,
      required: [true, "Verify Code Expiry is required"],
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
  },
  {
    timestamps: true,
  },
);

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModel;

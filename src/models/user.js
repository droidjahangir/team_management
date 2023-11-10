// models index
import mongoose from 'mongoose';
import validator from 'validator';
import { Id } from './common.model.js';

const Schema = mongoose.Schema;

const UserProfileSchema = new Schema(
  {
    name: {
      type: String,
      index: true,
    },
    nameUpdatedAt: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'others'],
      index: true,
    },
    birthday: {
      type: Date,
      index: true,
    },
    keepingSpace: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    hometown: {
      type: String,
    },
    hometownPlaceId: {
      type: String,
    },
    occupation: {
      type: String,
    },
    language: {
      type: String,
      default: 'no',
    },
    nationality: {
      type: String,
    },
    picture: {
      type: Object,
    },
    aboutMe: {
      type: String,
      maxLength: 1000,
    },
    active: {
      type: Boolean,
      index: true,
    },
    streetAddress: {
      type: String,
    },
    avatarKey: {
      type: String,
    },
    settings: {
      type: Object,
    },
    images: {
      type: [String],
      default: undefined,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    zipCode: {
      type: String,
    },
  },
  { _id: false }
);

// user model
const userSchema = new Schema(
  [
    Id,
    {
      name: {
        type: String,
        trim: true,
        index: true,
        required: true,
      },
      email: {
        type: String,
        index: true,
        trim: true,
        required: true,
        validate: [validator.isEmail, 'Email is invalid'],
      },
      password: {
        type: String,
        required: true,
      },
      profile: {
        type: UserProfileSchema,
      },
      title: {
        type: String,
      },
      images: [String],
      role: {
        type: String,
        required: true,
        enum: ['ADMIN', 'FRONTEND', 'BACKEND', 'FULL_STACK'],
      },
      status: {
        type: String,
        enum: ['active', 'invited'],
      },
      createdAt: {
        type: Date,
      },
    },
  ],
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
  }
);

userSchema.index(
  {
    _id: 1,
    email: 1,
    name: 1,
  },
  { name: 'email_name' }
);

const user = mongoose.model('user', userSchema);

export default user;

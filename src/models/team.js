// models index
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { Id } from './common.model.js';

// user model
const teamSchema = new Schema(
  [
    Id,
    {
      name: {
        type: String,
        trim: true,
        index: true,
        required: true,
      },
      category: {
        type: String,
        enum: ['App engineering', 'Business analyst', 'Team lead', 'Hr'],
      },
      description: {
        type: String,
      },
      goal: {
        type: String,
      },
      userIds: {
        type: [String],
      },
      groupIds: {
        type: [String],
      },
      invitedUserIds: {
        type: [String],
      },
    },
  ],
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
  }
);

const team = mongoose.model('team', teamSchema);

export default team;

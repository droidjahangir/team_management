import mongoose from 'mongoose';
import nid from 'nid';

export const Id = new mongoose.Schema({
  _id: {
    type: String,
  },
});

Id.pre('save', function (next) {
  // For Seed:
  if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'dev') {
    this._id = this._id ? this._id : nid(17);
  } else {
    this._id = nid(17);
  }
  next();
});

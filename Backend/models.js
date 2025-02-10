const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcryptjs.hash(this.password, 10);
  }
  next();
});

const EventSchema = new mongoose.Schema({
  name: String,
  date: Date,
  description: String,
  organizer: String,
});

const User = mongoose.model('User', UserSchema);
const Event = mongoose.model('Event', EventSchema);

module.exports = { User, Event };

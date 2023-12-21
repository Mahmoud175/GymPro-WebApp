const mongoose = require('mongoose');

const membershipTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    unique: true
  },
  onlineMeetings: {
    type: Number,
    required: true
  }
});

const MembershipType = mongoose.model('MembershipType', membershipTypeSchema);

// Adding predefined types
const premiumType = new MembershipType({
  type: 'Premium',
  onlineMeetings: 2
});

const gymRatType = new MembershipType({
  type: 'GymRat',
  onlineMeetings: 4
});

// Saving predefined types to the database
premiumType.save();
gymRatType.save();

module.exports = MembershipType;

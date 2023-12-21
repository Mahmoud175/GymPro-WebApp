const mongoose = require('mongoose');

const coachSchema = new mongoose.Schema({
  userId:{
    type:String , 
    required:true
    },
  name: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    }
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: String,
  assignedCustomers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer', // Reference to the Customer schema
    default: null,
  }],
});

const Coach = mongoose.model('Coach', coachSchema);

module.exports = Coach;

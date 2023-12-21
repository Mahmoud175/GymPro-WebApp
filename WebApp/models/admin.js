const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  userId:{
    type:String , 
    required:true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;

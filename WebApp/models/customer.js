const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
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
  dateOfBirth: Date,
  weight: Number,
  height: Number,
  gender: String,
  goal: String,
  personalCoach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'coach', // Assuming your Coach schema is named 'Coach'
    default: null
  },
  membershipData: {
    workoutPlan: [
      {
        day: String,
        category: String,
        excercises:[
          {
            exercise: String,
            reps: String,
            sets: String
          }
        ]
      }
      
    ],
    dietPlan: [
      {
        meal: String,
        foodItems: String,
        amount: String,
      }
    ],
    type: String,

    nextMeeting:{
      meetingDateTime:{
        meetingDate: String,
        meetingtime: String,
      },
      meetingLink: String,
    },
    
    sessionsLeft: Number,
    default: null
  }
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;

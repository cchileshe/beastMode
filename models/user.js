const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  ulevel: {
    type: String,
    default:'client'
  }
});


module.exports = mongoose.model('User', userSchema);
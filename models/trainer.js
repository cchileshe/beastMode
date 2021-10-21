const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const trainerSchema = new Schema({
    
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
    default:'trainer'
  }
});


module.exports = mongoose.model('Trainer', trainerSchema);
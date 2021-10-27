const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    
  trainerid: {
    type: String,
    required: true
  },
  userid: {
    type: String,
    required: true
  },
  appointment: {
    type: String,
    required: true
  }
});


module.exports = mongoose.model('Appointment', appointmentSchema);
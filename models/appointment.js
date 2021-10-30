const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  appointment: {
    type: Date,
    required: true
  },
  user: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }],
  trainer: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Trainer'
  }]
});


module.exports = mongoose.model('Appointment', appointmentSchema);
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const noteSchema = new Schema({
    
  trainerid: {
    type: String,
    required: true
  },
  userid: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
});


module.exports = mongoose.model('Note', noteSchema);
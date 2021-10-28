const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const noteSchema = new Schema({
    

  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
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


module.exports = mongoose.model('Note', noteSchema);
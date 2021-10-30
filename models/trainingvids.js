const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const trainingvidSchema = new Schema({

  title: {
    type: String,
    required: true
  },
  tlink: {
    type: String,
    required: true
  },
  trainer: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Trainer'
  }]
});


module.exports = mongoose.model('Trainingvid', trainingvidSchema);
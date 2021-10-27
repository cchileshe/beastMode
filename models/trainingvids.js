const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const trainingvidSchema = new Schema({
    
  id: {
    type: String,
    required: true
  },
  tlink: {
    type: String,
    required: true
  }
});


module.exports = mongoose.model('Trainingvid', trainingvidSchema);
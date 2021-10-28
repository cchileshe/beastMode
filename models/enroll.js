const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const enrollSchema = new Schema({


    email: {
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

module.exports = mongoose.model('enroll', enrollSchema);

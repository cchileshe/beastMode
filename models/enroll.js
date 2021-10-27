const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const enrollSchema = new Schema({


    email: {
      type: String,
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    trainerId:{
        type: Schema.Types.ObjectId,
        require:true,
        ref:'Trainer'
    }





});

module.exports = mongoose.model('enroll', enrollSchema);

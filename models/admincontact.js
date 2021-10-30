const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const admincontactSchema = new Schema({
    

email: {
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


module.exports = mongoose.model('admincontact', admincontactSchema);
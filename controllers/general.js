const Trainer = require('../models/trainer');
const Admincontact = require('../models/admincontact');
const { validationResult } = require('express-validator');

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
      });
};


exports.getIndex = (req, res, next) => {

  res.render('beast/index', {
    pageTitle: 'Beast Mode',
    path: '/'
  });
};


exports.findTrainer = (req, res, next) => {
  Trainer.find()
  .then(trainers => {
        res.render('beast/findtrainer', {
          pageTitle: 'Find Trainers',
          path: '/find-trainer',
          trainer:trainers,
        });
    });
};


exports.getContact = (req, res, next) => {
        res.render('beast/contact', {
          pageTitle: 'Contact Us',
          path: '/contact-us',
          errorMessage: null,
          hasError: false,
          hasSuccess:false,
          validationErrors: []
        });
};



exports.postContact = (req, res, next) => {
  const email = req.body.email;
  const subject = req.body.subject;
  const mymessage = req.body.message;
  const errors = validationResult(req);

if (!errors.isEmpty()) {
  return res.status(422).render('/beast/contact-us', {
    pageTitle: 'Contact us',
    path: '/send',
    hasError: true,
    admin: {
      email:email,
      subject: subject,
      message: mymessage,
    },
    errorMessage: errors.array()[0].msg,
    validationErrors: errors.array()
  });
}

const admincontact= new Admincontact({
      email:email,
      subject: subject,
      message: mymessage
});
admincontact.save();

res.render('beast/contact', {
  pageTitle: 'Contact Us',
  path: '/contact-us',
  errorMessage: null,
  hasError: false,
  hasSuccess:true,
  validationErrors: []
});


};
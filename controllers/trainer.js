const Trainer = require('../models/trainer');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');





exports.getSignup = (req, res, next) => {
    res.render('trainer/signupTrainer', {
      pageTitle: 'Signup trainer',
      path: '/trainer/sign-up',
      hasError: false,
      errorMessage: null,
      validationErrors: []
    });
};


exports.getProfile = (req, res, next) => {
  res.render('trainer/profile', {
    pageTitle: 'Welcome',
    path: '/trainer/registered',
    
  });
};




exports.postRegister = (req, res, next) => {

  const fname = req.body.fname;
  const lname = req.body.lname;
  const address = req.body.address;
  const email  = req.body.email;
  const password  = req.body.password;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log("empty",errors.array());
    return res.status(422).render('trainer/signuptrainer', {
      pageTitle: 'Sign Up',
      path: '/trainer/sign-up',
      hasError: true,
      trainer: {
        fname: fname,
        lname: lname,
        address: address,
        email: email,
        password: password
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }


  bcrypt
  .hash(password, 12)
  .then(hashedPassword => {
  const trainer = new Trainer({
    fname: fname,
    lname: lname,
    address: address,
    email: email,
    password: hashedPassword
  });
  trainer
    .save()
  })
    .then(result => {
      // console.log(result);
      console.log('Trainer Registered');
      res.redirect('/trainer/registered');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
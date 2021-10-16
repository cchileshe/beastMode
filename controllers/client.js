const User = require('../models/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

exports.getSignup = (req, res, next) => {
    res.render('client/signupClient', {
      pageTitle: 'Signup Client',
      path: '/user/sign-up',
      hasError: false,
      errorMessage: null,
      validationErrors: []
    });
};


exports.getProfile = (req, res, next) => {
  res.render('client/profile', {
    pageTitle: 'Welcome',
    path: '/user/registered',
    
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
    return res.status(422).render('client/signupClient', {
      pageTitle: 'Sign Up',
      path: '/user/sign-up',
      hasError: true,
      user: {
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
  const user= new User({
    fname: fname,
    lname: lname,
    address: address,
    email: email,
    password: hashedPassword
  });
  user
    .save()
  })
    .then(result => {
      // console.log(result);
      console.log('User Registered');
      res.redirect('/user/registered');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
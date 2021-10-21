const trainer = require('../models/trainer');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

exports.getSignup = (req, res, next) => {
    res.render('trainer/signuptrainer', {
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


exports.getDashboard = (req, res, next) => {
    if (req.session.isLoggedIn && req.session.istrainer ==="trainer") {
  
      res.render('trainer/dashboard', {
        pageTitle: 'My Account',
        path: '/trainer/account',
    });
  }else{
    res.redirect('/trainer/login')
  }
};



exports.getLogin = (req, res, next) => {
   
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('trainer/login', {
    path: '/trainer/login',
    pageTitle: 'Login',
    errorMessage: message,
    oldInput: {
      email: '',
      password: ''
    },
    validationErrors: []
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);

  
  if (!errors.isEmpty()) {
    return res.status(422).render('trainer/login', {
      path: '/trainer/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password
      },
      validationErrors: errors.array()
    });
  }

  trainer.findOne({ email: email })
    .then(trainer => {
      if (!trainer) {
        return res.status(422).render('trainer/login', {
          path: '/trainer/login',
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password.',
          oldInput: {
            email: email,
            password: password
          },
          validationErrors: []
        });
      }
      bcrypt
        .compare(password, trainer.password)
        .then(doMatch => {
          if (doMatch) {

        
                req.session.isLoggedIn = true;
                req.session.istrainer= 'trainer';
                req.session.trainer = trainer;
                
                return req.session.save(err => {
                  console.log(err);
                  res.redirect('/trainer/account');
                });
       

          }
          return res.status(422).render('trainer/login', {
            path: 'trainer/login',
            pageTitle: 'Login',
            errorMessage: 'Invalid email or password.',
            oldInput: {
              email: email,
              password: password
            },
            validationErrors: []
          });
        })
        .catch(err => {
          console.log(err);
          res.redirect('/');
        });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
  const trainer= new trainer({
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
      console.log('trainer Registered');
      res.redirect('/trainer/registered');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
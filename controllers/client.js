const User = require('../models/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

exports.getSignup = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    res.render('client/signupClient', {
      pageTitle: 'Signup Client',
      path: '/user/sign-up',
      hasError: false,
      errorMessage: null,
      editing: false,
      validationErrors: []
    });
  }else{
    res.redirect('/user/account')
  }
};






exports.manageAccount = (req, res, next) => {
  const editMode = req.query.edit;
  const clientid = req.params.clientid;



  if (req.session.isLoggedIn) {
          res.render('client/signupClient', {
            pageTitle: 'Update Client',
            path: '/user/manage-account',
            user: req.session.user,
            hasError: false,
            editing: editMode,
            errorMessage: null,
            validationErrors: []
      });
  }
  // else{
  //   res.redirect('/')
  // }
};



exports.updateAccount = (req, res, next) => {

  const userId = req.body.userId
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
    User.findById(userId)
    .then(user => {
                user.fname = fname;
                user.lname = lname;
                user.address= address;
                user.email= email;
                user.password= hashedPassword;
            

      return user.save();
    })
    .then(result => {

      User.findOne({ email: email })
      .then(user => {
          req.session.user=user;
      })
      .then(result=>{
        console.log('UPDATED Account!');
        res.redirect('/user/account');
      })
   
      
     
    })
  })
  .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}



exports.getProfile = (req, res, next) => {
  res.render('client/profile', {
    pageTitle: 'Welcome',
    path: '/user/registered',
    
  });
};


exports.getDashboard = (req, res, next) => {
 

    if (req.session.isLoggedIn && req.session.isUser ==="client") {
    
      res.render('client/dashboard', {
        user: req.session.user,
        pageTitle: 'My Account',
        path: '/user/account',
      });
   
  }else{
    res.redirect('/user/login')
  }
};



exports.getLogin = (req, res, next) => {
   
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('client/login', {
    path: '/user/login',
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
    return res.status(422).render('client/login', {
      path: '/user/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password
      },
      validationErrors: errors.array()
    });
  }

    User.findOne({ email: email })
      .then(user => {
      if (!user) {
        return res.status(422).render('client/login', {
          path: '/user/login',
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
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {

            if(user.ulevel==="client"){ 
                req.session.isLoggedIn = true;
                req.session.isUser= 'client';
                req.session.user = user;
                
                return req.session.save(err => {
                  console.log(err);
                  res.redirect('/user/account');
                });
          }

          }
          return res.status(422).render('client/login', {
            path: 'user/login',
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
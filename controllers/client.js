const User = require('../models/user');
const Trainer = require('../models/trainer');
const Enroll = require('../models/enroll');
const Appointment = require('../models/appointment');
const Trainingvid = require('../models/trainingvids');
const Note=require('../models/note');


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
    // console.log("empty",errors.array());
    return res.status(422).render('client/signupClient', {
      pageTitle: 'Update Account',
      path: '/user/manage-account/account?edit=true',
      hasError: true,
      user: {
        fname: fname,
        lname: lname,
        address: address,
        email: email,
        password: password,
        editing: editMode,
        _id:userId

      },
      editing:true,
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
        // console.log('UPDATED Account!');
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


exports.postEnroll= (req, res, next) => {
 
  const trainerId = req.body.trainerId;
  
  Trainer.findById(trainerId)
    .then(trainers => {
      const enroll = new Enroll({
          email: req.user.email,
          user: req.user,
          trainer:trainerId
      });
      return enroll.save();
    })
    .then(result => {
      // console.log('hey');
      // console.log(result);
      res.redirect('/user/account');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}

exports.postUnenroll = (req, res, next) => {

  const trainerId = req.body.trainerId;
    Enroll.deleteOne({ 'user' : req.user._id, trainer:trainerId })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });

    Note.deleteMany({ 'user' : req.user._id, trainer:trainerId }).catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });

    Appointment.deleteMany({ 'user' : req.user._id, trainer:trainerId })
    .then(result=>{
      res.redirect('/user/account');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
    
};


exports.getProfile = (req, res, next) => {
  res.render('client/profile', {
    pageTitle: 'Welcome',
    path: '/user/login',
    
  });
};


exports.getDashboard = (req, res, next) => {


  Appointment.find({user: req.user._id}).countDocuments().then(appcount=>{
    
      

    Enroll.find({user: req.user._id}).populate('trainer')
      .then(trainer=>{

        
        const trainerList=trainer.map(x => x.trainer[0].fname);
    

      const billings=trainerList.length * 37;
      res.render('client/dashboard', {
        user: req.session.user,
        pageTitle: 'My Account',
        path: '/user/account',
        billing:billings,
        appcount:appcount,
        trainername:trainerList
      });
      });
    
    })


   
  
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
      res.redirect('/user/account');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};


exports.mytrainer = (req, res, next) => {
  Enroll.find({'user': req.user._id})
  .populate('trainer')
  .then(trainers=>{
    res.render('client/mytrainer', {
      pageTitle: 'My Trainers List',
      path: '/user/mytrainer',
      trainer:trainers,
      user:req.user
    });
  });
};


exports.trainers = (req, res, next) => {

  Trainer.findOne({'_id':req.params.trainerid})
  .then(trainer => {
      res.render('client/trainerprofile', {
        pageTitle: 'View Profile',
        path: '/user/trainers',
        trainers:trainer,
        user:req.user
      });
  });

};




exports.getappointment = (req, res, next) => {
  Appointment.find({'user': req.user._id}).populate('trainer').sort([['appointment', 'asc']]).then(appointment=>{
    res.render('client/myappointment', {
      pageTitle: 'Appointment List',
      path: '/user/myappointment',
      user:req.user,
      appointments:appointment
     });
  })


};







exports.trainings = (req, res, next) => {
  Trainingvid.find({'trainer': req.params.trainerid}).populate('trainer')
  .then(trainervid => {
    const trainerName=trainervid.map(x => x.trainer[0].fname);

    // console.log(trainerName[0]);
      res.render('client/mytrainings', {
        pageTitle: 'View Trainings',
        path: '/user/mytrainings',
        trainvid:trainervid,
        user:req.user,
        trainer:trainerName
      });
    });
  };

exports.appointment = (req, res, next) => {
  Trainer.find({'_id':req.params.trainerid})
  .then(trainer => {
    res.render('client/appointment', {
      pageTitle: 'Make Appointment',
      path: '/user/appointment',
      trainers:trainer
    });
  });

};


exports.appointment = (req, res, next) => {


  const trainerid=req.params.trainerid
  Appointment.find({'user': req.user._id, 'trainer':req.params.trainerid})
  .populate('trainer')
  .sort([['appointment', 'asc']])
  .then(appointment=>{
    // console.log('hey',appointment)
    res.render('client/appointment', {
      pageTitle: 'Make Appointment',
      path: '/user/appointment',
      appointments:appointment,
      user:req.user,
      trainerID:trainerid
  });
};

exports.postAppointment = (req, res, next) => {
 
  const appt = req.body.appointment;
  const trainerId = req.body.trainerId;
  const appointment = new Appointment({
    appointment:appt,
    user:req.user._id,
    trainer: trainerId

  });
  appointment.save();
  res.redirect('/user/myappointment');
};



exports.sendNote = (req, res, next) => {
  Trainer.find({'_id':req.params.trainerid})
  .then(trainer => {
    res.render('client/sendnote', {
      pageTitle: 'Send A note',
      path: '/user/send-note',
      trainers:trainer,
      user:req.user,
      errorMessage: null,
      hasError: false,
      hasSuccess:false,
      validationErrors: []
    });
  });

};

exports.postSendNote = (req, res, next) => {

  
  const subject = req.body.subject;
  const mymessage = req.body.message;
  const trainerId = req.body.trainerId;
  const errors = validationResult(req);

  // console.log('subject',subject);
  // console.log('subject',mymessage);
  // console.log('subject',trainerId);

if (!errors.isEmpty()) {
  console.log("empty",errors.array());
  return res.status(422).render('client/sendnote', {
    pageTitle: 'Send A note',
    path: '/user/send-note/',
    hasError: true,
    user: {
      subject:subject,
      message:mymessage,
      user:req.user,
    },
    errorMessage: errors.array()[0].msg,
    validationErrors: errors.array()
  });
}


  const note = new Note({
    subject:subject,
    message:mymessage,
    user:req.user._id,
    trainer: trainerId,
  });
  note.save();
  res.redirect('/user/mytrainer');
};





exports.trainerList = (req, res, next) => {
  //check if it is enrolled.

  Enroll.find({'user': req.user._id}).populate('trainer').then(enrolled=>{
  Trainer.find()
  .then(trainer => {
    res.render('client/trainerList', 
    {
      pageTitle: 'List of Trainers',
      path: '/user/trainer-list',
      trainers:trainer,
      trainersMark:enrolled,
      user:req.user
     });

  });

})
};

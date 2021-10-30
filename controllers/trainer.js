const Trainer = require('../models/trainer');
const Trainingvid = require('../models/trainingvids');
const Enroll = require('../models/enroll');
const Appointment = require('../models/appointment');
const Note = require('../models/note');


const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

exports.getSignup = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    res.render('trainer/signuptrainer', {
      pageTitle: 'Signup trainer',
      path: '/trainer/sign-up',
      hasError: false,
      errorMessage: null,
      editing: false,
      validationErrors: []
    });
  }else{
    res.redirect('/trainer/account')
  }
};






exports.manageAccount = (req, res, next) => {
  const editMode = req.query.edit;
  const trainerid = req.params.trainerid;



  if (req.session.isLoggedIn) {
          res.render('trainer/signuptrainer', {
            pageTitle: 'Update trainer',
            path: '/trainer/manage-account',
            trainer: req.session.trainer,
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
  
  const trainerId = req.body.trainerId
  const fname = req.body.fname;
  const lname = req.body.lname;
  const address = req.body.address;
  const email  = req.body.email;
  const password  = req.body.password;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // console.log("empty",errors.array());
    return res.status(422).render('trainer/signuptrainer', {
      pageTitle: 'Update Account',
      path: '/trainer/manage-account/account?edit=true',
      hasError: true,
      trainer: {
        fname: fname,
        lname: lname,
        address: address,
        email: email,
        password: password,
        _id:trainerId

      },
      editing:true,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  bcrypt
  .hash(password, 12)
  .then(hashedPassword => {
    Trainer.findById(trainerId)
    .then(trainer => {
                trainer.fname = fname;
                trainer.lname = lname;
                trainer.address= address;
                trainer.email= email;
                trainer.password= hashedPassword;
            

      return trainer.save();
    })
    .then(result => {

      Trainer.findOne({ email: email })
      .then(trainer => {
          req.session.trainer=trainer;
      })
      .then(result=>{
        // console.log('UPDATED Account!');
        res.redirect('/trainer/account');
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
  res.render('trainer/profile', {
    pageTitle: 'Welcome',
    path: '/trainer/account',
    
  });
};


exports.getDashboard = (req, res, next) => {

  //working on it


  Appointment.find({trainer: req.trainer._id}).countDocuments().then(appcount=>{
  Enroll.find({trainer: req.trainer._id}).countDocuments()
    .then(result=>{
      const earnings=result * 200 + (appcount * 50);
          res.render('trainer/dashboard', {
            trainers: req.session.trainer,
            pageTitle: 'My Account',
            path: '/trainer/account',
            enrollcount:result,
            earnings:earnings,
            appcount:appcount
          });
    })
})
   

    
};


exports.myclient = (req, res, next) => {
  Enroll.find({'trainer': req.trainer._id})
  .populate('user')
  .then(user=>{
    res.render('trainer/myclient', {
      pageTitle: 'My Client',
      path: '/trainer/myclient',
      trainers: req.session.trainer,
      users:user
    });
  });
};


exports.myAppointment = (req, res, next) => {
  Appointment.find({'trainer': req.trainer._id}).populate('user').sort([['appointment', 'asc']]).then(myappointment=>{
    res.render('trainer/myAppointment', {
      pageTitle: 'My Appointment',
      path: '/trainer/myappointment',
      trainers: req.session.trainer,
      myappointments:myappointment,
    });
});
};



exports.specificAppointment = (req, res, next) => {
  const clientid = req.params.clientid;

  Appointment.find({'trainer': req.trainer._id, 'user':clientid}).sort([['appointment', 'asc']]).populate('user')
  .then(myappointment=>{

    const clientNames=myappointment.map(x => x.user[0].fname);
    // console.log(clientNames, clientid);
    res.render('trainer/specificappointment', {
      pageTitle: 'My Appointment',
      path: '/trainer/appointment',
      trainers: req.session.trainer,
      myappointments:myappointment,
      clientName: clientNames
    });
});
};




exports.myNote = (req, res, next) => {
  Note.find({'trainer': req.trainer._id}).populate('user')
  .then(notes=>{
  res.render('trainer/myNote', {
    pageTitle: 'My Note',
    path: '/trainer/mynote',
    trainers: req.session.trainer,
    note:notes
  });
});
};


exports.specificNote = (req, res, next) => {
  const clientid = req.params.clientid;

  Note.find({'trainer': req.trainer._id, 'user':clientid}).populate('user')
  .then(mynote=>{

    const clientNames=mynote.map(x => x.user[0].fname);
   
    res.render('trainer/specificnote', {
      pageTitle: 'Note',
      path: '/trainer/note',
      trainers: req.session.trainer,
      mynotes:mynote,
      clientName: clientNames
    });
});
};




exports.mytrainings = (req, res, next) => {
    //rioedit
    Trainingvid.find({'trainer': req.trainer._id}).then(trainvids=>{  

      res.render('trainer/trainings', {
        pageTitle: 'My Trainings',
        trainer: req.session.trainer,
        path: '/trainer/mytrainings',
        trainers: req.session.trainer,
        validationErrors: [],
        errorMessage: null,
        hasError: false,
        trainvid:trainvids
    });
  })
};


exports.postTrainings = (req, res, next) => {


    const title = req.body.title;
    const tlink = req.body.tlink;
    const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // console.log("empty",errors.array());
    return res.status(422).render('trainer/signuptrainer', {
      pageTitle: 'Trainings',
      path: '/trainer/mytraining',
      hasError: true,
      trainer: {
        title: title,
        tlink: tlink,
        trainer:req.session.trainer
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  const trainervid= new Trainingvid({
    title: title,
    tlink: tlink,
    trainer:req.session.trainer
  });
  trainervid.save();
  res.redirect('/trainer/mytrainings');
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

    Trainer.findOne({ email: email })
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

            if(trainer.ulevel==="trainer"){ 
                req.session.isLoggedIn = true;
                req.session.isUser= 'trainer';
                req.session.trainer = trainer;
                
                return req.session.save(err => {
                  // console.log(err);
                  res.redirect('/trainer/account');
                });
          }

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
          // console.log(err);
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
    //console.log("empty",errors.array());
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
  const trainer= new Trainer({
    fname: fname,
    lname: lname,
    address: address,
    email: email,
    password: hashedPassword
  });
  trainer
    .save()
  }).then(result => {
      // console.log(result);
      console.log('trainer Registered');
      res.redirect('/trainer/registered');
    })
    .catch(err => {
    
      // console.log(err);
    });



};
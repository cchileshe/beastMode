const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const cors = require('cors') 
const User = require('./models/user');
const bodyParser = require('body-parser');

const app = express();

/**Addding bootstrap to File */
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


/**addinng MongoDB URL */
const MONGODB_URL = process.env.MONGODB_URL || "mongodb+srv://cse341proj:sud3kcF52tEhZpAq@cluster0.foyzr.mongodb.net/beastmode?retryWrites=true&w=majority"



app.set('view engine', 'ejs');
app.set('views', 'views');

const store = new MongoDBStore({
  uri: MONGODB_URL,
  collection: 'sessions'
});
const csrfProtection = csrf();

app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});



//save to user
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});








// ROUTES====================================>
const genRoutes = require('./routes/general');
const clientRoutes = require('./routes/client');
const trainerRoutes = require('./routes/trainer');
//const authRoutes = require('./routes/auth');



// CONTROLLER===============================>
const errorController = require('./controllers/errors');





app.use(genRoutes);
app.use('/user', clientRoutes);
app.use('/trainer', trainerRoutes);
//app.use(authRoutes);




app.use(errorController.get404);



const corsOptions = {
    origin: "https://cse341l.herokuapp.com/",
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    family: 4
};




mongoose
  .connect(
    MONGODB_URL, options
  )
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          email: 'rio@test.com',
          password:'test123'
        });
        user.save();
      }
    });
    app.listen(process.env.PORT || 5000);
  
  })
  .catch(err => {
    console.log(err);
  });


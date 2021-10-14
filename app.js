const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const cors = require('cors') 


const app = express();


/**Addding bootstrap to File */
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))




app.set('view engine', 'ejs');
app.set('views', 'views');



app.use(express.static(path.join(__dirname, 'public')));


// ROUTES====================================>
//const adminRoutes = require('./routes/admin');
const beastRoutes = require('./routes/beast');
const clientRoutes = require('./routes/client');
//const authRoutes = require('./routes/auth');



// CONTROLLER===============================>
const errorController = require('./controllers/errors');





//app.use('/admin', adminRoutes);
app.use(beastRoutes);
app.use('/user', clientRoutes);
//app.use(authRoutes);




app.use(errorController.get404);


app.listen(process.env.PORT || 5000);
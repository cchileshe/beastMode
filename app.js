const path = require('path');
const express = require('express');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');



app.use(express.static(path.join(__dirname, 'public')));

//const adminRoutes = require('./routes/admin');
const beastRoutes = require('./routes/beast');
//const authRoutes = require('./routes/auth');

//app.use('/admin', adminRoutes);
app.use(beastRoutes);
//app.use(authRoutes);


app.listen(process.env.PORT || 5000);
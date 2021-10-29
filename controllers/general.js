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
  res.render('beast/findtrainer', {
    pageTitle: 'Find Trainers',
    path: '/findtrainer'
  });
};
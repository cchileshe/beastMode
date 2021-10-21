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
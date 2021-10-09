exports.getIndex = (req, res, next) => {
        res.render('beast/index', {
          pageTitle: 'Beast Mode',
          path: '/'
        });
  };
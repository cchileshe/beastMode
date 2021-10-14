exports.getIndex = (req, res, next) => {
    res.render('client/signupClient', {
      pageTitle: 'Signup Client',
      path: '/user/sign-up'
    });
};
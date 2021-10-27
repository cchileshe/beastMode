module.exports = (req, res, next) => {
    if (req.session.isLoggedIn && req.session.isUser ==="client") {
        return res.redirect('/user/account');
    }
    else if(req.session.isLoggedIn && req.session.istrainer==="tainer"){
        return res.redirect('/tainer/account');
    }
    else{
        return res.redirect('/');
    }

    next();
}

module.exports.dashboard = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/');
    }
    next();
}



module.exports.loginUser = (req, res, next) => {
    if (!req.session.isLoggedIn && !req.session.isUser ==="client") {
        return res.redirect('/user/account');
    }
    next();
}

module.exports.loginTrainer = (req, res, next) => {
    if (req.session.isLoggedIn && req.session.isUser ==="trainer") {
        return res.redirect('/trainer/account');
    }
    next();
}
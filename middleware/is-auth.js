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
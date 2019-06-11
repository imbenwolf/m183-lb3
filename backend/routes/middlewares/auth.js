const onlyLoggedIn = (req, res, next) => {
    if (req.session.loggedIn) {
        res.locals.path = req.path
        res.locals.user = req.session.user
        next()
    } else {
        res.redirect('/')
    }
};

const onlyLoggedOut = (req, res, next) => {
    req.session.loggedIn ? res.redirect('/') : next()
};

module.exports = {
    onlyLoggedIn,
    onlyLoggedOut
}
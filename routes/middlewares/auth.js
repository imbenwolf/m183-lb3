const onlyLoggedIn = (req, res, next) => {
    if (req.session.loggedIn) {
        res.locals.path = req.baseUrl
        res.locals.user = req.session.user
        next()
    } else {
        res.status(403).redirect('/')
    }
};

const onlyLoggedOut = (req, res, next) => {
    req.session.loggedIn ? res.status(403).redirect('/') : next()
};

module.exports = {
    onlyLoggedIn,
    onlyLoggedOut
}
const bcrypt = require('bcrypt')
const express = require('express')
const router = express.Router()

const authMiddleware = require("./middlewares/auth")
const userModel = require("../models/user")

const authenticate = async (name, password) => {
    if (name && password) {
        const user = await userModel.getUserByName(name)
        if (user) {
            const authenticated = await bcrypt.compare(password, user.password)
            return authenticated
        } else {
            throw 'user does not exist'
        }
    } else {
        throw 'name and password must be supplied'
    }
}

router.get('/', authMiddleware.onlyLoggedOut, ({res}) => {
    res.render('login')
})

router.post('/', authMiddleware.onlyLoggedOut, async(req, res) => {
    const name = req.body.name
    const password = req.body.password

    try {
        const authenticated = await authenticate(name, password)

        if (authenticated) {
            req.session.loggedIn = true
            req.session.user = name
            res.redirect('/')
        } else {
            throw 'authentication failed'
        }
    } catch (err) {
        const error = (typeof err === 'string') ? err : "error during authentication of user. please try again later"
        res.render('login', { error })
    }
})

module.exports = router
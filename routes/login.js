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
            throw 'Authentication failed'
        }
    } else {
        throw 'Name and password must be supplied'
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
            throw 'Authentication failed'
        }
    } catch (err) {
        const error = (typeof err === 'string') ? err : "Error during authentication of user. Please try again later"
        if (error === "Name and password must be supplied" || error === "Authentication failed") {
            res.status(400)
        } else {
            res.status(500)
        }
        res.render('login', { error })
    }
})

module.exports = router
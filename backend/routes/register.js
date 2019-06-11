const db = require("../db.js")
const bcrypt = require('bcrypt')
const express = require('express')
const router = express.Router()

const authMiddleware = require("./middlewares/auth")

const register = async (name, password) => {
    if (name && password) {
        const user = await db.getUser(name)
        if (user) throw `user "${name}" already exists`

        const hashedPassword = await bcrypt.hash(password, saltRounds)
        await db.createUser(name, hashedPassword)
    } else {
        throw 'name and password must be supplied'
    }
}

router.get('/', authMiddleware.onlyLoggedOut, ({res}) => {
    res.render('register')
})

router.post('/', authMiddleware.onlyLoggedOut, async(req, res) => {
    const name = req.body.name
    const password = req.body.password

    try {
        await register(name, password)

        req.session.loggedIn = true
        req.session.user = name

        res.redirect('/')
    } catch (err) {
        const error = (typeof err === 'string') ? err : "error during creation of user. please try again later"
        res.render('register', { error })
    }
})

module.exports = router
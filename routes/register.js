const bcrypt = require('bcrypt')
const express = require('express')
const router = express.Router()

const authMiddleware = require("./middlewares/auth")
const userModel = require("../models/user")

const register = async (name, password) => {
    if (name && password) {
        const user = await userModel.getUserByName(name)
        if (user) throw `user "${name}" already exists`

        const hashedPassword = await bcrypt.hash(password, 10)
        await userModel.createUser(name, hashedPassword)
    } else {
        throw 'Name and password must be supplied'
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

        res.staus(201).redirect('/')
    } catch (err) {
        const error = (typeof err === 'string') ? err : "Error during creation of user. please try again later"
        if (error === "Name and password must be supplied") {
            res.status(400)
        } else {
            res.status(500)
        }
        res.render('register', { error })
    }
})

module.exports = router
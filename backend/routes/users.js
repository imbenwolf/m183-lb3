const express = require('express')
const router = express.Router()

const authMiddleware = require("./middlewares/auth")
const userModel = require("../models/user")

router.get('/', authMiddleware.onlyLoggedIn, async ({res}) => {
    res.render('users', {users: await userModel.getAllUsers()})
})

module.exports = router
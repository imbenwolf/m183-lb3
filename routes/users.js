const express = require('express')
const router = express.Router()

const authMiddleware = require("./middlewares/auth")
const userModel = require("../models/user")

router.get('/', authMiddleware.onlyLoggedIn, async ({res}) => {
    try {
        const users = await userModel.getAllUsers()
        res.render('users', {users})
    } catch (err) {
        const error = "Error during fetching of users. Please try again later"
        res.status(500).render('users', {error})
    }
})

module.exports = router
const db = require("../db")
const express = require('express')
const router = express.Router()

const authMiddleware = require("./middlewares/auth")

router.get('/', authMiddleware.onlyLoggedIn, async ({res}) => {
    res.render('users', {users: await db.getUsers()})
})

module.exports = router
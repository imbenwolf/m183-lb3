const express = require('express')
const router = express.Router()

const authMiddleware = require("./middlewares/auth")

router.post('/', authMiddleware.onlyLoggedIn, (req, res) => {
    req.session.destroy()
    res.redirect('/')
})

module.exports = router
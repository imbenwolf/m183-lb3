const shell = require("shelljs")
const express = require('express')
const router = express.Router()

const authMiddleware = require("./middlewares/auth")

router.get('/', authMiddleware.onlyLoggedIn, (req, res) => {
    const command = req.query.command
    res.render('system', {command, output: shell.exec(command, { silent: true })})
})

module.exports = router
const shell = require("shelljs")
const express = require('express')
const router = express.Router()

const authMiddleware = require("./middlewares/auth")

router.get('/', authMiddleware.onlyLoggedIn, (req, res) => {
    const command = req.query.command
      try {
          const output = command ? shell.exec(command, { silent: true }) : ""
          res.render('system', {command, output})
      } catch (err) {
          const error = `Executing command returned: ${err}`
          res.status(500).render('system', {error})
      }
})

module.exports = router
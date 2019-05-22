const express = require("express")
const shell = require("shelljs")

const app = express()
const port = 3000

app.get('/system', (req, res) => {
    let command = req.query.command
    let response = (command ? shell.exec(command) : 'Please specify a command with the "command" GET parameter')
    res.send(response)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
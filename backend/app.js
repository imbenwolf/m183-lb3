const express = require("express")
const shell = require("shelljs")

const db = require("./db.js")

const app = express()
const port = 3000

app.get('/system', (req, res) => {
    const command = req.query.command
    let result = {}
    if (command) {
        console.log(`/system called with command "${command}"`)
        const output = shell.exec(command, { silent: true })
        result.output = output
    } else {
        console.error('/system called with no "command" parameter')
        result.error = 'Please specify a command with the "command" GET parameter'
    }
    res.send(result)
})

app.get('/users', async (req, res) => {
    let result = {}
    try {
        console.log('/users called')
        result = await db.getUsers()
    } catch (err) {
        console.error(`/users returned ${err}`)
        result.error = 'Error during fetching of users. Please try again later'
    }
    res.send(result)
})

const server = app.listen(port, async () => {
    try {
        await db.setup()
        console.log(`LB3 backend running on port: ${port}!`)
    } catch (err) {
        console.error(`setup returned ${err}`)
        server.close()
    }
})
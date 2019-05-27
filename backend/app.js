const express = require("express")
const shell = require("shelljs")

const db = require("./db.js")

const app = express()
const port = 3000

app.use(express.urlencoded({extended: true}))

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

app.post('/register', async(req, res) => {
    const name = req.body.name
    const password = req.body.password
    let result = {}
    if (name && password) {
        try {
            await db.createUser(name, password)
            result = true
        } catch (err) {
            if (err.includes("User", "already exists")) 
                result.error = (err.includes("User", "already exists") ? err : "Error during creation of user. Please try again later")
        }
    } else {
        console.error('/register called without "name" and "password" parameters')
        result.error = 'Please specify a name and a password with the "name" and "password" POST parameters'
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
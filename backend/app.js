const express = require("express")
const morgan = require("morgan")
const shell = require("shelljs")

const db = require("./db.js")

const app = express()
const port = 3000

app.use(morgan('combined'))
app.use(express.urlencoded({extended: true}))

app.get('/system', (req, res) => {
    const command = req.query.command
    let result = {}
    if (command) {
        result.output = shell.exec(command, { silent: true })
    } else {
        result.error = 'Please specify a command with the "command" GET parameter'
    }
    res.send(result)
})

app.get('/users', async (req, res) => {
    let result = {}
    try {
        result = await db.getUsers()
    } catch (err) {
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
            let userExists = err.includes("User", "already exists")
            result.error = (userExists) ? err : "Error during creation of user. Please try again later"
        }
    } else {
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
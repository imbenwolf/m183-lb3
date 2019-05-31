const express = require("express")
const morgan = require("morgan")
const shell = require("shelljs")

const db = require("./db.js")
const auth = require("./auth.js")

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

    try {
        await auth.register(name, password)
        result.success = true
    } catch (err) {
        result.error = (typeof err === 'string') ? err : "Error during creation of user. Please try again later"
    }

    res.send(result)
})

const server = app.listen(port, async () => {
    try {
        await db.setup()
        await auth.setup()

        console.log(`lb3 running on port: ${port}!`)
    } catch (err) {
        console.error(`setup returned ${err}`)
        server.close()
    }
})
const express = require("express")
const session = require('express-session')
const morgan = require("morgan")
const shell = require("shelljs")

const db = require("./db.js")
const auth = require("./auth.js")

const app = express()
const port = 3000

app.use(session({
    secret: 'm183 is the name - lb3 is the game',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: app.get('env') === 'production'
    }
}))

app.use(morgan('combined'))
app.use(express.urlencoded({extended: true}))

app.post('/register', async(req, res) => {
    const name = req.body.name
    const password = req.body.password
    let result = {}

    try {
        await auth.register(name, password)

        req.session.loggedIn = true
        req.session.user = name
        result.success = true
    } catch (err) {
        result.error = (typeof err === 'string') ? err : "error during creation of user. please try again later"
    }

    res.send(result)
})

app.post('/login', async(req, res) => {
    const name = req.body.name
    const password = req.body.password
    let result = {}

    try {
        const authenticated = await auth.authenticate(name, password)
        if (authenticated) {
            req.session.loggedIn = true
            req.session.user = name
        }
        result.authenticated = authenticated
    } catch (err) {
        result.error = (typeof err === 'string') ? err : "error during authentication of user. please try again later"
    }

    res.send(result)
})

app.post('/logout', (req, res) => {
    if (req.session.loggedIn) req.session.destroy()
    res.send({authenticated: false})
})

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

const server = app.listen(port, async () => {
    try {
        await db.setup()
        await auth.setup()

        console.log(`lb3 running on port ${port}`)
    } catch (err) {
        console.error(`setup returned ${err}`)
        server.close()
    }
})
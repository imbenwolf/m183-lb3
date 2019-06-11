const express = require("express")
const session = require("express-session")
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

app.set('view engine', 'pug')

const onlyLoggedIn = (req, res, next) => {
    if (req.session.loggedIn) {
        res.locals.path = req.path
        res.locals.user = req.session.user
        next()
    } else {
        res.redirect('/')
    }
};

const onlyLoggedOut = (req, res, next) => {
    req.session.loggedIn ? res.redirect('/') : next()
};

app.get('/', (req, res) => {
    res.redirect(req.session.loggedIn ? '/system' : '/login')
})

app.get('/login', onlyLoggedOut, ({res}) => {
    res.render('login')
})

app.get('/register', onlyLoggedOut, ({res}) => {
    res.render('register')
})

app.post('/register', onlyLoggedOut, async(req, res) => {
    const name = req.body.name
    const password = req.body.password

    try {
        await auth.register(name, password)

        req.session.loggedIn = true
        req.session.user = name

        res.redirect('/')
    } catch (err) {
        const error = (typeof err === 'string') ? err : "error during creation of user. please try again later"
        res.render('register', { error })
    }
})

app.post('/login', onlyLoggedOut, async(req, res) => {
    const name = req.body.name
    const password = req.body.password

    try {
        const authenticated = await auth.authenticate(name, password)

        if (authenticated) {
            req.session.loggedIn = true
            req.session.user = name
            res.redirect('/')
        } else {
            throw 'authentication failed'
        }
    } catch (err) {
        const error = (typeof err === 'string') ? err : "error during authentication of user. please try again later"
        res.render('login', { error })
    }
})

app.post('/logout', onlyLoggedIn, (req, res) => {
    req.session.destroy()
    res.redirect('/')
})

app.get('/users', onlyLoggedIn, async ({res}) => {
    res.render('users', {users: await db.getUsers()})
})

app.get('/system', onlyLoggedIn, (req, res) => {
    const command = req.query.command
    res.render('system', {command, output: shell.exec(command, { silent: true })})
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
const express = require("express")
const session = require("express-session")
const morgan = require("morgan")
const shell = require("shelljs")

const db = require("./db")

const authMiddleware = require("./routes/middlewares/auth")

const routes = {
    login: require('./routes/login'),
    register: require('./routes/register')
}

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
app.use('/ui', express.static(__dirname + '/node_modules/uikit/dist/'))
app.use('/public', express.static(__dirname + '/views/public/'))

app.use('/login', routes.login)
app.use('/register', routes.register)

app.get('/', (req, res) => {
    res.redirect(req.session.loggedIn ? '/system' : '/login')
})

app.post('/logout', authMiddleware.onlyLoggedIn, (req, res) => {
    req.session.destroy()
    res.redirect('/')
})

app.get('/users', authMiddleware.onlyLoggedIn, async ({res}) => {
    res.render('users', {users: await db.getUsers()})
})

app.get('/system', authMiddleware.onlyLoggedIn, (req, res) => {
    const command = req.query.command
    res.render('system', {command, output: shell.exec(command, { silent: true })})
})

const server = app.listen(port, async () => {
    try {
        await db.setup()
        console.log(`lb3 running on port ${port}`)
    } catch (err) {
        console.error(`setup returned ${err}`)
        server.close()
    }
})
const express = require("express")
const session = require("express-session")
const morgan = require("morgan")

const db = require("./db")
const userModel = require("./models/user")
const bcrypt = require('bcrypt')

const routes = {
    login: require('./routes/login'),
    register: require('./routes/register'),
    logout: require('./routes/logout'),
    users: require('./routes/users'),
    system: require('./routes/system')
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

app.get('/', (req, res) => {
    res.redirect(req.session.loggedIn ? '/system' : '/login')
})

app.use('/login', routes.login)
app.use('/register', routes.register)
app.use('/logout', routes.logout)
app.use('/users', routes.users)
app.use('/system', routes.system)

db.serialize(() =>
    db.run('CREATE TABLE user (name TEXT, password TEXT)', async () => { 
        await userModel.createUser('lb3', await bcrypt.hash('sml12345', 10))
        app.listen(port, console.log(`M183 LB3 started on http://localhost:${port}/`))
    })
)
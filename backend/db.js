const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database(':memory:')

const setup = () => new Promise((resolve, reject) =>
    db.serialize(async () => {
        db.run('CREATE TABLE user (name TEXT, password TEXT)', err => 
            err ? reject(err) : resolve()
        )
    })
)

const getUser = name => new Promise((resolve, reject) => 
    db.serialize(() => 
        db.get('SELECT name, password FROM user WHERE name = ?', name, (err, user) =>
            err ? reject(err) : resolve(user) 
        )
    )
)

const getUsers = () => new Promise((resolve, reject) => 
    db.serialize(() => 
        db.all('SELECT * FROM user', (err, users) => 
            err ? reject(err) : resolve(users)
        )
    )
)

const createUser = (name, password) => new Promise(async (resolve, reject) => {
    db.serialize(() =>
        db.run('INSERT INTO user VALUES (?, ?)', name, password, err => 
            err ? reject(err) : resolve()
        )
    )
})

module.exports = {
    setup,
    getUser,
    getUsers,
    createUser
}
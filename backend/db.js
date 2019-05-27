const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database(':memory:')

const setup = () => new Promise((resolve, reject) =>
    db.serialize(async () => {
        try {
            db.run('CREATE TABLE user (name TEXT, password TEXT)', err => 
                err ? reject(err) : err
            )
            db.run('INSERT INTO user VALUES (?, ?)', "123", "sml12345")
            db.run('INSERT INTO user VALUES (?, ?)', "lb3", "sml12345")
            resolve()
        } catch (err) {
            reject(err)
        }
    })
)

const getUsers = () => new Promise((resolve, reject) => 
    db.serialize(() => 
        db.all('SELECT * FROM user', (err, users) => 
            err ? reject(err) : resolve(users)
        )
    )
)

module.exports = {
    setup,
    getUsers
}
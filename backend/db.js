const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database(':memory:')

const setup = () => new Promise((resolve, reject) =>
    db.serialize(async () => {
        try {
            db.run('CREATE TABLE user (name TEXT, password TEXT)', err => 
                err ? reject(err) : err
            )
            await createUser("123", "sml12345")
            await createUser("lb3", "sml12345")
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

const createUser = (name, password) => new Promise(async (resolve, reject) => {
    try {
        const user = await getUser(name)
        if (user) throw `User "${name}" already exists`
        db.serialize(() =>
            db.run('INSERT INTO user VALUES (?, ?)', name, password, err => 
                err ? reject(err) : resolve()
            )
        )
    } catch (err) {
        reject(err)
    }
})

const getUser = name => new Promise((resolve, reject) => 
    db.serialize(() => 
        db.get('SELECT name, password FROM user WHERE name = ?', name, (err, user) =>
            err ? reject(err) : resolve(user) 
        )
    )
)

module.exports = {
    setup,
    getUsers,
    createUser
}
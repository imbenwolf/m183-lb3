const db = require("../db")

const getAllUsers = () => new Promise((resolve, reject) => 
    db.serialize(() => 
        db.all('SELECT * FROM user', (err, users) => 
            err ? reject(err) : resolve(users)
        )
    )
)

const getUserByName = name => new Promise((resolve, reject) => 
    db.serialize(() => 
        db.get('SELECT name, password FROM user WHERE name = ?', name, (err, user) =>
            err ? reject(err) : resolve(user) 
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
    getAllUsers,
    getUserByName,
    createUser
}
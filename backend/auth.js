const db = require("./db.js")
const bcrypt = require('bcrypt');
const saltRounds = 10;

const setup = async () => {
    await register("123", "sml12345")
    await register("lb3", "sml12345")
}

const register = async (name, password) => {
    if (name && password) {
        const user = await db.getUser(name)
        if (user) throw `user "${name}" already exists`

        const hashedPassword = await bcrypt.hash(password, saltRounds)
        await db.createUser(name, hashedPassword)
    } else {
        throw 'name and password must be supplied'
    }
}

const authenticate = async (name, password) => {
    if (name && password) {
        const user = await db.getUser(name)
        if (user) {
            const authenticated = await bcrypt.compare(password, user.password)
            return authenticated
        } else {
            throw 'user does not exist'
        }
    } else {
        throw 'name and password must be supplied'
    }
}

module.exports = {
    setup,
    register,
    authenticate
}
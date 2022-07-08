const { pool } = require("./db")

const selectUser = async (user, password) => {
    let text = 'SELECT email, username FROM users WHERE email=$1 AND (pwd::bytea)=sha256($2)'
    let values = [user, password]
    let { rows } = await pool.query(text, values)
    if (rows[0]) {
        let { username, email } = rows[0]
        return { username: username, email: email }
    }
    return null
}

const insertUser = async (email, user, password) => {
    let text = 'INSERT INTO users VALUES($1,$2,sha256($3))'
    let values = [email, user, password]
    pool.query(text, values, (err) => {
        if (err) {
            console.log(err)
        }
    })
}

module.exports = {
    selectUser,
    insertUser
}
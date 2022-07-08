const {Pool} = require('pg')

global.pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DB,
    password: process.env.PG_PASS,
})
global.pool.connect()

// module.exports = {
//     query: (text, values, callback) => {
//         pool.query(text, values, callback)
//     },
//     end: () => {
//         pool.end()
//     } 
// }
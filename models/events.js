const { pool } = require("./db")

const insertEvent = async (name, date, num, privacy, desc, file, email, where, lat, lon) => {
    let text = `
        INSERT INTO events(title,ddate,max_num_part,descr,priv,img,organizer,inv_code,location_name, loc_lat, loc_lon)
        VALUES ($1,$2,$3,$4,$5,$6,$7,substr(md5(random()::text), 0, 10),$8,$9,$10)`
    let values = [name, date, num, desc, privacy, file, email, where, lat, lon]
    pool.query(text, values, (err) => {
        console.log(err)
    })
}

const selectEvents = async (user) => {
    let text = 'SELECT * FROM events WHERE organizer=$1'
    let values = [user]
    let res = await pool.query(text, values)
    console.log
    return res.rows
}

module.exports = {
    insertEvent,
    selectEvents
}
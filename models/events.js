const { pool } = require("./db")

const trimTime = (res) => {
    res.rows.forEach(row => {
        let d = new Date(row.ddate)
        row.ddate = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`
    })
    return res
}

const insertEvent = async (name, date, num, privacy, desc, file, email, where, lat, lon) => {
    let text = `
        INSERT INTO events(title,ddate,max_num_part,descr,priv,img,organizer,inv_code,location_name, loc_lat, loc_lon)
        VALUES ($1,$2,$3,$4,$5,$6,$7,substr(md5(random()::text), 0, 10),$8,$9,$10)`
    let values = [name, date, num, desc, privacy, file, email, where, lat, lon]
    pool.query(text, values, (err) => {
        console.log(err)
    })
}

const selectMyEvents = async (user) => {
    let text = 'SELECT * FROM events WHERE organizer=$1'
    let values = [user]
    let res = await pool.query(text, values)
    res = trimTime(res)
    return res.rows
}

const selectMyPartecip = async (user) => {
    let text = `
        SELECT E.*
        FROM partecipations as P
        JOIN events as E ON E.id = P.p_event
        WHERE P.user_email = $1`
    let values = [user]
    let res = await pool.query(text, values)
    res = trimTime(res)
    return res.rows
}

const deleteMyEvent = async (id, email) => {
    let text = 'DELETE FROM events WHERE id=$1 AND organizer=$2'
    let values = [id, email]
    await pool.query(text,values)
}

const selectImage = async (img, email, inv_code) => {
    let text = `
        SELECT img 
        FROM events
        WHERE img=$1 AND (priv=FALSE OR organizer=$2 OR inv_code=$3)
        LIMIT 1`
    let values = [img, email, inv_code]
    let res = await pool.query(text, values, inv_code)
    if (res.rowCount >= 1) {
        return true
    }
    return false
}

module.exports = {
    insertEvent,
    selectMyEvents,
    selectMyPartecip,
    deleteMyEvent,
    selectImage
}
const { pool } = require("./db")

const insertEvent = async (name, date, num, privacy, desc, file, email, where) => {
    let text = `
        INSERT INTO events(title,ddate,max_num_part,descr,priv,img,organizer,inv_code,location_name)
        VALUES ($1,$2,$3,$4,$5,$6,$7,substr(md5(random()::text), 0, 10))`
    let values = [name, date, num, desc, privacy, file, email, where]
    pool.query(text, values, (err) => {
        console.log(err)
    })
}

module.exports = {
    insertEvent
}
const insertEvent = (name, date, num, privacy, desc, file, email) => {
    let text = `
        INSERT INTO events(title,ddate,max_num_part,descr,priv,img,organizer,inv_code)
        VALUES ($1,$2,$3,$4,$5,$6,$7,substr(md5(random()::text), 0, 10))`
    let values = [name,date,num,desc,privacy,file,email]
    global.pool.query(text, values, (err) => {
        console.log(err)
    })
}

module.exports = {
    insertEvent
}
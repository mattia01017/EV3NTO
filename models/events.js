/* modello di gestione dei dati degli eventi nel db */

const { pool } = require("./db");

// metodo privato per rimuovere l'orario dalla data
const trimTime = (res) => {
    res.rows.forEach(row => {
        let d = new Date(row.ddate);
        row.ddate = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
    })
    return res;
}

// inserisce nel db l'evento con i valori specificati
const insertEvent = async (name, date, num, privacy, desc, file, email, where, lat, lon) => {
    let text = `
        INSERT INTO events(title,ddate,max_num_part,descr,priv,img,organizer,inv_code,location_name, loc_lat, loc_lon)
        VALUES ($1,$2,$3,$4,$5,$6,$7,substr(md5(random()::text), 0, 10),$8,$9,$10)`;
    let values = [name, date, num, desc, privacy, file, email, where, lat, lon];
    pool.query(text, values, (err) => {
        console.log(err);
    });
}

// restituisce i dati degli eventi organizzati dall'utente specificato
const selectMyEvents = async (user) => {
    let text = `
        SELECT id, title, ddate, num_part, max_num_part, U.username AS organizer, img, location_name
        FROM events as E
        JOIN users AS U ON U.email = E.organizer
        WHERE organizer=$1`;
    let values = [user];
    let res = await pool.query(text, values);
    res = trimTime(res);
    return res.rows;
}

// restituisce i dati degli eventi a cui partecipa l'utente specificato
const selectMyPartecip = async (user) => {
    let text = `
        SELECT E.*
        FROM partecipations as P
        JOIN events as E ON E.id = P.p_event
        WHERE P.user_email = $1`;
    let values = [user];
    let res = await pool.query(text, values);
    res = trimTime(res);
    return res.rows;
}

// rimuove l'evento con l'id dato solo se l'email specificata è 
// dell'utente organizzatore. Restituisce il nome dell'immagine associata all'evento
const deleteMyEvent = async (id, email) => {
    let text = 'DELETE FROM events WHERE id=$1 AND organizer=$2 RETURNING img';
    let values = [id, email];
    let res = await pool.query(text,values);
    return res.rows[0].img;
}

// restituisce true se il nome dato dell'immagine è di un evento pubblico,
// appartenente all'utente dell'email specificata o se il codice di invito è corretto
const selectImage = async (img, email, inv_code) => {
    let text = `
        SELECT img 
        FROM events
        WHERE img=$1 AND (priv=FALSE OR organizer=$2 OR inv_code=$3)
        LIMIT 1`;
    let values = [img, email, inv_code];
    let res = await pool.query(text, values, inv_code);
    if (res.rowCount == 1) {
        return true;
    }
    return false;
}

const selectEvent = async (id) => {
    let text = `
        SELECT title, ddate, num_part, max_num_part, 
            descr, priv, U.username, organizer, inv_code, img, location_name
        FROM events as E
        JOIN users as U ON U.email = E.organizer
        WHERE E.id = $1`;
    let values = [id];
    let res = await pool.query(text, values);
    return res.rows[0];
}

const isOwner = async (eventId, user) => {
    
}

module.exports = {
    insertEvent,
    selectMyEvents,
    selectMyPartecip,
    deleteMyEvent,
    selectImage,
    selectEvent
};
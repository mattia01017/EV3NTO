/* modello di gestione dei dati degli eventi nel db */

const { pool } = require("./db");
const geolib = require('geolib');

// metodo privato per rimuovere l'orario dalla data
const trimTime = (res) => {
    res.rows.forEach(row => {
        let d = new Date(row.ddate);
        row.ddate = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    })
    return res;
}

// inserisce nel db l'evento con i valori specificati
const insertEvent = async (name, date, num, privacy, desc, file, email, where, lat, lon) => {
    let text = `
        INSERT INTO events(title,ddate,max_num_part,descr,priv,img,organizer,id,location_name, loc_lat, loc_lon)
        VALUES ($1,$2,$3,$4,$5,$6,$7,substr(md5(random()::text), 0, 11),$8,$9,$10)`;
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
        SELECT id, title, ddate, num_part, max_num_part, U.username AS organizer, img, location_name
        FROM partecipations as P
        JOIN events as E ON E.id = P.p_event
        Join users as U ON U.email = E.organizer
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
    let res = await pool.query(text, values);
    return res.rows[0] ? res.rows[0].img : null;
}

// restituisce true se il nome dato dell'immagine è di un evento pubblico,
// appartenente all'utente dell'email specificata o se il codice di invito è corretto
const selectImage = async (img) => {
    let text = `
        SELECT img 
        FROM events
        WHERE img=$1
        LIMIT 1`;
    let values = [img];
    let res = await pool.query(text, values);
    if (res.rowCount == 1) {
        return true;
    }
    return false;
}

const selectEvent = async (id) => {
    let text = `
        SELECT title, ddate, num_part, max_num_part, 
            descr, priv, U.username, id, img, location_name
        FROM events as E
        JOIN users as U ON U.email = E.organizer
        WHERE E.id = $1`;
    let values = [id];
    let res = await pool.query(text, values);
    return trimTime(res).rows[0];
}

const isOwner = async (eventId, user) => {
    let text = `
        SELECT id
        FROM events
        WHERE id=$1 AND organizer=$2`;
    let values = [eventId, user];
    let res = await pool.query(text, values);
    return res.rows.length == 1;
}

const isPartecipant = async (eventId, user) => {
    let text = `
        SELECT p_event
        FROM partecipations
        WHERE p_event=$1 AND user_email=$2`;
    let values = [eventId, user];
    let res = await pool.query(text, values);
    return res.rows.length == 1;
}

const insertPartecipant = async (eventId, user) => {
    let text = `
        INSERT INTO partecipations
        VALUES ($2,$1)`;
    let values = [eventId, user];
    try {
        await pool.query(text, values);
    } catch (err) {
        if (err.constraint === 'num_part_constraint' ) {
            return true
        }
    }
    return false;
}

const deletePartecipant = async (eventId, user) => {
    let text = `
        DELETE FROM partecipations
        WHERE p_event=$1 AND user_email=$2`;
    let values = [eventId, user];
    await pool.query(text, values)
}

const selectEventsByName = async (q) => {
    let text = `
        SELECT id, title, ddate, num_part, max_num_part, 
            descr, priv, U.username as organizer, img, location_name
        FROM events as E
        JOIN users as U ON U.email = E.organizer
        WHERE priv=false 
            AND (LOWER(title) LIKE '%' || LOWER($1) || '%' 
                OR LOWER(location_name) LIKE '%' || LOWER($1) || '%')`;
    let values = [q];
    let res = await pool.query(text, values);
    return trimTime(res).rows;
}

const selectNearbyEvents = async (lat, lon, dist) => {
    let text = 'SELECT id, loc_lat, loc_lon FROM events';
    let allEvents = (await pool.query(text)).rows;

    let point = {latitude: lat, longitude: lon};
    let nearby = ['null']
    allEvents.forEach((event) => {
        let b = geolib.isPointWithinRadius(
            {latitude: event.loc_lat, longitude: event.loc_lon},
            point,
            dist
        );
        if (b) {
            nearby.push(event.id);
        }
    });

    text = `
        SELECT id, title, ddate, num_part, max_num_part, 
        descr, priv, U.username as organizer, img, location_name
        FROM events as E
        JOIN users as U ON U.email = E.organizer
        WHERE id = ANY ($1) AND priv = false`;
    let res = await pool.query(text, [nearby]);
    return trimTime(res).rows;
}

const selectPartecipants = async (eventId) => {
    let text = `
        SELECT U.username, U.email
        FROM users as U
        JOIN partecipations as P ON U.email = P.user_email
        WHERE P.p_event=$1
        ORDER BY U.username ASC, U.email ASC`;
    let values = [eventId];
    let res = await pool.query(text, values);
    return res.rows;
}

const selectNumPart = async (eventId) => {
    let text = 'SELECT num_part FROM events WHERE id = $1';
    let values = [eventId];
    let res = await pool.query(text, values);
    return res.rows[0].num_part;
}

module.exports = {
    insertEvent,
    selectMyEvents,
    selectMyPartecip,
    deleteMyEvent,
    selectImage,
    selectEvent,
    isOwner,
    isPartecipant,
    insertPartecipant,
    deletePartecipant,
    selectEventsByName,
    selectNearbyEvents,
    selectPartecipants,
    selectNumPart
};
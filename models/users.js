/* modello di gestione dei dati utente nel db */

const pool = require("./db");
const fs = require('fs');

// restituisce l'utente specificato se la password è corretta, null altrimenti
const selectUser = async (user, password) => {
    let text = 'SELECT email, username FROM users WHERE email=$1 AND (pwd::bytea)=sha256($2)';
    let values = [user, password];
    let { rows } = await pool.query(text, values);
    if (rows[0]) {
        let { username, email } = rows[0];
        return { username: username, email: email };
    }
    return null;
}

// inserisce un utente nel db
const insertUser = async (email, user, password) => {
    let text = 'INSERT INTO users VALUES($1,$2,sha256($3))';
    let values = [email, user, password];
    try {
        await pool.query(text, values);
    } catch (err) {
        return err;
    }
}

// elimina l'utente con l'email specificata dal db. Gli eventi e le partecipazioni
// dell'utente verranno a loro volta cancellate
const deleteUser = async (email) => {
    // elimina le immagini degli eventi associati all'utente
    let text = 'SELECT img FROM events WHERE organizer=$1 AND img IS NOT NULL';
    let values = [email];
    let res = await pool.query(text,values);
    res.rows.forEach(({img}) => {
        fs.unlink('uploads/' + img, err => {
            if (err) {
                console.log(err);
            }
        });
    })
    // elimina l'utente
    text = 'DELETE FROM users WHERE email=$1';
    values = [email];
    pool.query(text, values);
}

module.exports = {
    selectUser,
    insertUser,
    deleteUser
};
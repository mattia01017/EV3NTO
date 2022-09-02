/* Controller delle funzionalità di ricerca */

// invia la pagina di ricerca testuale
const searchByName = async (req,res) => {
    res.render('search.ejs', {q: req.query.q});
}

// invia la pagina di eventi nelle vicinanze
const searchNearby = async (req,res) => {
    res.render('search.ejs', {q: undefined});
}

module.exports = {
    searchByName,
    searchNearby
}
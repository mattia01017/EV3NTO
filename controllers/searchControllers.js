/* Controller delle funzionalità di ricerca */

const searchByName = async (req,res) => {
    res.render('search.ejs', {q: req.query.q});
}

const searchNearby = async (req,res) => {
    res.render('search.ejs', {q: undefined});
}

module.exports = {
    searchByName,
    searchNearby
}
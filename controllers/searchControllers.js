/* Controller delle funzionalità di ricerca */

const searchByName = (req,res) => {
    res.render('search.ejs', {q: req.query.q});
}


module.exports = {
    searchByName
}
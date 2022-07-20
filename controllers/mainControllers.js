/* Controllers principali */

// carica pagina home
const loadHome = (req, res) => {
    if (req.query.logout) {
        delete req.session.user;
        delete req.session.email;
    }
    res.render('index.ejs');
}

// carica pagina di ricerca
const search = (req, res) => {
    res.render('search.ejs');
}

module.exports = {
    loadHome,
    search
};
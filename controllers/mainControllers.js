/* Controllers principali */
const { deleteUser } = require('../models/users');

// carica pagina home
const loadHome = (req, res) => {
    // logout
    if (req.query.logout) {
        delete req.session.user;
        delete req.session.email;
        res.locals.user = undefined;
    }
    // cancella account
    if (req.query.deleteUser) {
        deleteUser(req.session.email);
        delete req.session.user;
        delete req.session.email;
        res.locals.user = undefined;
    }
    res.render('index.ejs');
}

module.exports = {
    loadHome
};
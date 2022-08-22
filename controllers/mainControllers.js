/* Controllers principali */
const { deleteUser } = require('../models/users');

// carica pagina home
const loadHome = async (req, res) => {
    
    res.render('index.ejs');
}

// controlla se tra i parametri GET viene richiesto il logout o
// la cancellazione dell'utente
const deleteOrLogout = async (req,res,next) => {
    // logout
    if (req.query.logout) {
        delete req.session.user;
        delete req.session.email;
        res.locals.user = undefined;
        res.redirect('/');
    }
    // cancella account
    else if (req.query.deleteUser) {
        deleteUser(req.session.email);
        delete req.session.user;
        delete req.session.email;
        res.locals.user = undefined;
        res.redirect('/');
    } else {
        next();
    }
}

const loadNotFound = async (req, res) => {
    res.status(404).render('404.ejs');
}

module.exports = {
    loadHome,
    deleteOrLogout,
    loadNotFound
};
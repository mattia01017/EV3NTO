const loadHome = (req, res) => {
    if (req.query.logout) {
        delete req.session.user
    }
    res.render('index.ejs', {user:req.session.user})
}

const search = (req,res) => {
    res.render('search.ejs', {user:req.session.user})
}

module.exports = {
    loadHome,
    search
}
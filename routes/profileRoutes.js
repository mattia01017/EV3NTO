const express = require('express')
const router = express.Router()
const multer = require('multer')
const accountControllers = require('../controllers/accountControllers')

const upload = multer({dest : 'uploads/'})

router.use(accountControllers.checkIfLogged)

router.get('/profilo', (req,res) => {
    res.redirect('profilo/miei')
})

router.get('/profilo/miei', accountControllers.setNameHeader)

router.get('/profilo/partecipazioni', (req,res) => {
    res.render('mypage.ejs')
})

router.get('/profilo/aggiungi', (req,res) => {
    res.render('addevent.ejs')
})

router.post('/profilo/aggiungi', upload.single('image'), (req,res) => {
    console.log(req.body)
    res.redirect('/profilo/miei')
})

module.exports = router;
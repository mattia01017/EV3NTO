const { Router } = require("express")
const authControllers = require('../controllers/authControllers')

const router = Router()

router.use(authControllers.skipIfLogged)

router.get('/login',
    authControllers.loadLogin
)

router.post('/login',
    authControllers.authenticate
)

router.get('/signin',
    authControllers.loadSignin
)
router.post('/signin',
    authControllers.addUser
)

module.exports = router
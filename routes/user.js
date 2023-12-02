const { Router } = require('express');
const router = Router();

const { registerUser, loginUser } = require('../controller/user');
const { auth } = require('../middlewares/auth')
    // const { isLogin, isLogout } = require('../middlewares/auth')


router.post('/', registerUser);
router.post('/login', loginUser);
// router.use(auth)

module.exports = router
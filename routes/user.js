const { Router } = require('express');
const router = Router();
const { registerUser, loginUser } = require('../controller/user')


router.post('/', registerUser);
router.post('/login', loginUser)

module.exports = router
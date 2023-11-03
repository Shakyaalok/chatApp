const { Router } = require('express');
const router = Router();
const { registerUser } = require('../controller/user')


router.post('/', registerUser);

module.exports = router
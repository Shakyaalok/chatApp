const { Router } = require('express');
const router = Router();
const { message } = require('../controller/chatMessage');
const { auth } = require('../middlewares/auth')

router.use(auth)
router.post('/', message)

module.exports = router
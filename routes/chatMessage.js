const { Router } = require('express');
const router = Router();
const { message, allMessage } = require('../controller/chatMessage');
const { auth } = require('../middlewares/auth');
const { allUsers } = require('../controller/chatMessage');

router.use(auth)
router.get('/all', allMessage)
router.get('/allusers', allUsers)
router.post('/', message)



module.exports = router
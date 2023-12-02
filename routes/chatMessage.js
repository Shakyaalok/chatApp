const { Router } = require('express');
const router = Router();
const { message, allMessage } = require('../controller/chatMessage');
const { auth } = require('../middlewares/auth');
const { allUsers, getUsersMessage } = require('../controller/chatMessage');

router.use(auth)
router.get('/usermsg/:reciverId', getUsersMessage)
router.get('/all', allMessage)
router.get('/allusers', allUsers)
router.post('/', message)



module.exports = router
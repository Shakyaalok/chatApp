const { Router } = require('express');
const router = Router();
const { auth } = require('../middlewares/auth')
const { create } = require('../controller/group')


router.use(auth);
router.post('/create', create)


module.exports = router
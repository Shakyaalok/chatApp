const { Router } = require('express');
const router = Router();
const { auth } = require('../middlewares/auth')
const { create, groupDetails, moreGroupDetails } = require('../controller/group')


router.use(auth);
router.get('/', groupDetails)
router.get('/more/:groupId', moreGroupDetails)
router.post('/create', create);



module.exports = router
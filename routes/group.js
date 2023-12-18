const { Router } = require('express');
const router = Router();
const { auth } = require('../middlewares/auth')
const { create, groupDetails, moreGroupDetails, makeGroupUserAdmin, loginUserisAdmin } = require('../controller/group')


router.use(auth);
router.get('/', groupDetails)
router.get('/more/:groupId', moreGroupDetails)
router.post('/create', create);
router.get('/:groupId/:userId', loginUserisAdmin)
router.get('/edit/:groupId/:usrIds', makeGroupUserAdmin); // bahiya se pucunga ki put karo toh unauthoried btata hai and get par work karta hai



module.exports = router
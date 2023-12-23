const { Router } = require('express');
const router = Router();
const { auth } = require('../middlewares/auth')
const { create, groupDetails, moreGroupDetails, makeGroupUserAdmin, loginUserisAdmin, deleteUserFromGroup, getGroupsMessage, searchForNewMembers, makeChanges } = require('../controller/group')


router.use(auth);
router.get('/', groupDetails)
router.get('/more/:groupId', moreGroupDetails)
router.get('/:groupId/:userId', loginUserisAdmin)
router.get('/edit/:groupId/:usrIds', makeGroupUserAdmin); // bahiya se pucunga ki put karo toh unauthoried btata hai and get par work karta hai
router.get('/:groupId', getGroupsMessage);
router.post('/create', create);
router.get('/already/:key/:alreadyUser', searchForNewMembers); // later i will set it to post
router.post('/added/:groupId/:groupName', makeChanges)
router.delete('/:groupId/:userId', deleteUserFromGroup)



module.exports = router
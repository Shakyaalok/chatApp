const Group = require('../models/group');
const groupParticipant = require('../models/groupParticipant');
const chatMessage = require('../models/chatMessage');
const { Op } = require('sequelize');
const User = require('../models/user')



const create = async(req, res) => {
    const { name, groupPicture, groupMember } = req.body;
    const userId = req.user.id
    try {
        if (!name || !groupPicture || !groupMember) {
            return res.status(200).json({ message: 'Fill all the details' })
        }

        // by normal without using sequelize-associations
        // const group = await Group.create({
        //     name,
        //     groupPicture,
        //     groupMember
        // })


        // // Get user IDs for group members
        // const membersAdded = await Promise.all(groupMember.map(async(part) => {
        //     const firstName = part.split(' ')[0]
        //     const user = await User.findOne({ where: { firstName: firstName } });
        //     return user.dataValues.id
        // }))



        // // Create entries in GroupParticipant for each member
        // await Promise.all(membersAdded.map(async(id) => {
        //     await groupParticipant.create({
        //         userId: id,
        //         groupId: group.id,
        //         groupName: group.name,
        //     })
        // }))


        //*********8ends here */

        const group = await Group.create({
            name,
            groupPicture,
            groupMember
        })


        // who is creating the group must be the logged user then its name should be visible but that user must be the part of that group?
        // include the logged in user 
        const fullName = req.user.firstName + " " + req.user.lastName
        console.log(fullName)
        if (!groupMember.includes(fullName)) {
            groupMember.push(fullName)
        }

        const users = await User.findAll({
            where: {
                firstName: groupMember.map((part) => part.split(' ')[0])
            }
        })



        // // Associate users with the group through GroupParticipant
        await group.addUser(users, {
            through: {
                groupName: group.name,
                isAdmin: false,
            },
        });

        // now make the loogedin user as admin
        if (req.user.id) {
            await groupParticipant.update({ isAdmin: true }, {
                where: {
                    userId: req.user.id,
                    groupId: group.id
                }
            })
        }
        return res.status(201).json({ message: 'Group created Successfull!', group })
    } catch (error) {
        res.status(200).json({ message: 'Something went wrong', error });
    }
}

const groupDetails = async(req, res) => {


    try {
        const details = await groupParticipant.findAll({ where: { userId: req.user.id } })
            // console.log(details.groupId[0])

        if (!details || details.length == 0) {
            return;
        }

        // console.log('details.length----------------------', details.length)
        res.status(201).json({ details })
    } catch (error) {
        res.status(200).json({ message: 'something went wrong', error: error })
    }
}

const moreGroupDetails = async(req, res) => {
    const { groupId } = req.params
    let count;
    try {
        const GroupDetails = await groupParticipant.findAll({ where: { groupId: groupId } }) // how many users are linked to this group
        const Members = GroupDetails.map(members => members.userId); // finding all the ids of the user linked to the group
        const memberDetails = await Promise.all(Members.map(userId => User.findOne({ where: { id: userId } }))) // finding the userDetails by userId getting from the members
        count = memberDetails.length;


        // separate out some data from user
        const membersInfo = memberDetails.map(member => ({
            fullName: member.firstName + " " + member.lastName,
            mobile: member.mobile,
            groupName: member.groupName,
            isOnline: member.isOnline
        }))

        // from the group participate
        const GroupInfo = GroupDetails.map(group => ({
            GroupName: group.groupName,
            isAdmin: group.isAdmin,
            userId: group.userId,
            groupId: group.groupId

        }))

        res.status(201).json({ membersInfo, GroupInfo, count })
    } catch (error) {
        console.log(error)
        res.status(200).json({ message: 'something went wrong', error: error })
    }
}

const makeGroupUserAdmin = async(req, res) => {
    let { groupId, usrIds } = req.params;
    let userIds = JSON.parse(usrIds)

    if (userIds.length == 0) {
        return res.status(200).json({ message: 'you have not selected any user for making the admin' })
    }

    await Promise.all(userIds.map(async(id) => {
        return await groupParticipant.update({ isAdmin: true }, { where: { groupId: groupId, userId: id } })
    }))
    res.status(201).json({ message: 'successfully Updated' })
}



const loginUserisAdmin = async(req, res) => {
    const { userId, groupId } = req.params;
    const isAdminOrnot = await groupParticipant.findOne({ where: { userId: userId, groupId: groupId } });
    res.status(201).json({ isAdminOrnot })

}

const deleteUserFromGroup = async(req, res) => {
    const { userId, groupId } = req.params;
    await groupParticipant.destroy({ where: { userId: userId, groupId: groupId } });
    res.status(201).json({ message: 'successfully Deleted' })
}

// but sending the message api is present in chatMessage
const getGroupsMessage = async(req, res) => {
    const { groupId } = req.params;
    try {

        // to include the user we have to use Op from sequelize

        console.log('usermsg', groupId)
            // if(!recieverId){
            //     return res.status(500).json({message: 're '})
            // }
            // let chatMessages = await chatMessage.findAll({
            // where: {
            //     [Op.or]: [{ sender_id: groupId }, { group_id: groupId }]
            // }
            //     where: {
            //         group_id: groupId
            //     }
            // });

        let chatMessages = await chatMessage.findAll({ where: { group_id: groupId } });
        res.status(201).send({
            status: true,
            message: 'Successfully fetched messages',
            data: chatMessages
        })
    } catch (error) {
        console.log("error", error)
        return res.status(500).json(error)
    }
}


const searchForNewMembers = async(req, res) => {
    const { key, alreadyUser } = req.params;
    const alreadyUsers = JSON.parse(alreadyUser);
    // it will find out the user which is not in the array and also check with its name it match then return
    const membersNotInGroup = await User.findAll({
        where: {
            [Op.and]: [{
                [Op.or]: [{
                        firstName: {
                            [Op.like]: `%${key}%`,
                        },
                    },

                    {
                        lastName: {
                            [Op.like]: `%${key}%`,
                        },
                    },

                    {
                        mobile: {
                            [Op.like]: `%${Number(key)}%`,
                        },
                    }


                ]

            }, {
                id: {
                    [Op.notIn]: alreadyUsers
                },
            }, ]
        },


    })
    if (membersNotInGroup.length == 0) {
        return res.status(200).json({ message: 'No user found with this match' })
    }
    res.status(201).json(membersNotInGroup)
}


const makeChanges = async(req, res) => {
    const { groupId, groupName } = req.params;
    console.log(groupName)
    const { data } = req.body;
    let addedMember;
    for (let itm of data) {
        let isAdmin = itm.isAdmin;
        let userId = itm.userId
        addedMember = await groupParticipant.create({ groupId, groupName, isAdmin, userId })
    }
    try {
        res.json(addedMember)
    } catch (error) {
        console.log(error)
    }
}

module.exports = { create, groupDetails, moreGroupDetails, makeGroupUserAdmin, loginUserisAdmin, deleteUserFromGroup, getGroupsMessage, searchForNewMembers, makeChanges }
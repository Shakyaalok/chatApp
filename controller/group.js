const Group = require('../models/group');
const groupParticipant = require('../models/groupParticipant');
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

    try {
        const GroupInfo = await groupParticipant.findAll({ where: { groupId: groupId } }) // how many users are linked to this group
        const Members = GroupInfo.map(members => members.userId); // finding all the ids of the user linked to the group
        const memberName = await Promise.all(Members.map(userId => User.findOne({ where: { id: userId } }))) // finding the userDetails by userId getting from the members
        res.status(201).json({ GroupInfo, memberName })
    } catch (error) {
        console.log(error)
        res.status(200).json({ message: 'something went wrong', error: error })
    }
}

module.exports = { create, groupDetails, moreGroupDetails }
const chatMessage = require('../models/chatMessage');
const sequelize = require('../utils/db');
const { Op } = require('sequelize');
const User = require('../models/user')

const message = async(req, res) => {
    const t = await sequelize.transaction();
    try {
        const userId = req.user.id;
        // console.log('userId', userId);
        const { message, reciever_id, sender_id, group_id } = req.body

        if (!message) {
            await t.rollback();
            return res.status(200).json({ message: "message is required" });
        }

        let newMsg;
        if (group_id) {
            // group chat
            newMsg = await chatMessage.create({ message, sender_id, userId, group_id })
        } else {
            // one to one chat
            newMsg = await chatMessage.create({ message, sender_id, reciever_id, userId })
        }

        await t.commit();
        res.status(201).json(newMsg)
    } catch (error) {
        await t.rollback();
        return res.status(200).json({ success: false, error })
    }

}

const allMessage = async(req, res) => {
    //userId 
    const userId = req.user.id;

    let message = await chatMessage.findAll({ where: { userId } })
    console.log('message-------------------->', message)
    res.status(201).json(message)

}


const allUsers = async(req, res) => {
    try {
        // to include the user we have to use Op from sequelize
        const userId = req.user.id
        let users = await User.findAll({
            where: {
                id: {
                    [Op.ne]: userId
                }

            }
        });

        // Extracting details from users array
        const details = users.map(user => {
            return { id: user.id, name: user.firstName + " " + user.lastName, isOnline: user.isOnline }
        });


        res.status(201).json({ details })
    } catch (error) {
        return res.status(200).json(error)
    }
}

const getUsersMessage = async(req, res) => {
    const { reciverId } = req.params;
    try {

        // to include the user we have to use Op from sequelize

        console.log('usermsg', reciverId)
            // if(!recieverId){
            //     return res.status(500).json({message: 're '})
            // }
        let chatMessages = await chatMessage.findAll({
            where: {
                [Op.or]: [{ sender_id: reciverId }, { reciever_id: reciverId }]
            }
        });
        res.status(200).send({
            status: true,
            message: 'Successfully fetched messages',
            data: chatMessages
        })
    } catch (error) {
        console.log("error", error)
        return res.status(500).json(error)
    }
}

const searchUser = async function(req, res) {
    try {
        const userId = req.user.id
        const { key } = req.params;
        const user = await User.findAll({
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
                        [Op.ne]: userId,
                    },
                }, ]
            },
        })


        if (user.length == 0) {
            return res.status(200).json({ message: 'select from the suggestion list' })

        }

        // let data = {
        //     names: user.map(user => user.firstName + ' ' + user.lastName, user.id),
        // };

        res.status(201).json(user)
    } catch (error) {
        res.status(200).json({ message: 'No user found!' })
    }

}



module.exports = { message, allMessage, allUsers, getUsersMessage, searchUser }
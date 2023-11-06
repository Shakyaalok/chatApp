const chatMessage = require('../models/chatMessage');
const sequelize = require('../utils/db');
const { Op } = require('sequelize');
const User = require('../models/user')

const message = async(req, res) => {
    const t = await sequelize.transaction();
    try {
        const userId = req.user.id;
        console.log('userId', userId)
        let { message } = req.body

        if (!message) {
            await t.rollback();
            return res.status(200).json({ message: "message is required" });
        }

        message = await chatMessage.create({ message, userId })
        await t.commit();
        res.status(201).json(message)
    } catch (error) {
        await t.rollback();
        return res.status(200).json({ success: false, error })
    }

}

const allMessage = async(req, res) => {
    const userId = req.user.id;
    let { message } = req.body

    message = await chatMessage.findAll({ where: { userId } })
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




module.exports = { message, allMessage, allUsers }
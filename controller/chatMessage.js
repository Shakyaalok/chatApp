const { json } = require('sequelize');
const chatMessage = require('../models/chatMessage')

const message = async(req, res) => {
    const userId = req.user.id;
    let { message } = req.body

    if (!message) {
        return res.status(200).json({ message: "message is required" });
    }

    message = await chatMessage.create({ message, userId })
    res.status(201).json({ message: message })

}


module.exports = { message }
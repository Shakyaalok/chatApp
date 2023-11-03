const Sequelize = require('sequelize');
const sequelize = require('../utils/db');
const chatMessage = sequelize.define('chatmessage', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    message: {
        type: Sequelize.STRING
    }
})


module.exports = chatMessage
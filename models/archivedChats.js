const Sequelize = require('sequelize');
const sequelize = require('../utils/db');
const archivedChats = sequelize.define('archivedchats', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    sender_id: { // use snake case for the attributes in sequelize
        type: Sequelize.INTEGER,

    },
    reciever_id: {
        type: Sequelize.INTEGER,
        allowNull: true,

    },
    message: {
        type: Sequelize.TEXT // text is used for longer message
    },
    group_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
    }
}, { timestamps: true })


module.exports = archivedChats
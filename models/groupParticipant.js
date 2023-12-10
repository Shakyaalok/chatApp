const Sequelize = require('sequelize')
const sequelize = require('../utils/db')
const groupParticipant = sequelize.define('groupparticipants', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    isAdmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
    },
    groupName: {
        type: Sequelize.STRING,
        allowNull: false,
    }


})


module.exports = groupParticipant
const Sequelize = require('sequelize')
const sequelize = require('../utils/db')
const Group = sequelize.define('group', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    groupPicture: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    groupMember: {
        type: Sequelize.JSON,
        allowNull: false,
    }

}, { timestamps: true })


module.exports = Group
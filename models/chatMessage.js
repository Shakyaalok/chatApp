const Sequelize = require('sequelize');
const sequelize = require('../utils/db');
const chatMessage = sequelize.define('chatmessage', {
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

    },
    message: {
        type: Sequelize.TEXT // text is used for longer message

    }
}, { timestamps: true })


module.exports = chatMessage



// initially it was like that
// id: {
//     type: Sequelize.INTEGER,
//     primaryKey: true,
//     allowNull: false,
//     autoIncrement: true
// },
// message: {
//     type: Sequelize.STRING
// }
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_SCHEMA_NAME, process.env.DATABASE_USER_NAME, process.env.DATABASE_PASSWORD, {
    host: process.env.HOST,
    dialect: 'mysql'
})



module.exports = sequelize
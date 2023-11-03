const User = require('../models/user')
const sequelize = require('../utils/db')
const bcrypt = require('bcrypt')

const registerUser = async(req, res) => {
    const t = await sequelize.transaction();
    try {
        const { firstName, lastName, email, mobile, password } = req.body;

        if (!firstName || !lastName || !email || !mobile || !password) {
            await t.rollback();
            return res.status(200).json({ message: "All fields are required!" });
        }
        if (mobile.length > 10) {
            await t.rollback()
            return res.status(200).json({ message: "Required a valid number" })
        }


        // checking with email
        let user = await User.findOne({ where: { email } });
        if (user) {
            await t.rollback()
            return res.status(200).json({ message: 'User is Already exists' })
        }


        // checking with mobile
        user = await User.findOne({ where: { mobile } })
        if (user) {
            await t.rollback()
            return res.status(200).json({ message: 'User is Already exists' })
        }


        //hashing the password before goes into the database
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, async function(err, hash) {
            user = await User.create({ firstName, lastName, email, mobile, password: hash }, { transaction: t })
            await t.commit();
            res.status(201).json({ user: user })
        })


    } catch (error) {
        await t.rollback();
        return res.status(200).json({ message: 'something went wrong', err })
    }


}



module.exports = { registerUser }
const User = require('../models/user')
const sequelize = require('../utils/db')

const registerUser = async(req, res) => {
    const t = await sequelize.transaction();
    try {
        const { firstName, lastName, email, mobile, password } = req.body;

        if (!firstName || !lastName || !email || !mobile || !password) {
            await t.rollback();
            return res.status(500).json({ message: "All fields are required!" });
        }
        if (mobile.length > 10) {
            await t.rollback()
            return res.status(500).json({ message: "Required a valid number" })
        }


        // checking with email
        let user = await User.findOne({ where: { email } });
        if (user) {
            await t.rollback()
            return res.status(500).json({ message: 'User is Already exists' })
        }


        // checking with mobile
        user = await User.findOne({ where: { mobile } })
        if (user) {
            await t.rollback()
            return res.status(500).json({ message: 'User is Already exists' })
        }


        user = await User.create({ firstName, lastName, email, mobile, password }, { transaction: t })
        await t.commit();
        res.status(201).json({ user: user })
    } catch (error) {
        await t.rollback();
        return res.status(500).json({ message: 'something went wrong', err })
    }


}



module.exports = { registerUser }
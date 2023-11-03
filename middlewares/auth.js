const jwt = require('jsonwebtoken');
const userModels = require('../models/user')


const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        console.log("Token==>", token)
        if (!token) {
            return res.status(401).json({ message: 'JWT token is missing' });
        }
        const user = jwt.verify(token, process.env.TOKEN_SECRET);

        // console.log('userId-->', user.userId) // we are getting this is userId not id because we are passing the userId as id during login
        userModels.findByPk(user.userId).then(user => { // finding in usermodel
            req.user = user; // we do this to make our user globally aviable in req
            next();
        })

    } catch (error) {
        return res.status(200).json({ message: 'something went wrong from middle-ware', error })
    }

}



module.exports = { auth };
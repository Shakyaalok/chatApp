const express = require('express');
const path = require('path')
const app = express();
const dotenv = require('dotenv');
dotenv.config();





const sequelize = require('./utils/db')



// routes
const userRoutes = require('./routes/user')



// models
const user = require('./models/user')




// middlewares
app.use(express.static(path.join(__dirname, 'public/Html')))
app.use(express.json())
app.use('/user', userRoutes)





sequelize
    .sync()
    .then((result) => {
        app.listen(process.env.PORT, () => {
            console.log(`listening at the port of ${process.env.PORT}`)
        })
    })
    .catch((err) => {
        console.log('something went wrong in synchronization of data', err)
    })
const express = require('express');
const path = require('path')
const cors = require('cors')
const app = express();
const dotenv = require('dotenv');
dotenv.config();





const sequelize = require('./utils/db')



// routes
const userRoutes = require('./routes/user')
const chatMessageRoutes = require('./routes/chatMessage')



// models
const user = require('./models/user');
const chatmessage = require('./models/chatMessage')




// middlewares
app.use(cors({
    origin: 'http://127.0.0.1:5500'
}))


app.use(express.static(path.join(__dirname, 'public/Html')))
app.use(express.json())
app.use('/user', userRoutes)
app.use('/chat', chatMessageRoutes)


// associations
user.hasMany(chatmessage);
chatmessage.belongsTo(user);


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
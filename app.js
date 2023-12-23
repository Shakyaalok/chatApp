const express = require('express');
const path = require('path')
const http = require('http'); // requiremet for the socet io-1
const cors = require('cors')
const app = express();
const server = http.createServer(app); // requiremet for the socet io-2
const io = require('socket.io')(server); // requiremet for the socet io-3
const dotenv = require('dotenv');
dotenv.config();





const sequelize = require('./utils/db')



// routes
const userRoutes = require('./routes/user')
const chatMessageRoutes = require('./routes/chatMessage');
const groupRoutes = require('./routes/group')



// models
const user = require('./models/user');
const chatmessage = require('./models/chatMessage');
const group = require('./models/group');
const groupPart = require('./models/groupParticipant')





// middlewares
app.use(cors({
    origin: 'http://127.0.0.1:5500'
}))



app.use(express.static(path.join(__dirname, 'public/Html')))
app.use(express.json())

app.use('/user', userRoutes)
app.use('/chat', chatMessageRoutes)
app.use('/group', groupRoutes);



// socket io
var usp = io.of('/user-namespace') // creating the namespace --> it will work only when thses 3 steps are being setup

usp.on('connection', async function(socket) {
    console.log('-------------------------->user connected');
    // console.log(socket)
    const userId = socket.handshake.auth.token;
    const finUser = await user.findByPk(userId);
    await finUser.update({ isOnline: true })
        // broadcast to show the instant effect if the user is login 
    socket.broadcast.emit('getOnlineUser', { id: userId })


    socket.on('disconnect', async function() {
        const userId = socket.handshake.auth.token;
        const finUser = await user.findByPk(userId);
        await finUser.update({ isOnline: false })
            // broadcast to show the instant effect if the user is logout 
        socket.broadcast.emit('getOfflineUser', { id: userId })

        console.log('========================->user diconnected')
    })


    //chatting implementation
    socket.on('newChat', function(data) {
        console.log('msg sending', data)
        socket.broadcast.emit('loadnewChat', data)
        console.log('loadnewChat sended', data)
    })

})


// associations
user.hasMany(chatmessage);
chatmessage.belongsTo(user);
// for groups
user.belongsToMany(group, { through: groupPart });
group.belongsToMany(user, { through: groupPart })


sequelize
    .sync()
    .then((result) => {
        server.listen(process.env.PORT, () => {
            console.log(`listening at the port of ${process.env.PORT}`)
        })
    })
    .catch((err) => {
        console.log('something went wrong in synchronization of data', err)
    })
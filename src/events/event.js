const connectedUsers = require('./ConnectedUsers');

const EventEmitter = require('events').EventEmitter
const eventEmitter = new EventEmitter()

eventEmitter.on('test', function (obj) {
    console.log(obj.email)
    // console.log(connectedUsers)

    // connections.forEach(function(socket) {
    //     socket.emit('server message', jsonobj);
    // });
});


eventEmitter.on('user:update', function (user) {
    const uid = user.uid

    const socket = connectedUsers[uid]

    socket.emit('user', user)
});

module.exports = eventEmitter
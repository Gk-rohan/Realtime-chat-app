// node server which will handle socket io connections
const io = require('socket.io')(8000);

const users = {};

io.on('connection', socket =>{
    //if new user joined, let other users connected to the server know!
    socket.on('new-user-joined', name =>{
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name)
    });

    // if someone sends the message, broadcast it to other people 
    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });
    // if someone leave the chat , let other know and also "disconnect" is bulit in
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
})
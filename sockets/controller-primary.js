const {Socket} = require('socket.io');
const {checkJwt} = require('../helpers/jwt-check');
const {ChatMensajes} = require('../models/chat-mensajes');

const messagesChat = new ChatMensajes();

const socketController = async (socket = new Socket(), io) => {

    console.log('cliente conectado ' + socket.id);

    const user = await checkJwt(socket.handshake.headers['x-token']);

    if(!user){
        return socket.disconnect();
    };

    console.log(user);
    // Connect User
    messagesChat.userConnect(user);
    console.log(messagesChat.usersArr);

    io.emit('active-users', messagesChat.usersArr);
    socket.emit('receive-messages', messagesChat.last10)
    
    // Conectar a una sala
    socket.join(user.id); //3 salas, global, socket.id, user.id

    socket.on('disconnect', () => {
        messagesChat.userDisconnect(user.id);
        io.emit('active-users', messagesChat.usersArr);
    });

    socket.on('send-message', ({uid, message}) => {
        // Mensaje Privado
        if(uid){
            socket.to(uid).emit('private-message', {de: user.name, message})
        }else{
            messagesChat.sendMessage(user.id, user.name, message);
            io.emit('receive-messages', messagesChat.last10);
        };

    });

    console.log(`${user.name} se conecto con exito`);

};

module.exports = {socketController};
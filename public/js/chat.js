const txtUid     = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsers    = document.querySelector('#ulUsers');
const ulMensajes = document.querySelector('#ulMensajes');
const btnLogout  = document.querySelector('#btnLogout');

const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8081/log/renovate'
    : '--';

let user = null;
let socket = null;

// validar token del localstorage
const validateJWT = async () => {
    const token = localStorage.getItem('token') || '';
    if(token.length <= 10){
        window.location = 'index.html';
        throw new Error('No hay token en el servidor')
    };

    const resp = await fetch(url, {headers: {'x-token': token}});
    const {user: userDB, token: tokenDB} = await resp.json();
    localStorage.setItem('token', tokenDB);
    user = userDB;

    document.title = `Chat || ${user.name}`;

    await socketConnect();
};

const socketConnect = async () => {
    socket = io({
        'extraHeaders':{
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Sockets ON');
    });

    socket.on('disconnect', () => {
        // console.log('Sockets OFF');
    });

    socket.on('receive-messages', (payload) => {
        // TODO: recibir mensajes
        drawMessages(payload);
    });

    socket.on('active-users', (payload) => {
        // TODO: recibir lista de usuarios activos
        drawUsers(payload);
    });

    socket.on('private-message', (payload) => {
        // TODO: recibir mensaje privado
        console.log('private: ', payload)
    });

};

const drawUsers = (users = []) => {
    let usersHtml = '';
    users.forEach(({name, uid}) => {
        usersHtml += `
            <li>
                <p>
                    <h5 class="text-success"> ${name} </h5>
                    <span class="fs-6 text-muted">${uid}</span>
                </p>
            </li>
        `
    });

    ulUsers.innerHTML = usersHtml;
};

const drawMessages = (messages = []) => {
    let messagesHtml = '';
    messages.forEach(({name, message}) => {
        messagesHtml += `
            <li>
                <p>
                    <span class="text-primary">${name}: </span>
                    <span>${message}</span>
                </p>
            </li>
        `
    });

    ulMensajes.innerHTML = messagesHtml;
};

txtMensaje.addEventListener('keyup', ({keyCode}) => {
    
    const message = txtMensaje.value;
    const uid     = txtUid.value;
    
    if(keyCode !== 13){return;};
    if(message.length<=0){return;};

    socket.emit('send-message', {uid, message});
    
    txtMensaje.value = '';

});

const main = async() => {
    await validateJWT();
};

main();

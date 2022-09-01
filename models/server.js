const express = require('express');
var cors = require('cors');
const { socketController } = require('../sockets/controller-primary');
const { dbConnection } = require('../db/config');
const { createServer } = require('http');

class Server {
    
    constructor(){

        this.app    = express();
        this.port   = process.env.PORT;
        this.server = createServer(this.app);
        this.io = require('socket.io')(this.server);

        this.paths = {
            user: '/user',
            auth: '/log'
        };

        // DB Conection
        this.conectarDB();

        // Middlewares
        this.middlewares();
        
        // Rutas de aplicacion
        this.routes();

        // Sockets
        this.sockets();
    }

    middlewares(){
        // CORS
        this.app.use(cors());
        
        // Directorio publico
        this.app.use(express.static('public'));
        
        // PARSEO Y LECTURA
        this.app.use(express.json());
    }

    async conectarDB() {
        await dbConnection();
    }

    routes(){
        this.app.use(this.paths.user, require('../routes/user.routes'));
        this.app.use(this.paths.auth, require('../routes/auth.routes'));
    }

    sockets(){
        this.io.on("connection", (socket) => socketController(socket, this.io));
    }

    listen(){
        this.server.listen(this.port, () => {
            console.log(`Servidor corriendo en el puerto ${this.port}`);
        });
    }

}

module.exports = Server;
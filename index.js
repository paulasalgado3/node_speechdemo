var fs = require('fs');
var https = require('https');
var WebSocketServer = require('ws').Server;
var express = require("express");
var bodyParser = require("body-parser");

var serverConfig = {
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.crt'),
};

var app = express();
var HTTPS_PORT = 8443;

var httpsServer = https.createServer(serverConfig, app).listen(HTTPS_PORT);

var wss = new WebSocketServer({server: httpsServer});
var wss_externo ;
wss.on('connection', function(wss) {
	wss_externo=wss;
	wss.send('conectado');
    wss.on('message', function(message) {
		enviarMensaje(message);
    });
	
});

function enviarMensaje(mensaje){
 wss.clients.forEach(function each(client){
			console.log(mensaje);
                        client.send(mensaje);
                });
};
//wss.broadcast = function(data) {
//    for(var i in this.clients) {
//        this.clients[i].send(data);
//    }
//};

app.get(/^(.+)$/, function(req, res){ 
    switch(req.params[0]) {
        case '/prueba.html':
            res.send("prueba ok");
            break;
	case '/derecha':
		wss_externo.send('derecha');
		res.end();
		break;
	case '/izquierda':
		wss_externo.send('izquierda');
		res.end();
		console.log('izquierda');
		break;
	case '/pausa':
		wss_externo.send('pausa');
		res.end();
		break;	
	case '/escalarmas':
		wss_externo.send('escalarmas');
		res.end();
		break;
	case '/escalarmenos':
                wss_externo.send('escalarmenos');
		res.end();
                break;
	case '/escalarnormal':
		wss_externo.send('escalarnormal');
		res.end();
		break;
	case '/cambiar':
		wss_externo.send('cambiar');
		res.end();
		break;
	case '/entrar':
		wss_externo.send('entrar');
		res.end();
		break;
    	default: res.sendFile( __dirname + req.params[0]); 
    }
 });


console.log('Servidor corriendo');

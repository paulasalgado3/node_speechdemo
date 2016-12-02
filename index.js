var fs = require('fs');
var https = require('https');
var WebSocketServer = require('ws').Server;
var express = require("express");
var bodyParser = require("body-parser");
var HOSTIP = process.env.HOSTIP;

var serverConfig = {
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.crt'),
};

var app = express();
var HTTPS_PORT = 8080;

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
	case '/imagen':
		var body ="<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Strict//EN'        'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'>      <html xmlns='http://www.w3.org/1999/xhtml' lang='en' xml:lang='en'><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /><link rel='shortcut icon' href='favicon.ico' /><link rel='stylesheet' type='text/css' href='css/jquery.panorama.css' media='screen' /><link rel='stylesheet' type='text/css' href='css/jquery.fancybox-1.3.1.css' media='screen' /><script type='text/javascript' src='https://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js'></script><script type='text/javascript' src='jquery.panorama.js'></script><script>var margenIzquierdo = '';var connection = new WebSocket('wss://"+HOSTIP+"/' );connection.onmessage = function (e) {        	console.log('Server: ' + e.data);	switch(e.data){		case 'derecha':			panorama_animate(document.getElementsByClassName('panorama-container')[0],'left');			break;		case 'derecho':			panorama_animate(document.getElementsByClassName('panorama-container')[0],'left');			break;		case 'izquierda':			panorama_animate(document.getElementsByClassName('panorama-container')[0],'right');			console.log('izquierda');			break;		case 'izquierdo':			panorama_animate(document.getElementsByClassName('panorama-container')[0],'right');			console.log('izquierda');			break;		case 'pausa':			panorama_stop(document.getElementsByClassName('panorama-container')[0]);			break;		case 'escalarmas':			var escala = parseInt((document.getElementById('page').style.transform).match(/\d+/g).map(Number))+1; 			document.getElementById('page').style.transform='scale('+ escala +')';			break;		case 'escalarmenos':			var escala = parseInt((document.getElementById('page').style.transform).match(/\d+/g).map(Number))-1;                        document.getElementById('page').style.transform='scale('+ escala +')';                        break;		case 'escalarnormal':			document.getElementById('page').style.transform='scale(1)';                        break;		case 'cambiar':			var imagenes = document.getElementsByClassName('advancedpanorama');			imagenes[0].src='./img/imagen2.jpg';			imagenes[1].src='./img/imagen2.jpg';		case 'entrar':			console.log(margenIzquierdo);			if(margenIzquierdo >= 700 && margenIzquierdo <= 1100 ){				var imagenes = document.getElementsByClassName('advancedpanorama');                        	imagenes[0].src='./img/imagen2.jpg';                        	imagenes[1].src='./img/imagen2.jpg';				document.getElementsByClassName('panorama-area')[0].style.display='none';				document.getElementsByClassName('panorama-area')[1].style.display='none';			};			break;		default:		}			};</script><script type='text/javascript'>	$(document).ready(function(){		$('img.advancedpanorama').panorama({	                auto_start: 0,			start_position: 1527	         });	});panorama = document.getElementsByClassName('panorama-viewport')[0];//var elemWidth = 2448;var rel = screen.height / 375;var elemWidth = 2448 * rel;var settings = {				viewport_width: screen.width,				speed: 100000,				direction: 'left',				control_display: 'no',				start_position: 0,				auto_start: true,				mode_360: true			};		function panorama_animate(element,direccion) {			$(this).parent().css('margin-left', '-'+settings.start_position+'px');			currentPosition = 0-parseInt($(element).css('margin-left'));			$(element).stop();			if (direccion == 'right') {								$(element).animate({marginLeft: 0},  ((settings.speed / elemWidth) * (currentPosition)) , 'linear'/*, function (){ 				//$(element).animate({marginLeft: 0}, 20 , 'linear', function (){					if (settings.mode_360) {						console.log((settings.speed / elemWidth) * (currentPosition));							$(element).css('marginLeft', '-'+(parseInt(parseInt(elemWidth))+'px'));						//panorama_animate(element, direccion);					}				}*/);			} else { 								var rightlimit;				if (settings.mode_360) 					rightlimit = elemWidth;				else					rightlimit = elemWidth-settings.viewport_width;									$(element).animate({marginLeft: -rightlimit}, ((settings.speed / rightlimit) * (rightlimit - currentPosition)), 'linear'/*, function (){ 					if (settings.mode_360) {						$(element).css('margin-left', 0); 						panorama_animate(element, direccion);					}				}*/);			}					};		function panorama_stop(element){			$(element).stop();			margenIzquierdo = 0-parseInt($(element).css('margin-left')); 		};</script><script type='text/javascript' src='js/cvi_text_lib.js'></script><script type='text/javascript' src='../jquery.advanced-panorama.js'></script><script type='text/javascript' src='js/jquery.flipv.js'></script><script type='text/javascript' src='js/jquery.fancybox-1.3.1.pack.js'></script><script type='text/javascript'>	$(document).ready(function(){	  $('.thickbox').fancybox();	});</script><style  type='text/css'>body {		background: #595959;		text-align: center;		margin: 0px;	}	h1 {		color: white;		margin-bottom: 2em;		font-family: Verdana;		font-weight: normal;		font-size: 25px;	}	#page {		text-align: center;		color: white;	}	#page a {		color: white;	}	#page .panorama-viewport {		/*border: 20px solid id #414141;*/		margin-left: auto;		margin-right: auto;	}	#page p {		margin-bottom: 1em;	}</style></head><body ><div id='page' style='transform:scale(1)'>	<img src='img/sculpteur.jpg' class='advancedpanorama' width=elemWidth height='100%' usemap='testmap' alt='Atelier du sculpteur' />	<map id='testmap' name='testmap'> 		<area id='puerta' shape='rect' coords='1630,220,1880,1055'  alt='Pasillo frio' /> 			</map></div><script>var page = document.getElementById('page');page.style.width=screen.width+'px';page.style.height=screen.height+'px';var rel = screen.height / 375;var elemWidth = 2448 * rel;</script></body></html>";
		res.send(body);
		res.end();
		break;
	case '/voice':
		res.send(body);
		res.end();
    	default: res.sendFile( __dirname + req.params[0]); 
    }
 });


console.log('Servidor corriendo');

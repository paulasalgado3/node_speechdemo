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
		var body="<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Strict//EN'        'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'>      <html xmlns='http://www.w3.org/1999/xhtml' lang='en' xml:lang='en'><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /><link rel='shortcut icon' href='favicon.ico' /><link rel='stylesheet' type='text/css' href='css/jquery.panorama.css' media='screen' /><link rel='stylesheet' type='text/css' href='css/jquery.fancybox-1.3.1.css' media='screen' /><script type='text/javascript' src='https://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js'></script><script type='text/javascript' src='jquery.panorama.js'></script><script>var margenIzquierdo = '';var connection = new WebSocket('wss://"+HOSTIP+"/' );connection.onmessage = function (e) {               console.log('Server: ' + e.data);       switch(e.data){         case 'derecha':                 panorama_animate(document.getElementsByClassName('panorama-container')[0],'left');                      break;          case 'derecho':                 panorama_animate(document.getElementsByClassName('panorama-container')[0],'left');                      break;          case 'izquierda':                       panorama_animate(document.getElementsByClassName('panorama-container')[0],'right');                     console.log('izquierda');                       break;          case 'izquierdo':                       panorama_animate(document.getElementsByClassName('panorama-container')[0],'right');                     console.log('izquierda');                       break;          case 'pausa':                   panorama_stop(document.getElementsByClassName('panorama-container')[0]);                        break;          case 'escalarmas':                      var escala = parseInt((document.getElementById('page').style.transform).match(/\d+/g).map(Number))+1;                   document.getElementById('page').style.transform='scale('+ escala +')';                  break;          case 'escalarmenos':                    var escala = parseInt((document.getElementById('page').style.transform).match(/\d+/g).map(Number))-1;                        document.getElementById('page').style.transform='scale('+ escala +')';                        break;               case 'escalarnormal':                   document.getElementById('page').style.transform='scale(1)';                        break;               case 'cambiar':                 var imagenes = document.getElementsByClassName('advancedpanorama');                     imagenes[0].src='./img/imagen2.jpg';                    imagenes[1].src='./img/imagen2.jpg';            case 'entrar':                  console.log(margenIzquierdo);                   if(margenIzquierdo >= 700 && margenIzquierdo <= 1100 ){                         var imagenes = document.getElementsByClassName('advancedpanorama');                             imagenes[0].src='./img/imagen2.jpg';                            imagenes[1].src='./img/imagen2.jpg';                            document.getElementsByClassName('panorama-area')[0].style.display='none';                               document.getElementsByClassName('panorama-area')[1].style.display='none';                       };                      break;          default:                }                       };</script><script type='text/javascript'>      $(document).ready(function(){           $('img.advancedpanorama').panorama({                    auto_start: 0,                  start_position: 1527             });    });panorama = document.getElementsByClassName('panorama-viewport')[0];/*var elemWidth = 2448;*/var rel = screen.height / 375;var elemWidth = 2448 * rel;var settings = {                          viewport_width: screen.width,                           speed: 100000,                          direction: 'left',                              control_display: 'no',                          start_position: 0,                              auto_start: true,                               mode_360: true                  };              function panorama_animate(element,direccion) {                  $(this).parent().css('margin-left', '-'+settings.start_position+'px');                  currentPosition = 0-parseInt($(element).css('margin-left'));                    $(element).stop();                      if (direccion == 'right') {                                                             $(element).animate({marginLeft: 0},  ((settings.speed / elemWidth) * (currentPosition)) , 'linear'/*, function (){                              //$(element).animate({marginLeft: 0}, 20 , 'linear', function (){                                       if (settings.mode_360) {                                                console.log((settings.speed / elemWidth) * (currentPosition));                                                  $(element).css('marginLeft', '-'+(parseInt(parseInt(elemWidth))+'px'));                                         //panorama_animate(element, direccion);                                 }                               }*/);                   } else {                                                                var rightlimit;                         if (settings.mode_360)                                  rightlimit = elemWidth;                         else                                    rightlimit = elemWidth-settings.viewport_width;                                                                 $(element).animate({marginLeft: -rightlimit}, ((settings.speed / rightlimit) * (rightlimit - currentPosition)), 'linear'/*, function (){                                        if (settings.mode_360) {                                                $(element).css('margin-left', 0);                                               panorama_animate(element, direccion);                                   }                               }*/);                   }                                       };              function panorama_stop(element){                        $(element).stop();                      margenIzquierdo = 0-parseInt($(element).css('margin-left'));            };</script><script type='text/javascript' src='js/cvi_text_lib.js'></script><script type='text/javascript' src='../jquery.advanced-panorama.js'></script><script type='text/javascript' src='js/jquery.flipv.js'></script><script type='text/javascript' src='js/jquery.fancybox-1.3.1.pack.js'></script><script type='text/javascript'>        $(document).ready(function(){     $('.thickbox').fancybox();    });</script><style  type='text/css'>body {              background: #595959;            text-align: center;             margin: 0px;    }       h1 {            color: white;           margin-bottom: 2em;             font-family: Verdana;           font-weight: normal;            font-size: 25px;        }       #page {         text-align: center;             color: white;   }       #page a {               color: white;   }       #page .panorama-viewport {              /*border: 20px solid id #414141;*/              margin-left: auto;              margin-right: auto;     }       #page p {               margin-bottom: 1em;     }</style></head><body ><div id='page' style='transform:scale(1)'>       <img src='img/sculpteur.jpg' class='advancedpanorama' width=elemWidth height='100%' usemap='testmap' alt='Atelier du sculpteur' />      <map id='testmap' name='testmap'>               <area id='puerta' shape='rect' coords='1630,220,1880,1055'  alt='Pasillo frio' />                       </map></div><script>var page = document.getElementById('page');page.style.width=screen.width+'px';page.style.height=screen.height+'px';var rel = screen.height / 375;var elemWidth = 2448 * rel;</script></body></html>";
		res.send(body);
		res.end();
		break;
	case '/voice':
		var body="<!DOCTYPE html><html lang="en"> <head><script></script> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"/> <meta name="author" content="Aurelio De Rosa"> <title>Web Speech API Demo by Aurelio De Rosa</title> <link rel="stylesheet" href="shared.css"/> <style>.recognition-options{list-style: none; padding: 0;}.recognition-options li{display: inline;}fieldset{border: 0; /*margin: 0.5em 0;*/ padding: 0;}legend{padding: 0;}#mic{background-image:url("./img/mic.jpg");background-size: 100% 100%;position:absolute;margin: auto auto;}#invisible{display:none;}</style> </head> <body><div id='mic'></div><div id=invisible> <a href="http://www.sitepoint.com/introducing-web-speech-api/">Go back to the article</a> <h1>Web Speech API</h1> <p hidden class="js-api-support">API not supported</p><div class="js-api-info"> <h2>Transcription</h2> <textarea aria-label="Transcription" id="transcription" class="log" readonly></textarea> <form action=' method="get"> <label for="language">Language:</label> <input type="text" id="language" name="language" value="es-AR"/> <fieldset> <legend>Results:</legend> <ul class="recognition-options"> <li> <label> <input type="radio" name="recognition-type" value="final" checked/> Final only </label> </li><li> <label> <input type="radio" name="recognition-type" value="interim"/> Interim </label> </li></ul> </fieldset> <button type="button" id="button-play" class="button">Play demo</button> <button type="button" id="button-stop" class="button">Stop demo</button> </form> <h2>Log</h2> <div id="log" class="log"></div><button id="clear-all" class="button">Clear log</button> </div></div><script>var connection=new WebSocket('wss://10.105.231.63:8443/' , ['soap','xmpp']);connection.onmessage=function (e){console.log('Server: ' + e.data);}; function logEvent(string){var log=document.getElementById('log'); log.innerHTML=string + '<br/>' + log.innerHTML;}window.SpeechRecognition=window.SpeechRecognition || window.webkitSpeechRecognition || null; if (!SpeechRecognition){document.querySelector('.js-api-support').removeAttribute('hidden'); document.querySelector('.js-api-info').setAttribute('hidden', ''); [].forEach.call(document.querySelectorAll('form button'), function(button){button.setAttribute('disabled', '');});}else{var recognizer=new SpeechRecognition(); var transcription=document.getElementById('transcription'); /* Start recognising*/ recognizer.addEventListener('result', function(event){transcription.textContent=''; for (var i=event.resultIndex; i < event.results.length; i++){if (event.results[i].isFinal){transcription.textContent=event.results[i][0].transcript + ' (Confidence: ' + event.results[i][0].confidence + ')';console.log(event.results[i][0].transcript);connection.send(event.results[i][0].transcript);}else{transcription.textContent +=event.results[i][0].transcript;console.log(event.results[i][0].transcript);connection.send(event.results[i][0].transcript);}}}); /* Listen for errors*/ recognizer.addEventListener('error', function(event){logEvent('Recognition error: ' + event.message);}); recognizer.addEventListener('end', function(){logEvent('Recognition ended');}); document.getElementById('button-play').addEventListener('click', function(){transcription.textContent=''; /* Set if we need interim results*/ var isInterimResults=document.querySelector('input[name="recognition-type"][value="interim"]').checked; recognizer.lang=document.getElementById('language').value; recognizer.continuous=!isInterimResults; recognizer.interimResults=isInterimResults; try{recognizer.start(); logEvent('Recognition started');}catch(ex){logEvent('Recognition error: ' + ex.message);}}); document.getElementById('button-stop').addEventListener('click', function(){recognizer.stop(); logEvent('Recognition stopped');}); document.getElementById('clear-all').addEventListener('click', function(){document.getElementById('log').textContent='';});}document.body.style.width=screen.widht;document.body.style.height=screen.height;console.log(document.body.style.width);var ancho=696;var alto=932;var screenwidth=screen.width;var screenheight=screen.height;var rel=screenwidth/screenheight;var mic=document.getElementById('mic');if(rel>1.4){/*16:9*/mic.style.width='32%';mic.style.height='100%';}else{/*4:3*/mic.style.width='95%';mic.style.height='95%';}/*reconocimiento continuo*/ transcription.textContent=''; /* Set if we need interim results*/ var isInterimResults=false; recognizer.lang='es-AR'; recognizer.continuous=!isInterimResults; recognizer.interimResults=isInterimResults; try{recognizer.start(); logEvent('Recognition started');}catch(ex){logEvent('Recognition error: ' + ex.message);}recognizer.addEventListener('end', function(){logEvent('Recognition ended'); try{recognizer.start(); logEvent('Recognition started');}catch(ex){logEvent('Recognition error: ' + ex.message);}}); </script> </body></html>";
		res.send(body);
		res.end();
		break;
    	default: res.sendFile( __dirname + req.params[0]); 
    }
 });


console.log('Servidor corriendo');

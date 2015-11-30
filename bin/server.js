#!/usr/bin/env node

var debug = require('debug')('kevin:mon'); // debugging
//var chalk = require('chalk');            // colors
var program = require('commander');        // CLI access
//var os = require('os');                    // OS access
var http = require('http');                // http-server

var sysinfo = require('../lib/sysinfo.js');   // get system info
var makePage = require('../lib/page.js');     // create web page
var realtime = require('../lib/realtime.js'); // update web page via socket.io
var qr = require('../lib/qr.js');             // draw QR image w/ network info

// grab info from npm package
var pck = require('../package.json');

program
	.version(pck.version)
	.description(pck.description)
	.usage(pck.name + ' [options]')
	.option('-p, --port <port>','Http server port number, default: 8080',parseInt,8080)
	.option('-r, --no-static','Do real-time webpage updates')
// 	.option('-u, --update','update time for real-time, default: 1000 msec', parseInt, 1000)
	.parse(process.argv);
	
// debug('argv: '+process.argv);
// debug('!rt: '+ program.static);
// debug('rt: ' + (program.realtime ? true : false) );
// debug('test: '+ program.test);
debug('archeyjs ready on port: '+ program.port);

// not sure real-time info is worth it on small RPi
var rt = false;
if(!program.static){
	rt = true;
}

// Simple REST server
var server = http.createServer(function(req, res){
    var path = req.url; 
    debug( 'path: ' + path );
    
	var info = sysinfo.sysinfo();
	var qrimage = qr(info);
	
	// return json
	if ( path == '/json'){
		if (req.method == 'GET') {
			res.writeHead(200,{'Content-Type': 'text/json'});
			res.write(JSON.stringify( info ));
			res.end();
		}
	}
	// return status web page
	else if ( path == '/' ){
		if (req.method == 'GET') {
			res.writeHead(200,{'Content-Type': 'text/html'});
			res.write(makePage(info,rt));
			res.end();
		}
	}
	// return QR image
	else if ( path === '/qr' ){
        res.writeHead(200, {'Content-Type': 'image/png'});
        qrimage.pipe(res);
    }
    // return error
	else {
		// force users to / or /json
		debug("Wrong path " + path)
		res.writeHead(404, "Not Found", {'Content-Type': 'text/html'});
		res.write("Wrong path: use http://localhost:"+program.port+" or http:localhost:"+program.port+"/json\n");
		res.end(); 
	}
});

if (rt) {
	realtime(server,1000);
}

// start web server
server.listen(program.port);





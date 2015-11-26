#!/usr/bin/env node

var debug = require('debug')('kevin:mon')
//var chalk = require('chalk');
var program = require('commander');
var os = require('os');
var http = require('http');                     // http-server

var sysinfo = require('../lib/sysinfo.js');
var makePage = require('../lib/page.js');
var realtime = require('../lib/realtime.js');

// var spawn = require('child_process').exec;
// var ls = spawn('ls -alh');

var pck = require('../package.json');

debug('argv: '+process.argv);

program
	.version(pck.version)
	.description(pck.description)
	.usage(pck.name + ' [options]')
	.option('-p, --port <port>','Http server port number, default: 8080',parseInt,8080)
	.option('-r, --no-static','Do real-time webpage updates')
// 	.option('-t, --test','test')
	.parse(process.argv);

debug('!rt: '+ program.static);
// debug('rt: ' + (program.realtime ? true : false) );
// debug('test: '+ program.test);
debug('port: '+ program.port);

// program.port = 8080;

// not sure real-time info is worth it on small RPi
var rt = false;
if(!program.static){
	rt = true;
}

// var disk = require('diskusage');
//  
// // get disk usage. Takes mount point as first parameter 
// disk.check('/', function(err, info) {
//     console.log(info.available);
//     console.log(info.free);
//     console.log(info.total);
// });

// Simple REST server
server = http.createServer(function(req, res){
    var path = req.url; 
    debug( 'path: ' + path );
    
	var info = sysinfo.sysinfo();
	
	if ( path == '/json'){
		if (req.method == 'GET') {
			res.writeHead(200,{'Content-Type': 'text/json'});
			res.write(JSON.stringify( info ));
			res.end();
		}
	}
	else if ( path == '/' ){
		if (req.method == 'GET') {
			res.writeHead(200,{'Content-Type': 'text/html'});
			res.write(makePage(info,rt));
			res.end();
		}
	}
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





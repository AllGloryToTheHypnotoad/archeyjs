//var monitor = require("os-monitor");
var debug = require('debug')('kevin:mon')
//var chalk = require('chalk');
var program = require('commander');
// var parser = require('parser-yaml');
//var jsonfile = require('jsonfile');

var http = require('http');                     // http-server

var sysinfo = require('./lib/sysinfo.js');
var makePage = require('./lib/page.js');

// var spawn = require('child_process').exec;
// var ls = spawn('ls -alh');

var pck = require('./package.json');

program
	.version(pck.version)
	.usage(pck.name + ' [options]')
	.option('-p, --port <port>','Http server port number',parseInt,8080)
	.parse(process.argv);

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
    debug( path );
    
	var info = sysinfo();
	
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
			res.write(makePage(info));
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

server.listen(program.port);





#!/usr/bin/env node

var debug = require('debug')('kevin:mon'); // debugging
//var chalk = require('chalk');            // colors
var program = require('commander');        // CLI access
//var os = require('os');                    // OS access
var http = require('http');                // http-server
var fs = require('fs');
var path = require('path');
var sysinfo = require('../lib/sysinfo.js');   // get system info
var makePage = require('../lib/page.js');     // create web page

// grab info from npm package
var pck = require('../package.json');

var mimeTypes = {
	'.html': 'text/html',
	'.js': 'text/javascript',
	'.css': 'text/css',
	'.json': 'application/json',
	'.png': 'image/png',
	'.jpg': 'image/jpg',
	'.gif': 'image/gif',
	'.wav': 'audio/wav',
	'.mp4': 'video/mp4',
	'.woff': 'application/font-woff',
	'.ttf': 'application/font-ttf',
	'.eot': 'application/vnd.ms-fontobject',
	'.otf': 'application/font-otf',
	'.svg': 'application/image/svg+xml'
};

program
	.version(pck.version)
	.description(pck.description)
	.usage(pck.name + ' [options]')
	.option('-p, --port <port>','Http server port number, default: 8080',8080)
	// .option('-r, --no-static','Do real-time webpage updates')
	.parse(process.argv);

debug('archeyjs ready on port: '+ program.port);

// function returnStaticFile(file, res) {
function getFile(file, res) {
	// https://nodejs.org/docs/latest/api/path.html#path_path_resolve_paths
	var filePath = path.resolve(__dirname, './static' + file);
	var extname = String(path.extname(filePath)).toLowerCase();
	var contentType = mimeTypes[extname];

	// debug('>> Looking for ' + extname + ' at ' + filePath);

	fs.readFile(filePath, function(error, content){
		if (error){
			debug('Error:' + error);
			// if(error.code == 'ENOENT'){
			// 	fs.readFile('./404.html', function(error, content) {
			// 		res.writeHead(200, { 'Content-Type': 'text/html' });
			// 		res.end(content, 'utf-8');
			// 	});
			// }
			if(error.code == 'ENOENT'){
				debug(' >> File not found << ');
			}
		}
		else {
			res.writeHead(200, { 'Content-Type': contentType });
			if (extname == '.css' || extname == '.html'){
				// debug(content.toString());
				res.end(content.toString(), 'utf-8');
			}
			else {
				// debug(content);
				res.end(content, 'binary');
			}
		}
	});
}

// Simple REST server
var server = http.createServer(function(req, res){
	var path = req.url;
	// debug('path: ' + path);
	// debug('pwd ' + __dirname);

	// return json
	if (path == '/json'){
		var info = sysinfo.sysinfo();

		if (req.method == 'GET') {
			res.writeHead(200,{'Content-Type': 'text/json'});
			res.write(JSON.stringify(info));
			res.end();
		}
	}
	// return status web page
	else if (path == '/'){
		var info = sysinfo.sysinfo();

		if (req.method == 'GET') {
			res.writeHead(200,{'Content-Type': 'text/html'});
			res.write(makePage(info));
			res.end();
		}
	}
	// font
	else if (path == '/font-linux.css'){
		// debug(' >> font-linux ... yeah');
		getFile(path, res);
	}

	else if (path == '/font-linux.woff' || path == '/font-linux.ttf') {
		getFile(path, res);
	}

	else {
		// force users to / or /json
		debug("Wrong path " + path);
		debug("Wrong path: use http://localhost:" + program.port + " or http:localhost:" + program.port + "/json\n");
		// res.writeHead(404, "Not Found", {'Content-Type': 'text/html'});
		// res.write("Wrong path: use http://localhost:" + program.port + " or http:localhost:" + program.port + "/json\n");
		// res.end();
		getFile('/404.html', res);
	}
});

// start web server
server.listen(program.port);

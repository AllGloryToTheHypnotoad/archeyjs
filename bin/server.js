#!/usr/bin/env node

// var debug = require('debug')('kevin:mon'); // debugging
//var chalk = require('chalk');            // colors
var program = require('commander');        // CLI access
//var os = require('os');                    // OS access
var http = require('http');                // http-server
var fs = require('fs');
var path = require('path');
var sysinfo = require('../lib/sysinfo.js');   // get system info
var makePage = require('../lib/page.js');     // create web page
var tech = require('techno-font');           // web font

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

var html404 = '\
<!DOCTYPE html>\n\
<html>\n\
	<head>\n\
		<style>\n\
			p {\n\
				text-align: center;\n\
				font-size: 100px;\n\
				color: #888;\n\
			}\n\
			body {\n\
				background-color: #444;\n\
			}\n\
			</style>\n\
	</head>\n\
	<body>\n\
		<p class="error">404</p>\n\
	</body>\n\
</html>'

program
	.version(pck.version)
	.description(pck.description)
	.usage(pck.name + ' [options]')
	.option('-p, --port <port>','Http server port number, default: 8080', 8080)
	.parse(process.argv);

console.log('archeyjs ready on port: '+ program.port);

// function returnStaticFile(file, res) {
function getFile(file, res) {
	// https://nodejs.org/docs/latest/api/path.html#path_path_resolve_paths
	var filePath = path.resolve(__dirname, './static' + file);
	var extname = String(path.extname(filePath)).toLowerCase();
	var contentType = mimeTypes[extname];

	// debug('>> Looking for ' + extname + ' at ' + filePath);

	fs.readFile(filePath, function(error, content){
		if (error){
			console.log('Error:' + error);
			// if(error.code == 'ENOENT'){
			// 	fs.readFile('./404.html', function(error, content) {
			// 		res.writeHead(200, { 'Content-Type': 'text/html' });
			// 		res.end(content, 'utf-8');
			// 	});
			// }
			if(error.code == 'ENOENT'){
				console.log(' >> File not found << ');
			}
		}
		// else if (filePath == '/404.html'){
		// 	res.writeHead(404, { 'Content-Type': 'text/html' });
		// 	res.end(content.toString(), 'utf-8');
		// }
		else {
			res.writeHead(200, { 'Content-Type': contentType });
			if (extname == '.css' || extname == '.html'){
				// debug(content.toString());
				// res.end(content.toString(), 'utf-8');
				res.end(content.toString());
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
	console.log('req.url: ' + req.url);
	// debug('pwd ' + __dirname);

	// return json
	if (req.url === '/json'){
		var info = sysinfo.sysinfo();

		if (req.method == 'GET') {
			res.writeHead(200,{'Content-Type': 'text/json'});
			res.write(JSON.stringify(info));
			res.end();
		}
	}
	// return status web page
	else if (req.url === '/'){
		var info = sysinfo.sysinfo();

		if (req.method === 'GET') {
			res.writeHead(200,{'Content-Type': 'text/html'});
			res.write(makePage(info));
			res.end();
		}
	}

	// font
	else if (req.url === '/techno-font.css'){
		res.writeHead(200, { 'Content-Type': 'text/css' });
		var content = tech.getCSS();
		console.log(content.toString());
		res.end(content.toString(), 'utf-8');
	}

	else if (req.url === '/techno-font.woff') {
		// var extname = String(path.extname(req.url)).toLowerCase();
		// var contentType = mimeTypes[extname];
		res.writeHead(200, { 'Content-Type': 'application/font-woff' });
		var content = tech.getWOFF();
		// console.log(content);
		res.end(content, 'binary');
	}

	else if (req.url === '/techno-font.ttf') {
		res.writeHead(200, { 'Content-Type': 'application/font-ttf' });
		var content = tech.getTTF();
		// console.log(content);
		res.end(content, 'binary');
	}

	else if (req.url === '/techno-font.eot') {
		res.writeHead(200, { 'Content-Type': 'application/vnd.ms-fontobject' });
		var content = tech.getEOT();
		// console.log(content);
		res.end(content, 'binary');
	}

	else if (req.url === '/techno-font.svg') {
		res.writeHead(200, { 'Content-Type': 'application/image/svg+xml' });
		var content = tech.getEOT();
		// console.log(content);
		res.end(content.toString(), 'utf-8');
	}

	else {
		// force users to / or /json
		console.log("Wrong path " + req.url);
		// debug("Wrong path: use http://localhost:" + program.port + " or http:localhost:" + program.port + "/json\n");
		// res.writeHead(404, "Not Found", {'Content-Type': 'text/html'});
		// res.write("Wrong path: use http://localhost:" + program.port + " or http:localhost:" + program.port + "/json\n");
		// res.end();
		// getFile('/404.html', res);
		res.writeHead(404, { 'Content-Type': 'text/html' });
		res.end(html404, 'utf-8');

	}
});

// start web server
server.listen(program.port);

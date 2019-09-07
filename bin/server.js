#!/usr/bin/env node
// MIT License, (c) 2015 Kevin Walchko

// built in nodejs -----------------------------------------------------------
var platform = require("os").platform();
var http = require("http");                 // basic http-server
var fs = require("fs");                     // access file system
var path = require("path");                 // handle file paths correctly
// archeyjs libraries --------------------------------------------------------
var ping = require("../lib/ping.js");       // ping other Pi's using archeyjs
var sysinfo = require("../lib/sysinfo.js"); // get system info
var makePage = require("../lib/page.js");   // create web page
const ip = require("../lib/ip.js");   // get IP address
// NPM Packages --------------------------------------------------------------
var tech = require("techno-font");          // web font
var program = require("commander");         // CLI access
// var localIp = require("ip");             // get local ip address

function getFileSync(file) {
    // Read in static files
    // https://nodejs.org/docs/latest/api/path.html#path_path_resolve_paths
    var filePath = path.resolve(__dirname, "./static/" + file);
    // var extname = String(path.extname(filePath)).toLowerCase();
    var ret = fs.readFileSync(filePath);
    return ret;
}

// variables
// var initStatics = true;
var html404 = getFileSync("404.html").toString();
var stylecss = getFileSync("style.css").toString();
var htmlcmdraw = getFileSync("command.html").toString();
var htmlcmd;
var htmlbye = getFileSync("shutdown.html").toString();
var htmlping = getFileSync("ping.html").toString();
var grim = getFileSync("grim.png");
var pck = require("../package.json");  // grab info from npm package

var mimeTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpg",
    ".gif": "image/gif",
    ".wav": "audio/wav",
    ".mp4": "video/mp4",
    ".woff": "application/font-woff",
    ".ttf": "application/font-ttf",
    ".eot": "application/vnd.ms-fontobject",
    ".otf": "application/font-otf",
    ".svg": "application/image/svg+xml"
};

const addresses = ip.getIP();
var my_addr = "";
for (var k in addresses){
    var a =addresses[k]["address"];
    if (ip.forwardable(a)) my_addr = a;
}
if (my_addr.length == 0) {
    console.log("** Couldn't find valide forwardable address");
    exit(1);
}
// console.log(my_addr);

program
    .version(pck.version)
    .description(pck.description)
    .usage(pck.name + " [options]")
    .option("-p, --port <port>","Http server port number, default: 8080", 8080)
    .parse(process.argv);

function returnError(url, res){
    console.log("** Wrong path " + url);
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end(html404, "utf-8");
}

function returnFont(file, res) {
        // move to techno-font??
        var extname = String(path.extname(file)).toLowerCase();
        fmt = "binary";

        var content;
        if (extname === ".ttf") {
            content = tech.getTTF();
        }
        else if (extname === ".woff"){
            content = tech.getWOFF();
        }
        else if (extname === ".css"){
            fmt = "utf-8";
            content = tech.getCSS();
        }
        else if (extname === ".svg"){
            fmt = "utf-8";
            content = tech.getSVG();
        }
        else {
            console.log("[ERROR] font not found: " + file);
            returnError(file, res);
            return;
        }

        var contentType = mimeTypes[extname];
        res.writeHead(200, { "Content-Type": contentType });
        res.end(content, fmt);
}

// Simple REST server
var server = http.createServer(function(req, res){
    console.log("req.url: " + req.url);
    // debug("pwd " + __dirname);

    // return json
    if (req.url === "/json"){
        var info = sysinfo.sysinfo();

        if (req.method == "GET") {
            res.writeHead(200,{"Content-Type": "text/json"});
            res.write(JSON.stringify(info));
            res.end();
        }
    }
    // return status web page
    else if (req.url === "/"){
        var info = sysinfo.sysinfo();
        // console.log(info);

        // update ip address on links incase they changed
        var n = info["network"];
        var keys = Object.keys(n);
        var key = keys[0];
        // var ip_addr = info["network"][key]["address"];
        // htmlcmd = htmlcmdraw.replace(/localhost/g, ip_addr);

        if (req.method === "GET") {
            res.writeHead(200,{"Content-Type": "text/html"});
            res.write(makePage(info));
            res.end();
        }
    }

    else if (req.url === "/style.css"){
        res.writeHead(200, { "Content-Type": "text/css" });
        res.end(stylecss, "utf-8");
    }

    else if (req.url === "/grim.png"){
        res.writeHead(200, { "Content-Type": "image/png" });
        res.end(grim);
    }

    else if (req.url === "/command"){
        htmlcmd = htmlcmdraw.replace(/localhost/g, my_addr);
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(htmlcmd, "utf-8");
    }

    else if (req.url === "/ping"){
        var ans = ping();
        console.log(ans);
        res.writeHead(200, { "Content-Type": "text/html" });
        var hp = htmlping.replace(/TABLE/g, ans);
        console.log(hp);
        res.end(hp, "utf-8");
    }

    else if (req.url === "/shutdown"){
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(htmlbye, "utf-8");

        console.log("Shutting down system now");

        var exec = require("child_process").exec;
        var child;

        if (platform === "darwin"){
            this.command = "ls ~";  // testing
        }
        else {
            this.command = "sudo shutdown now";
        }

        child = exec(this.command, function (error, stdout, stderr){
            if(error !== undefined){
                console.log(stdout);
            }
            else {
                console.log("ERROR:")
                console.log(error);
                console.log(stderr);
            }
        });
        res.end();
    }

    else if (req.url === "/reboot"){
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(htmlbye, "utf-8");

        console.log("Rebooting system now");

        var exec = require("child_process").exec;
        var child;

        if (platform === "darwin"){
            this.command = "ls ~";  // testing
        }
        else {
            this.command = "sudo reboot now";
        }

        child = exec(this.command, function (error, stdout, stderr){
            if(error !== undefined){
                console.log(stdout);
            }
            else {
                console.log("ERROR:")
                console.log(error);
                console.log(stderr);
            }
        });
        res.end();
    }

    else if (req.url === "/alive") {
        res.statusCode = 200;
        res.end();
    }

    else {
        // assume it is a font ... if not, 404 will be returned
        returnFont(req.url, res);
    }
});

// catch errors
server.on("error", function(e) {
    if (e.code == "EADDRINUSE") {
        console.log("port already in use");
    } else if (e.code == "EACCES") {
        console.log("Illegal port");
    } else {
        console.log("Unknown error");
    }
    process.exit(1);
});

// start web server
server.listen(program.port);
console.log(pck.name + " started on port " + program.port);
console.log("Addresses: " + addresses["en0"]["address"]);
console.log("");

// MIT License, (c) 2015 Kevin Walchko

// why does free, top, htop all disagree on memory
// http://iot.technoedu.com/forums/topic/raspicam-solved-raspberry-pi-3-has-less-than-1gb-memory-available-at-os-level/
// https://www.raspberrypi.org/documentation/raspbian/applications/camera.md

var os = require("os");
var fs = require("fs");
var rpi = require("../lib/rpi-info.js");
var ip = require("../lib/ip.js");
var disk = require("../lib/diskinfo.js");
var osxRelease = require("../lib/macos.js");
var diskinfo = {};


disk.getStorage(function(err, drives) {
    if(err){
        console.log("err: "+err);
    }
    for (var key in drives){
        // console.log('Drive ' + key + ': ' + drives[key].available + ' / ' + drives[key].size + ' free, ' + drives[key].capacity + ' used');
        diskinfo[key] = { "available":drives[key].available, "size":drives[key].size, "capacity":drives[key].capacity };
    }
});

// find uptime
function secondsToTime() {
    var sec = os.uptime();
    var d = parseInt(Math.floor(sec/(3600*24)));
    var h = parseInt(Math.floor(sec%(3600*24)/3600));
    var m = parseInt(Math.floor((sec%(3600*24))%3600)/60);
    return d+' days '+h+' hrs '+m+' mins';
}

// convert bytes to proper size
function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return "0 Byte";
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

// main function exported, returns json of system info
exports.sysinfo = function(){
    // system info
    var sys = {
            'platform': os.platform(),
            'load': os.loadavg()[0].toFixed(2),
            'release': os.release(),
            'uptime': secondsToTime(),
            'free_memory': bytesToSize(os.freemem()),
            'total_memory': bytesToSize(os.totalmem()),
            'cpu': os.cpus()[0]['model'],
            'arch': os.arch(),
            'hostname':os.hostname(),
            'network': ip.getIP(),
            'storage': diskinfo,
            'timestamp': new Date(),
            'rpi': rpi()
    };

    // platform fixes
    if (sys['platform'] == 'darwin') {
        sys['platform'] = 'OSX';
        sys['release'] = osxRelease();
    }
    // for linux, read /etc/os-release and find the PRETTY name
    else if (sys['platform'] == 'linux') {
        try {
            var file = fs.readFileSync('/etc/os-release','utf8').split('\n');
            var name = '';
            for (var i = 0; i < file.length; i++){
                if (file[i].indexOf('PRETTY') >= 0){
                    name = file[i].split('=')[1];
                    name = name.replace(/"/g,'');
                    break;
                }
            }
            sys['platform'] = 'Linux';
            sys['release'] = {'name': name, 'version': os.release()};
        }
        catch(err){
            console.log('WARNING: /etc/os-release not found');
            console.log(err);
            sys['platform'] = 'Linux';
            sys['release'] = {'name': 'Linux', 'version': os.release()};
        }
    }
    else {
        sys['platform'] = os.platform();
        sys['release'] = {'name': os.platform(), 'version': os.release()};
    }

    return sys;
};

// used by real-time update to grab a smaller sub set of info that changes
// exports.simpleInfo = function(){
//
//     // system info
//     var sys = {
//         'load': os.loadavg()[0].toFixed(2),
//         'uptime': secondsToTime(),
//         'free_memory': bytesToSize(os.freemem()),
//         'total_memory': bytesToSize(os.totalmem()),
//         'timestamp': new Date()
//     };
//     return sys;
// }

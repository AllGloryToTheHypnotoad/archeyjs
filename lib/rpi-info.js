// MIT License, (c) 2015 Kevin Walchko

var fs = require('fs');
// var exec = require('child_process').exec;
// var debug = require('debug')('kevin:mon');
const exec = require("child_process").execSync;

// https://www.raspberrypi.org/documentation/hardware/raspberrypi/revision-codes/README.md
var rpi_ids = {
  "900061" : "CM3 512MB",
  "a020a0" : "CM3 1GB",
  "a02100" : "CM3+ 1GB",
  "900092" : "Zero 512MB",
  "900093" : "Zero 512MB",
  "9000c1" : "Zero W 512MB",
  "a02082" : "Pi3B 1GB",
  "a22082" : "Pi3B 1GB",
  "a32082" : "Pi3B 1GB",
  "a52082" : "Pi3B 1GB",
  "a22083" : "Pi3B 1GB",
  "a020d3" : "Pi3B+ 1GB",
  "a03111" : "Pi4B 1GB",
  "b03111" : "Pi4B 2GB",
  "c03111" : "Pi4B 4GB"
};

module.exports = function(){
    const CPU_INFO = "/proc/cpuinfo";
    try{
        var cpu_info = fs.readFileSync(CPU_INFO).toString();
    }
    catch(err){
        // console.log(err);
        return "";
    }
    cpu_info = cpu_info.slice(cpu_info.lastIndexOf("Revision") , cpu_info.length);
    revision = cpu_info.slice(cpu_info.indexOf(":")+1 , cpu_info.indexOf("\n")).trim();
    return rpi_ids[revision]
}

// const LOADAVG = "/proc/loadavg";
// const CPUINFO = "/proc/cpuinfo";
// const MEMINFO = "/proc/meminfo";
// const UPTIME = "/proc/uptime";

// function command(cmd){
//     var oProcess = exec(
//         cmd,
//         function (err, stdout, stderr) {
//             if (err) {
//                 debug(stderr);
//                 return stderr;
//             }
//             return stdout;
//         });
//     return oProcess;
// }

// exports.checkProc = function(what){
//     // var ans = false;
//     if (what == "bluetooth"){
//         var ret = exec("cat /proc/modules | grep rfkill").toString();
//         if (ret.search("bluetooth") > -1){
//             return true;
//         }
//     }
//     else if (what == "wifi"){
//         var ret = exec("cat /proc/modules | grep rfkill").toString();
//         if (ret.search("80211") > -1){
//             return true;
//         }
//     }
//     // else if (what == "usb0"){
//     //     var ret = exec("cat /proc/modules | grep rfkill").toString();
//     //     if (ret.search("80211") > -1){
//     //         return true;
//     //     }
//     // }
// }

// exports.getProc = function(what){
//     if (what == "uptime"){
//         const up = exec("cat /proc/uptime | awk {'print $1'}").toString().replace("\n","");
//         var ans = [0, 0, 0];             // days hours mins
//         ans[0] = parseInt(up/60/60/24);  // days
//         ans[1] = parseInt(up/60/60%24);  // hours
//         ans[2] = parseInt(up/60%60);     // minutes
//         return ans;
//     }
//     else if (what == "loadavg"){
//         var t  = exec("cat /proc/loadavg").toString().replace("\n","");
//         t = t.split(" ");
//         const ans = [t[0], t[1], t[2]];
//         return ans;
//     }
//     else if (what == "memfree"){
//         const t  = exec("cat /proc/meminfo").toString().replace(/ /g, '').split("\n");
//         const ans = [
//             t[0].split(":")[1].replace("kB",""),
//             t[1].split(":")[1].replace("kB","")
//         ];
//         return ans;
//     }
//     else if (what == "cpuinfo"){
//         const t = exec("cat /proc/cpuinfo").toString().split("\n\n");
//         // var cores = t.length-1;
//         const ans = {
//             "model": t[0].split("\n")[1],
//             "cores": t.length-1,
//             "revision": t[4].split("\n")[1]
//         };
//         return ans;
//     }
// }
// var c2f = function(c){
//     return c*1.8+32;
// }
//
// exports.vcgencmd = function(what){
//     // http://elinux.org/RPI_vcgencmd_usage
//     // https://github.com/nezticle/RaspberryPi-BuildRoot/wiki/VideoCore-Tools
//     // https://raspberrypi.stackexchange.com/questions/56266/raspberry-pi-3-has-less-than-1gb-memory-available-at-os-level
//     var ans = "";
//     switch(what){
//         case "measure_temp":
//             ans = exec("vcgencmd measure_temp").toString().replace("\'C\n","").split("=")[1];
//         case "get_mem_gpu":
//             ans = exec("vcgencmd get_mem gpu").toString().replace("M\n", "");
//             ans = ans.split("=")[1];
//         case "get_mem_arm":
//             ans = exec("vcgencmd get_mem arm").toString().replace("M\n", "");
//             ans = ans.split("=")[1];
//     }
//     return ans;
// }

// exports.info = function(){
//     var ans = {
//         "freeMemory": getProc("memfree"),      // arm memory that is free
//         "gpuMemory": vcgencmd("get_mem_gpu"),  // gpu memory size
//         "armMemory": vcgencmd("get_mem_arm"),  // total arm memory size - gpu memory
//         "tempC": vcgencmd("measure_temp"),     // temperature of arm
//         "cpuinfo": getProc("cpuinfo"),         // cpu info
//         "loadavg": getProc("loadavg"),         // load average
//         "bluetooth": checkProc("bluetooth"),   // T/F bluetooth
//         "wifi": checkProc("wifi"),             // T/F wifi
//         "usb0": checkProc("usb0"),             // T/F nrdis/usb ethernet gadet
//     };
//
//     return ans;
// }

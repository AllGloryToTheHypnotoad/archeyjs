// MIT License, (c) 2015 Kevin Walchko
var os = require("os");
// // https://nodejs.org/dist/latest-v12.x/docs/api/util.html#util_util_format_format_args
// var format = require("util").format;

/*
Returns a dictionary of ip interfaces:
    ip.getIP('IPv4')
    { en0: { address: '105.0.5.70', mac: 'f4:05:24:25:d8:5a' } }
*/
exports.getIP = function(IP='IPv4'){
    // Get ip info from interface e
    // 'IPv6' or 'IPv4'
    function ip(e, IP46){
        var ans = {};
        for( var i=0; i < net[e].length; i++){
            if(net[e][i]['family'] == IP46){
                ans['address'] = net[e][i]['address'];
                ans['mac'] = net[e][i]['mac'];
            }
        }
        return ans;
    }
    var net = os.networkInterfaces();

    ret = {};
    const inter = ['eth0','wlan0','wlan1','en0','en1', 'usb0'];
    for (var i in inter){
        var key = inter[i];
        if(net[key]) ret[key] = ip(key, IP);
        // else console.log("no " + key);
    }

    // console.log(ret);

    // did we find anything?
    if (Object.keys(ret).length > 0) return ret;
    // ok - can't find anything useful, get the loopback interface
    else {
        if (net['lo0']) ret.lo0 = ip('lo0'); // apple
        if (net['lo'])  ret.lo = ip('lo');   // linux
        return ret;
    }
}

// ok, this isn't very accurate, but it is good enough
exports.forwardable = function(ip){
    var first = ip.split(".")[0];
    var ans;
    first == "127" || first == "169" ? ans = false : ans = true;
    return ans;
}

// ok, this isn't very accurate, but it is good enough
exports.routeable = function(ip){
    var v = ip.split(".");
    var a  = v[0] + "." + v[1]
    var ans;
    a == "127.0" || a == "172.0" || a == "192.168" ? ans = false : ans = true;
    return ans;
}

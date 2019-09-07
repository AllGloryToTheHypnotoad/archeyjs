// MIT License, (c) 2015 Kevin Walchko
const fetch = require('node-fetch');
// https://nodejs.org/dist/latest-v12.x/docs/api/util.html#util_util_format_format_args
var format = require("util").format;

async function run(addr, port){
    var hosts = [];

    for(var i=70; i<71; i++){
        try{
            const url = format("http://%s.%d:%d/alive",addr,i,port);
            const resp = await fetch(url, {timeout: 200});
            if(resp.ok){
                const data = await resp.json();
                // var hosts = [];
                var row = {
                    "host": "",
                    "eth": "",
                    "wifi": ""
                };
                row.host = data['hostname'];
                row.hw = data["rpi"];
                const ifs = data["network"];
                // var ips = "";
                for(var key in ifs){
                    // ips += key + ": " + ifs[key]["address"] + "  ";
                    // hosts.key = ifs[key]["address"];
                    if(key == "eth0" || key == "en1") row.eth = ifs[key]["address"];
                    if(key == "wlan0" || key == "en0") row.wifi = ifs[key]["address"];
                    // hosts.push(row);
                }
                hosts.push(row);
                // console.log("kk " + name + " " + ips);
                // hosts[name] = name + " " + ips;
            }
            else
                console.log(format(">> %s[%s] %s",
                    resp.url,
                    resp.status,
                    resp.statusText
                ));

        }
        catch(err){
            if(err.type == 'request-timeout'); //console.log("** socket timeout error");
            else if (err.type == 'system');
            else console.log(err);
        }
    }

    table = '<table class="center">\n';
    table += "<tr><th>Hostname</hd><th>Ethernet</hd><th>Wifi</hd></hd><th>Hardware</hd></tr>\n";
    for (var i in hosts){
        // console.log("?? " + key + ' '+ hosts[key]);
        // table += "<tr>" + hosts[key] + "</tr>\n"
        table += format("<tr><td>%s</td><td>%s</td><td>%s</td><td>%s</td></tr>\n",
            hosts[i]["host"], hosts[i]["eth"], hosts[i]["wifi"], hosts[i]["hw"]);
    }
    table += "</table>\n"
    // console.log(table);
    return table;


}

module.exports = async function(ip, port, callback){
    let hosts = await run(ip,port);
    // return hosts;
    callback(hosts);
}

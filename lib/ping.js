// MIT License, (c) 2015 Kevin Walchko
const fetch = require('node-fetch');
// https://nodejs.org/dist/latest-v12.x/docs/api/util.html#util_util_format_format_args
var format = require("util").format;

async function run(addr, port){
    var hosts = [];

    for(var i=70; i<110; i++){
        try{
            const url = format("http://%s.%d:%d/alive",addr,i,port);
            const resp = await fetch(url, {timeout: 200});

            console.log(resp);

            if(resp.ok){
                const data = await resp.json();
                var row = {
                    "host": "",
                    "eth": "",
                    "wifi": ""
                };
                row.host = data['hostname'];
                row.hw = data["rpi"];
                const ifs = data["network"];
                if(ifs["eth0"]) row.eth = ifs["eth0"]["address"];
                if(ifs["en1"])  row.eth = ifs["en1"]["address"];

                if(ifs["wlan0"]) row.wifi = ifs["wlan0"]["address"];
                if(ifs["en0"])   row.wifi = ifs["en0"]["address"];

                hosts.push(row);
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

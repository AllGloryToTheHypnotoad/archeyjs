// MIT License, (c) 2015 Kevin Walchko
const fetch = require('node-fetch');
// const http = require('http');
// const timeoutAgent = new http.Agent({ timeout: 200 });

function checkStatus(res) {
    if (res.ok) { // res.status >= 200 && res.status < 300
        return res;
    } else {
        console.log(">> " + res.url + "[" + res.status + ']:' + res.statusText);
        // console.log(res);
    }
}

function run(addr, port){
    var hosts = {};
    for(var i=2; i<71; i++){
        // console.log(i.toString());
        var url = 'https://randomuser.me/api/?results=10';
        var to = {timeout: 200};
        fetch("http://" + addr + i.toString() + ":" + port + "/json", to)
        .then(checkStatus)
        .then((resp) => resp.json())
        .then(function(data) {
            // console.log(data);
            const name = data['hostname'];
            const ifs = data["network"];
            var ips = "";
            for(var key in ifs){
                ips += key + ": " + ifs[key]["address"] + "  ";
                // hosts.key = ifs[key]["address"];
            }
            console.log("kk " + name + " " + ips);
            hosts.name = name + " " + ips;
        })
        .catch(function(error) {
            // console.log(">> " + error);
        });
    }

    console.log("gg " + hosts);

    table = "<table>\n"
    for (var key in hosts){
        console.log("?? " + hosts[key]);
        table += "<tr>" + hosts[key] + "</tr>\n"
    }
    table += "</table>\n"
    console.log(table);
    return table;
}

module.exports = function(){
    var hosts = run("10.0.1.", "8080");
}

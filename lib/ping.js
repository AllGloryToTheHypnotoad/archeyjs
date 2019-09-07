// MIT License, (c) 2015 Kevin Walchko
const fetch = require('node-fetch');
// https://nodejs.org/dist/latest-v12.x/docs/api/util.html#util_util_format_format_args
var format = require("util").format;

async function run(addr, port){
    var hosts = {};

    for(var i=2; i<250; i++){
        try{
            // console.log(i.toString());
            // var to = {timeout: 200};
            const url = format("http://%s.%d:%d/json",addr,i,port);
            const resp = await fetch(url, {timeout: 200});
            if(resp.ok){
                const data = await resp.json();
                // console.log(data);
                const name = data['hostname'];
                const ifs = data["network"];
                var ips = "";
                for(var key in ifs){
                    ips += key + ": " + ifs[key]["address"] + "  ";
                    // hosts.key = ifs[key]["address"];
                }
                console.log("kk " + name + " " + ips);
                hosts[name] = name + " " + ips;
            }
            else
                console.log(format(">> %s[%s] %s",
                    resp.url,
                    resp.status,
                    resp.statusText
                ));

        }
        catch(err){
            if(err.type == 'request-timeout') console.log("** socket timeout error");
            else if (err.type == 'system');
            else console.log(err);
        }
    }

    table = "<table>\n"
    for (var key in hosts){
        console.log("?? " + key + ' '+ hosts[key]);
        // table += "<tr>" + hosts[key] + "</tr>\n"
        table += format("<tr><td> %s </td></tr>\n", hosts[key]);
    }
    table += "</table>\n"
    console.log(table);
    return table;


}

module.exports = async function(callback){
    let hosts = await run("10.0.1", "8080");
    // return hosts;
    callback(hosts);
}

////////////////////////////
// async function checkStatus(res) {
//     if (res.ok) { // res.status >= 200 && res.status < 300
//         return res;
//     } else {
//         console.log(">> " + res.url + "[" + res.status + ']:' + res.statusText);
//         // console.log(res);
//     }
// }

// function run(addr, port){
//     var hosts = {};
//     for(var i=2; i<71; i++){
//         // console.log(i.toString());
//         var url = 'https://randomuser.me/api/?results=10';
//         var to = {timeout: 200};
//         fetch("http://" + addr + i.toString() + ":" + port + "/json", to)
//         .then(checkStatus)
//         .then((resp) => resp.json())
//         .then(function(data) {
//             // console.log(data);
//             const name = data['hostname'];
//             const ifs = data["network"];
//             var ips = "";
//             for(var key in ifs){
//                 ips += key + ": " + ifs[key]["address"] + "  ";
//                 // hosts.key = ifs[key]["address"];
//             }
//             console.log("kk " + name + " " + ips);
//             hosts.name = name + " " + ips;
//         })
//         .catch(function(error) {
//             // console.log(">> " + error);
//         });
//     }
//
//     console.log("gg " + hosts);
//
//     table = "<table>\n"
//     for (var key in hosts){
//         console.log("?? " + hosts[key]);
//         // table += "<tr>" + hosts[key] + "</tr>\n"
//         table += format("<tr> %s </tr>\n", hosts[key]);
//     }
//     table += "</table>\n"
//     console.log(table);
//     return table;
// }

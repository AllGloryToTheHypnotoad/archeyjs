#!/usr/bin/env node
const fetch = require('node-fetch');

for(var i=2; i<250; i++){
    var url = 'https://randomuser.me/api/?results=10';
    fetch("http://10.0.1." + i.toString() + ":8080/json")
    .then((resp) => resp.json())
    .then(function(data) {
        const name = data['hostname'];
        const ifs = data["network"];
        var ips = "";
        for(var key in ifs){
            ips += key + ": " + ifs[key]["address"] + "  ";
        }
        console.log(name + " " + ips);
    })
    .catch(function(error) {
        console.log(".");
    });
}

#!/usr/bin/env node
const fetch = require('node-fetch');

function run(){
    for(var i=69; i<71; i++){
        var url = 'https://randomuser.me/api/?results=10';
        fetch("http://10.0.1." + i.toString() + ":8080/json")
        .then((resp) => resp.json())
        .then(function(data) {
            // console.log(data);
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
}

module.exports = function(){
    var template =  `
    <!DOCTYPE html>
    <html>
    <body>

    <button onclick="myFunction()">Click me</button>

    <p id="demo"></p>

    <p>A function </p>

    <script>
    function myFunction() {
      document.getElementById("demo").innerHTML = "Hello World";
    }
    </script>

    </body>
    </html>`
}

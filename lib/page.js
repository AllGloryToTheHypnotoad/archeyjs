// MIT License, (c) 2015 Kevin Walchko
// Create an HTML5 webpage

// var localIp = require('ip');                  // get local ip address
// var localIpAddress = localIp.address();

function line(a,b,c){
    return '<tr><td class="bold">' + a + '</td><td id="' + c + '">' + b + '</td></tr>';
}

function table(info){
    var t = '<table class="center">';
    t += line(info['platform'],info['release']['name']+'('+info['release']['version']+')');

    if(info['rpi'].length > 0) t += line('Raspberry Pi',info['rpi']);

    t += line('CPU',info['cpu']);
    t += line('Arch',info['arch']);
    t += line('Load',info['load'],'load');
    t += line('Memory',info['free_memory'] + ' / ' + info['total_memory'] + ' used','mem');
    t += line('Uptime',info['uptime'],'up');

    t += line('Interfaces','');
    var n = info['network'];
    for(var key in n){
        // console.log(">> " + key);
        t += line(key + ':', n[key]['address'] + ' / ' + n[key]['mac']);
        // t += line(key + ':', n[key]['IPv4']['address'] + ' / ' + n[key]['IPv4']['mac']);
        // t += line('IPv6',info['network']['IPv6']['address']+' / '+info['network']['IPv6']['mac']);
    }
    t += line('Storage','');
    for (var key in info['storage']){
        // console.log(">> " + key);
        t += line(key + ':', info['storage'][key].available + ' of ' + info['storage'][key].size + ' free, ' + info['storage'][key].capacity + ' used');
    }
    t += '</table>';
    return t;
}

function osInfo(name){
    var os = '';
    if (name == 'OSX') {os = "apple";}
    else if (name.indexOf('redhat') > -1) {os ="redhat"; }
    else if (name.indexOf('linuxmint') > -1) {os = 'linuxmint';}
    else if (name.indexOf('ubuntu') > -1) {os = 'ubuntu-inverse';}
    else if (name.indexOf('slackware') > -1) {os = 'slackware';}
    else if (name.indexOf('freebsd') > -1) {os = 'freebsd';}
    else if (name.indexOf('fedora') > -1) {os = 'fedora';}
    else if (name.indexOf('opensuse') > -1) {os = 'opensuse';}
    else if (name.indexOf('centos') > -1) {os = 'centos';}
    else if (name.indexOf('archlinux') > -1) {os = 'archlinux';}
    else if (name.indexOf('gentoo') > -1) {os = 'gentoo';}
    else if (name.indexOf('debian') > -1) {os = 'debian';}
    else if (name.indexOf('raspbian') > -1) {os = 'raspberrypi';}
    else {os = 'tux';}
    // console.log('OS: '+ os);
    var p = {'os': os};
    return p;
}

module.exports = function(info){
    // get os settings
    var name = '';
    if (info['platform'] == 'OSX') {
        name = 'OSX';
    }
    else {
        name = info['release']['name'].toLowerCase();
    }
    var os = osInfo(name);

    var page = '<!DOCTYPE html><html lang="en">';
    page += '<head>';

    // page += '<style>';
    // page += 'table.center { margin-top: 150px; margin-left:auto; margin-right:auto;}';
    // page += 'td.bold {font-weight: bold; text-align: right;}';
    // page += 'h1.center {text-align: center; margin: 0px;}';
    // page += 'div.center {text-align: center; margin-top: 10px; margin-bottom: 0px;}';
    // page += 'header {padding:0px; position: fixed; left: 0; top: 0; color: white; width: 100%; display:block; background-color: ' + os['color'] + '}';
    // page += 'footer {margin: 0; padding: 0; position: fixed; left: 0; bottom: 0; width: 100%; height: 44px; line-height: 44px; text-align: center; background-color: ' + os['color'] + ';}';
    // page += 'a {display: inline-block; margin: 0 40px; text-decoration: none; color: #ffffff; text-transform: uppercase; font-size: 12px;}';
    // page += '</style>';
    // page += '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">';
    // page += '<link href="https://cdn.rawgit.com/walchko/font-linux/v0.6/assets/font-linux.css" rel="stylesheet">'
    // page += '<link rel="stylesheet" href="./font-linux.css">';
    page += '<link rel="stylesheet" href="/techno-font.css">';
    page += '<link rel="stylesheet" href="/style.css">';
    page += '</head>';
    page += '<body>';

    // OS picture
    // console.log(os['os']);
    page += '<header class="' + os['os'] + '">'
    page += '<div class="center">';
    page += '<i class="tf-' + os['os'] + ' tf-72" style="color:' + "white" + '"></i>';
    page += '</div>';

    page += '<h1 class="center">'+ info['hostname']+'</h1>';
    page += '</header>';

    page += table(info);

    page += '<div style="min-height: 50px;"> </div>';  // extra space

    page += '<div class="center">';
    var n = info["network"];
    var keys = Object.keys(n);
    var key = keys[0];
    page += '<a href="http://' + n[key]['address'] + ':8080/command" class="button">Commands</a>';
    page += '</div>';

    page += '<div style="min-height: 50px;"> </div>';  // extra space so footer doesn't hide/overlap info

    page += '<footer class="' + os['os'] + '">';
    page += '<a href="https://github.com/AllGloryToTheHypnotoad/archeyjs"> <i class="tf-github tf-14"></i> Github</a> ';
    page += '<a id="timestamp">' + info['timestamp'] + '</a>';
    page += '</footer>';
    page +='</body></html>';
    return page;
};

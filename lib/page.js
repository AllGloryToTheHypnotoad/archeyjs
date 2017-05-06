// Create an HTML5 webpage

function line(a,b,c){
	return '<tr><td class="bold">' + a + '</td><td id="' + c + '">' + b + '</td></tr>';
}

function table(info){
	var t = '<table class="center">';
	t += line(info['platform'],info['release']['name']+'('+info['release']['version']+')');
	t += line('CPU',info['cpu']);
	t += line('Arch',info['arch']);
	t += line('Load',info['load'],'load');
	t += line('Memory',info['free_memory']+' / '+info['total_memory']+' used','mem');
	t += line('Uptime',info['uptime'],'up');
	t += line('IPv4',info['network']['IPv4']['address']+' / '+info['network']['IPv4']['mac']);
	t += line('IPv6',info['network']['IPv6']['address']+' / '+info['network']['IPv6']['mac']);
	t += line('Storage','');
	for (var key in info['storage']){
		t += line(key + ':', info['storage'][key].available + ' of ' + info['storage'][key].size + ' free, ' + info['storage'][key].capacity + ' used');
	}
	t += '</table>';
	return t;
}

function osInfo(name){
	// name = 'slackware';  // testing
	var os = '';
	var color = '';
	if (name == 'OSX') {os = "apple"; color = "#555555";}
	else if (name.indexOf('redhat') > -1) {os ="redhat"; color = 'red'; }
	else if (name.indexOf('linuxmint') > -1) {os = 'linuxmint'; color = 'green';}
	else if (name.indexOf('ubuntu') > -1) {os = 'ubuntu-inverse'; color = 'orangered';}
	else if (name.indexOf('slackware') > -1) {os = 'slackware'; color = 'SLATEBLUE';}
	else if (name.indexOf('freebsd') > -1) {os = 'freebsd'; color = 'red';}
	else if (name.indexOf('fedora') > -1) {os = 'fedora'; color = 'blue';}
	else if (name.indexOf('opensuse') > -1) {os = 'opensuse'; color = 'green';}
	else if (name.indexOf('centos') > -1) {os = 'centos'; color = 'purple';}
	else if (name.indexOf('archlinux') > -1) {os = 'archlinux'; color = '#0099ff';}
	else if (name.indexOf('gentoo') > -1) {os = 'gentoo'; color = 'plum';}
	else if (name.indexOf('debian') > -1) {os = 'debian'; color = 'red';}
	else if (name.indexOf('raspbian') > -1) {os = 'raspberrypi'; color = '#cc3300';}
	else {os = 'tux'; color = 'black';}
	var p = {'os': os, 'color': color};
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

	var page = '<!DOCTYPE html><html>';
	page += '<head>';

	page += '<style>';
	page += 'table.center { margin-top: 150px; margin-left:auto; margin-right:auto;}';
	page += 'td.bold {font-weight: bold; text-align: right;}';
	page += 'h1.center {text-align: center; margin: 0px;}';
	page += 'div.center {text-align: center; margin-top: 10px; margin-bottom: 0px;}';
	page += 'header {padding:0px; position: fixed; left: 0; top: 0; color: white; width: 100%; display:block; background-color: ' + os['color'] + '}';
	page += 'footer {margin: 0; padding: 0; position: fixed; left: 0; bottom: 0; width: 100%; height: 44px; line-height: 44px; text-align: center; background-color: ' + os['color'] + ';}';
	page += 'a {display: inline-block; margin: 0 40px; text-decoration: none; color: #ffffff; text-transform: uppercase; font-size: 12px;}';
	page += '</style>';
// 	page += '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">';
	// page += '<link href="https://cdn.rawgit.com/walchko/font-linux/v0.6/assets/font-linux.css" rel="stylesheet">'
	page += '<link rel="stylesheet" href="./font-linux.css">';
	page += '</head>';
	page += '<body>';

	// OS picture
	page += '<header>'
	page += '<div class="center">';
	page += '<i class="fl-' + os['os'] + ' fl-72" style="color:' + "white" + '"></i>';
	page += '</div>';

	page += '<h1 class="center">'+ info['hostname']+'</h1>';
	page += '</header>'

	page += table(info);

	page += '<div style="min-height: 50px;"> </div>';  // extra space so footer doesn't hide/overlap info

	page += '<footer>';
	page += '<a href="https://github.com/walchko/archeyjs"> <i class="fl-github fl-14"></i> Github</a> ';
	page += '<a id="timestamp">' + info['timestamp'] + '</a>';
	page += '</footer>';
	page +='</body></html>';
	return page;
};

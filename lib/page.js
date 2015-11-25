// Create an HTML5 webpage 

function line(a,b){
	return '<tr><td class="bold">' + a + '</td><td>' + b + '</td></tr>';
}

function table(info){
	var t = '<table class="center">';
	t += line(info['platform'],info['release']['name']+'('+info['release']['version']+')');
	t += line('CPU',info['cpu']);
	t += line('Arch',info['arch']);
	t += line('Load',info['load']);
	t += line('Memory',info['free_memory']+' / '+info['total_memory']);
	t += line('Uptime',info['uptime']);
	t += line('IPv4',info['network']['IPv4']['address']+' / '+info['network']['IPv4']['mac']);
	t += line('IPv6',info['network']['IPv6']['address']+' / '+info['network']['IPv6']['mac']);
	t += '</table>';
	return t;
}

module.exports = function(info){
	var page = '<!DOCTYPE html><html>';
	page += '<head>';
	page += '<style>';
	page += 'table.center { margin-left:auto; margin-right:auto;}';
	page += 'td.bold {font-weight: bold; text-align: right;}';
	page += 'h1.center {text-align: center;}';
	page += 'div.center {text-align: center;}';
	page += 'div.footer {position: fixed; bottom: 0; width: 100%; height: 44px; line-height: 44px; text-align: center; background-color: #888888;}';
	page += 'a {display: inline-block; margin: 0 40px; text-decoration: none; color: #ffffff; text-transform: uppercase; font-size: 12px;}';
	page += '</style>';
	page += '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">';
	page += '</head>';
	page += '<body>';

	// OS picture
	if (info['platform'] == 'OSX') {page += '<div class="center"><i class="fa fa-apple fa-5x"></i></div>';}
	else {page += '<i class="fa fa-linux fa-5x"></i>';}

	page += '<h1 class="center">'+ info['hostname']+'</h1>'; 
	page += table(info); 
	page += '<div class="footer">';
	page += '<a href="https://github.com/walchko"> <i class="fa fa-github fa-lg"></i> Github</a> ';
	page += '<a>' + info['timestamp'] + '</a>';
	page += '</div>';
	page +='</body></html>';
	return page;
};
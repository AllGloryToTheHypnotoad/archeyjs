// create a QR image from host info

var qr = require('qr-image');

module.exports = function(info){
	var data = {};
	
	data.hostname = info['hostname'];
	data.ipv4 = info['IPv4']['address'];
	data.mac = info['IPv4']['mac'];
	data.ipv6 = info['IPv6']['address'];
	
	var img = qr.image(JSON.stringify(data));
	
	return img;
};
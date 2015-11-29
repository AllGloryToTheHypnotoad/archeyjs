// get host storage info

var exec = require('child_process').exec;
var os = require('os');
var drives = {};

exports.getStorage = function(callback) {
// exports.getDrives = function() {
	
	switch (os.platform().toLowerCase()) {
		case 'darwin':
        case 'linux':
			// Run command to get list of drives 
			var oProcess = exec(
				'df -Ph | awk "NR > 1"',
				function (err, stdout, stderr) {
					if (err) return callback(err, null);
					var aLines = stdout.split('\n');
					// For each line get drive info and add to array
					for(var i = 0; i < aLines.length; i++) {					
						var sLine = aLines[i];
						
						if (sLine != '') {
							sLine = sLine.replace(/ +(?= )/g,'');
							var aTokens = sLine.split(' ');
							var len = aTokens.length;
							drives[ aTokens[len-1] ] = {
								size:		aTokens[len-5],
								used:		aTokens[len-4],
								available:	aTokens[len-3],
								capacity:	aTokens[len-2],
							};
							
						}
					}
					// Check if we have a callback
					if (callback != null) {
						callback(null, drives);
					} 
				}
			);	
			break;			
		default:
			console.log('Not supported, only OSX and Linux');
    }

}
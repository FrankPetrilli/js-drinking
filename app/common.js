var fs = require('fs');
// Keep a list in memory so we don't have to constantly read the file.
module.exports = {
	updateWords: function(callback) {
		fs.readFile('wordlist.txt', 'utf8', function(err, data) {
			if (!err) {
				words = data.split('\n');
				console.log('[wordlist] Updated wordlist to: ' + words.length + ' words.');
			}
			if (typeof callback === 'function') {
				callback();
			}
		});
	}
}

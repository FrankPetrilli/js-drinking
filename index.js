/* Requires */
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var fs = require('fs');

var app = express();
var router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* Statics */
app.set('port', 8080);

// Serve the static directory for client stuff.
app.use('/', express.static('static'));

// Keep a list in memory so we don't have to constantly read the file.
var words;
function updateWords() {
	fs.readFile('wordlist.txt', 'utf8', function(err, data) {
		if (!err) {
			words = data.split('\n');
			console.log('Updated wordlist to: ' + words.length + ' words.');
		}
	});
}

router.route('/exists/:packagename').get(function(req, res) {
	console.log('searching for ' + req.params.packagename);
	var link = 'https://www.npmjs.com/package/' + req.params.packagename;
	request(link, function(err, response) {
			res.json({
				success: !err,
				exists: (response.statusCode < 400),
				link: link,
				name: req.params.packagename
			});
	})
});

router.route('/word').get(function(req, res) {
	var word = words[Math.floor(Math.random() * words.length)];
	res.json({
			success: word.length > 0,
			word: word
	});
});

app.use('/api', router);
app.listen(app.get('port'), function() {
	updateWords();
	setInterval(updateWords, 600000);
	console.log('Listening on ' + app.get('port'));
});

/* Requires */
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var fs = require('fs');
var pg = require('pg');
var npm = require('npm');

/* Initialization */
var app = express();
var router = express.Router();

// Initialize express.js app.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* Statics */
app.set('port', process.env.PORT || 8080);
var initRun = false;

/* Global Vars */
var words;

/* Begin application definition */

// Middleware to set up the response the way we want.

router.use(function(req, res, next) {
	res.set('Content-Type', 'application/json');
	next();
});

// Serve the static directory for client files.
app.use('/', express.static('static'));

// Keep a list in memory so we don't have to constantly read the file.
function updateWords(callback) {
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

// Test whether the package exists on NPM.
// Returns success, exists (which is the thing that really matters), link, which leads back to the npm page, 
// and name, which was the name of the package which we searched for.
router.route('/exists/:packagename').get(function(req, res) {
	console.log('[router] Searching for ' + req.params.packagename);
	// Generate a link for the user to find the package on npmjs.
	var link = 'https://www.npmjs.com/package/' + req.params.packagename;
	var args = ['description', 'version'];
	// Put the user input onto the beginning of the array.
	args.unshift(req.params.packagename);
	npm.commands.view(args, true, function(err, map, array) {
		var exists = !(typeof map === 'undefined');
		var actualError = false;
		// "err" is true if the API returns a 404.
		// We want "err" to be set if we have a "real error", as where a 404 is an expected condition.
		if (err && err.code !== 'E404') {
			console.log('[request] Actual error detected from API for ' + req.params.packagename + '. Error: ' + err);
			actualError = true;
		}
		res.json({
			success: !actualError,
			exists: exists,
			link: link,
			name: req.params.packagename
		});
	});
});

// Get a random word from the client-side.
// Returns JSON with success and word, which is a single noun.
router.route('/word').get(function(req, res) {
	var word = words[Math.floor(Math.random() * words.length)];
	res.json({
		success: word.length > 0,
		word: word
	});
});

app.use('/api', router);
// Begin our application once our dependencies are up.
function init(callback) {
	npm.load({}, function() {
		pg.connect(process.env.DATABASE_URL, function(err, client, done) {
			if (!err) {
				client.query('CREATE TABLE IF NOT EXISTS stats(exists BOOLEAN, count INT)');
			} else {
				console.error('[db] Error connecting to the PGSQL DB: ' + err);
			}
			done();

			updateWords(function() {
				app.listen(app.get('port'), function() {
					setInterval(updateWords, 600000);
					console.log('[server] Listening on ' + app.get('port'));
					module.exports.getApp = app; // Allow testing
					if (typeof callback === 'function') {
						callback();
					}
				});
			});
		});
	});
}
module.exports.init = init;

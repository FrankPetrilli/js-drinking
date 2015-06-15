var express = require('express');
var app = express();
var router = module.exports = express.Router();
var pg = require('pg');
var npm = require('npm');

// Middleware to set up the response the way we want.
router.use(function(req, res, next) {
	res.set('Content-Type', 'application/json');
	next();
});

// Test whether the package exists on NPM.
// Returns success, exists (which is the thing that really matters), link, which leads back to the npm page, 
// and name, which was the name of the package which we searched for.
router.route('/exists/:packagename').get(function(req, res) {
	//console.log('[router] Searching for ' + req.params.packagename);
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

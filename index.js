/* Requires */
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var fs = require('fs');
var pg = require('pg');
var npm = require('npm');

/* Grab dependencies */
var common = require('./app/common.js');
var router = require('./app/router.js');

/* Initialization */
var app = express();
//var router = express.Router();

// Initialize express.js app.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* Statics */
app.set('port', process.env.PORT || 8080);

/* Global Vars */
var words;

/* Begin application definition */

// Serve the static directory for client files.
app.use('/', express.static('static'));

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

			common.updateWords(function() {
				app.listen(app.get('port'), function() {
					setInterval(common.updateWords, 600000);
					console.log('[server] Listening on ' + app.get('port'));
					module.exports.getApp = app; // Allow testing
					if (typeof callback === 'function') {
						callback(app);
					}
				});
			});
		});
	});
}
module.exports.init = init;

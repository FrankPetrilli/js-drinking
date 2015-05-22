var request = require('supertest');
var express = require('express');
var sleep = require('sleep');

var index;
var app;


describe('Javascript drinking game', function() {
	before(function(done) {
		index = require('./index.js');
		index.init(function(returnedApp) {
			//app = index.getApp;
			app = returnedApp;
			done();
		});
	});

	it('Responds with JSON to an /api/word request', function(done) {
		request(app)
		.get('/api/word')
		.set('Accept', 'application/json')
		.expect('Content-Type', /json/)
		.expect(200, done);
	});
	it('Responds with success to an /api/word request', function(done) {
		request(app)
		.get('/api/word')
		.set('Accept', 'application/json')
		.expect(function(res) {
			return (res.body.success === true);
		})
		.expect(200, done);
	});
	it('Responds with a >0 length word to an /api/word request', function(done) {
		request(app)
		.get('/api/word')
		.set('Accept', 'application/json')
		.expect(function(res) {
			return (res.body.word.length > 0);
		})
		.expect(200, done);
	});
	// Exists API
	var realPackage = 
	it('Responds with JSON for an /api/exists/:packagename request', function(done) {
		request(app)
		.get('/api/exists/npm')
		.set('Accept', 'application/json')
		.expect('Content-Type', /json/)
		.expect(200, done);
	});
	it('Responds with success for a real package', function(done) {
		request(app)
		.get('/api/exists/npm')
		.set('Accept', 'application/json')
		.expect(function(res) {
			return (res.body.success === true);
		})
		.expect(200, done);
	});
	it('Responds with exists for a real package', function(done) {
		request(app)
		.get('/api/exists/npm')
		.set('Accept', 'application/json')
		.expect(function(res) {
			return (res.body.exists === true);
		})
		.expect(200, done);
	});

	// Generate a fake package name
	var fakeName;
	var alphabet = "abcdefghijklmnopqrstuvwxyz";
	for (var i = 0; i < 40; i++) {
		fakeName += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
	}

	it('Responds with success for a fake package', function(done) {
		request(app)
		.get('/api/exists/' + fakeName)
		.set('Accept', 'application/json')
		.expect(function(res) {
			return (res.body.success === true);
		})
		.expect(200, done);
	});
	it('Responds with !exists for a fake package', function(done) {
		request(app)
		.get('/api/exists/' + fakeName)
		.set('Accept', 'application/json')
		.expect(function(res) {
			return (res.body.exists === false);
		})
		.expect(200, done);
	});
});

/*describe('GET /api/exists/:packagename', function() {
	var req = request(app);
	it('Responds with JSON', function(done) {
		req
		.get('/api/word')
		.set('Accept', 'application/json')
		.expect('Content-Type', /json/)
		.expect(200, done);
	});
	var realPackage = req.get('/api/word/npm');
	it('Responds with success for a real package', function(done) {
		realPackage
		.set('Accept', 'application/json')
		.expect(function(res) {
			return (res.body.success === true);
		})
		.expect(200, done);
	});
	it('Responds with exists for a real package', function(done) {
		realPackage
		.set('Accept', 'application/json')
		.expect(function(res) {
			return (res.body.exists === true);
		})
		.expect(200, done);
	});
	// Generate a fake package name
	var fakeName;
	var alphabet = "abcdefghijklmnopqrstuvwxyz";
	for (var i = 0; i < 40; i++) {
		fakeName += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
	}
	var realPackage = req.get('/api/word/' + fakeName);
	it('Responds with success for a fake package', function(done) {
		fakeName
		.set('Accept', 'application/json')
		.expect(function(res) {
			return (res.body.success === true);
		})
		.expect(200, done);
	});
	it('Responds with !exists for a fake package', function(done) {
		fakeName
		.set('Accept', 'application/json')
		.expect(function(res) {
			return (res.body.exists === false);
		})
		.expect(200, done);
	});
});
*/


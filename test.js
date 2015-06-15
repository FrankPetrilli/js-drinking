/* Only the first is succeeding... */
var request = require('supertest');
var express = require('express');
var sleep = require('sleep');

var index;
var app;


describe('Javascript drinking game', function() {

	var realPackage;
	var fakePackage;
	var agent;
	var should;
	//this.timeout(10000); // Set 10 second timeout
	before(function(done) {
		var fakeName = '';
		var alphabet = "abcdefghijklmnopqrstuvwxyz";
		for (var i = 0; i < 40; i++) {
			fakeName += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
		}
		index = require('./index.js');
		index.init(function(returnedApp) {
			//app = index.getApp;
			app = returnedApp;
			realPackage = '/api/exists/' + 'npm';
			fakePackage = '/api/exists/' + fakeName;
			//realPackage = request(app).get('/api/exists/npm').set('Accept', 'application/json');
			//fakePackage = request(app).get('/api/exists/' + fakeName).set('Accept', 'application/json');
			agent = request.agent(app);
			console.log('init complete.');
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
	

	it('Responds with JSON for an /api/exists/:packagename request', function(done) {
		//realPackage
		agent.get(realPackage)
		.expect('Content-Type', /json/)
		.expect(200, done);
	});

	it('Responds with success for a real package', function(done) {
		//realPackage
		agent.get(realPackage)
		.expect(function(res) {
			return (res.body.success === true);
		})
		.expect(200, done);
	});

	it('Responds with exists for a real package', function(done) {
		//realPackage
		agent.get(realPackage)
		.expect(function(res) {
			return (res.body.exists === true);
		})
		.expect(200, done);
	});


	it('Responds with success for a fake package', function(done) {
		//fakePackage
		agent.get(fakePackage)
		.expect(function(res) {
			return (res.body.success === true);
		})
		.expect(200, done);
	});

	it('Responds with !exists for a fake package', function(done) {
		//fakePackage
		agent.get(fakePackage)
		.expect(function(res) {
			return (res.body.exists === false);
		})
		.expect(200, done);
	});
});

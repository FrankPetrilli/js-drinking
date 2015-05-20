var request = require('supertest');
var express = require('express');
var sleep = require('sleep');

var index;
var app;

before(function(done) {
	index = require('./index.js');
	index.init(function() {
		app = index.getApp;
		done();
	});
});

describe('GET /word', function() {
	it('Responds with JSON', function(done) {
		request(app)
		.get('/api/word')
		.set('Accept', 'application/json')
		.expect('Content-Type', /json/)
		.expect(200, done);
	});
});

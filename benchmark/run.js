var bench = require('benchmark');
var compiled = bench.Suite();

var Factory = require('../').Factory;
var raw = new Factory({
	root: '../demo/raw'
});
var comp = new Factory({
	root: '../demo/compiled'
});
compiled
	.add('raw', function() {
		var s = raw.run({
			content: 'TEXT',
			header: 'this is the header',
			greetings: 'Santa'
		}, 'Container2.nhtml');
	})
	.add('compiled', function() {
		var s = comp.run({
			content: 'TEXT',
			header: 'this is the header',
			greetings: 'Santa'
		}, 'Container2.nhtml');

	})
	.on('cycle', function(event) {
		console.log(String(event.target));
	})
	.on('complete', function() {
		console.log('done');
		console.log('Fastest is ' + this.filter('fastest').pluck('name'));
	})
	.run();
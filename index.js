var map = require('map-stream')
	, handlebars  = require('handlebars')
	, es = require('event-stream')
	, clone = require('clone')
	, rename = require('gulp-rename');

module.exports = function(options){
	var opts = options ? options : {};

	function loadPartials(file, cb){
		console.log(file.path);
	}

	function compile(file, cb){
		var path = file.path;
		var compiledTemplate = "asd";
		if(path.match('partials') !== null){
			basename = path.split('\\').pop().split('.').shift();
			handlebars.registerPartial(basename, file.contents.toString());
			return cb();
		}
		else{
			compiledTemplate = handlebars.compile(file.contents.toString())();
		}

		var newFile = clone(file);
		newFile.contents = new Buffer(compiledTemplate);

		return cb(null, newFile);
	}

	var doRename = function(dir, base, ext) {
		// Change the extension to .js
		dir.extname = ".html";
		return dir;
	};

	return es.pipeline(
		map(compile),
		rename(doRename)
	);
};
var map = require('map-stream')
	, handlebars  = require('handlebars')
	, es = require('event-stream')
	, clone = require('clone')
	, rename = require('gulp-rename');

module.exports = function(options){
	var opts = options ? options : {};

	function compile(file, cb){
		var path = file.path;
		var compiledTemplate;
		if(path.match('partials') !== null){
			basename = path.split('\\|\/').pop().split('.').shift();
			handlebars.registerPartial(basename, file.contents.toString());
			return cb();
		}

		setTimeout(function(){
			compiledTemplate = handlebars.compile(file.contents.toString())();
	
			var newFile = clone(file);
			newFile.contents = new Buffer(compiledTemplate);
	
			return cb(null, newFile);
		}, 1000);
	}

	var doRename = function(dir, base, ext){
		// Change the extension to .js
		dir.extname = ".html";
		return dir;
	};

	return es.pipeline(
		map(compile),
		rename(doRename)
	);
};
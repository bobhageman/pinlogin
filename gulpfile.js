/*jshint node: true, strict: false */

var fs = require('fs');
var gulp = require('gulp');

var rename = require('gulp-rename');
var replace = require('gulp-replace');
var jshint = require('gulp-jshint');
var rjsOptimize = require('gulp-requirejs-optimize');

var uglify = require('gulp-uglify');

// code hinting
gulp.task( 'hint-js', function() {
  return gulp.src('src/pinlogin.js')
    .pipe( jshint() )
    .pipe( jshint.reporter('default') );
});

gulp.task( 'hint-gulp', function() {
  return gulp.src('gulpfile.js')
    .pipe( jshint() )
    .pipe( jshint.reporter('default') );
});

// copy css
gulp.task('css', function() {
  return gulp.src('./src/pinlogin.css')
	.pipe(gulp.dest('./dist/'));
});


// optimize the js file
gulp.task('optimize-js', function() {
	
  return gulp.src('src/pinlogin.js')
    .pipe( rjsOptimize({
		baseUrl: 'node_modules',
		optimize: 'none',
		include: [
			'../src/pinlogin'
		],
		paths: {
			pinlogin: '../',
		}
	}))
    .pipe( rename('pinlogin.pkgd.js') )
    .pipe( gulp.dest('dist') );
});

// uglify the js file
gulp.task('compress-js', gulp.series('optimize-js', function() {
	
	var banner = getBanner();
	
	return gulp.src('dist/pinlogin.pkgd.js')
		.pipe( uglify() )
		.pipe( addBanner( banner ) )
		.pipe( rename('pinlogin.pkgd.min.js') )
		.pipe( gulp.dest('dist') );
}));

gulp.task('hint', gulp.series(['hint-js','hint-gulp']));

gulp.task('build', gulp.series(['css','compress-js']));

gulp.task('default', gulp.series(['hint','build']));

// regex for banner comment
var reBannerComment = new RegExp('^\\s*(?:\\/\\*[\\s\\S]*?\\*\\/)\\s*');

function getBanner() {
  var src = fs.readFileSync( 'src/pinlogin.js', 'utf8' );
  var matches = src.match( reBannerComment );
  //var banner = matches[0].replace( 'x', 'y' );
  return matches[0];
}

function addBanner( str ) {
  return replace( /^/, str );
}
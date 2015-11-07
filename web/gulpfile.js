/**
 *  Dependencies.
 */
var _ = require('lodash');
var path = require('path');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var header = require('gulp-header');
var less = require('gulp-less')
var minifyCSS = require('gulp-minify-css');
var inject = require('gulp-inject');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var del = require('del');

/**
 *  Includes.
 */
var config = require('./config/config.js');

/**
 *  Files which should be used in the lint phase.
 */
var lintFiles = [
  'public/config.js',
  'public/application.js',
  'public/modules/**/*.js'
];

/**
 *  JavaScript files which should be concatenated for the combined and minified JavaScript file.
 */
var jsFiles = _.union(
  config.getJavaScriptAssets(),
  lintFiles
);

/**
 *  Less files which should be compiled to CSS.
 */
var lessFiles = [
    'public/modules/**/*.less'
];

/**
 *  CSS files which should be concatenated for the combined and minified CSS file.
 */
var cssFiles = _.union(
  config.getCSSAssets(),
  ['tmp/css/**/*.css']
);

/**
 *  HTML files.
 */
var htmlFiles = [
  './public/**/*.html'
]

/**
 *  Text files.
 */
var txtFiles = [
  './public/humans.txt',
  './public/robots.txt'
];

/**
 *  Gulp tasks.
 */

// Default task will start the live reload functionality.
gulp.task('default', ['watch'], function(cb) {});

// Test Build for development. Don't concatenate JavaScript files.
gulp.task('development', ['lint', 'minifyJS', 'compileLess', 'minifyCSS', 'injectDevelopment', 'finalizeDistDevelopment']);

// Test Build for production.
gulp.task('production', ['lint', 'minifyJS', 'compileLess', 'minifyCSS', 'injectProduction', 'finalizeDistProduction']);

// Pack Build for Delivery.
gulp.task('release', ['production'], function(cb) {
  console.log("*** Finishing Release ***")
  var releaseFiles = _.union(
    ['./public/dist/combined.min.js', './public/dist/combined.min.css'],
    htmlFiles,
    txtFiles
  );

  return gulp.src(releaseFiles, { base: './public' })
    .pipe(gulp.dest('../asdfasdfsdaf'));
});

// Live Reload functionality.
gulp.task('watch', ['lint', 'minifyJSWatch', 'compileLess', 'minifyCSS', 'injectWatch', 'finalizeDistWatch'], function() {

  // Create sync with the browser.
  browserSync({
    server: {
      baseDir: './public/'
    }
  });

  // .js files.
  //gulp.watch(lintFiles, ['lint']);
  gulp.watch(lintFiles, reload);

  // .less files.
  gulp.watch(lessFiles, ['compileLess']);

  // .css files.
  gulp.watch(cssFiles, ['minifyCSS']);

  // .html files.
  gulp.watch(htmlFiles, reload);

  // .txt files.
  gulp.watch(txtFiles, reload);

  // Combined files.
  gulp.watch('./public/dist/**.*', reload);
});

/**
 *  Check for JavaScript errors.
 */
gulp.task('lint', function(cb) {
  return gulp.src(lintFiles)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

/**
 *  Combine and minify Javascript - For the Live Reload mode.
 */
gulp.task('minifyJSWatch', function(cb) {
  var headerValue = '/* Minified JS.\n* Contact: robert.weindl@sinus.io\n**/\n';
  return gulp.src(config.getJavaScriptAssets())
    .pipe(concat('combined.js'))
    .pipe(header(headerValue))
    .pipe(gulp.dest('./public/dist'));
});

/**
 *  Combine and minify JavaScript - For Development and Production.
 */
gulp.task('minifyJS', ['lint'], function(cb) {
  var headerValue = '/* Minified JS.\n* Contact: robert.weindl@sinus.io\n**/\n';
  return gulp.src(jsFiles)
    .pipe(concat('combined.js'))
    .pipe(gulp.dest('./public/dist'))
    .pipe(rename('combined.min.js'))
    .pipe(uglify())
    .pipe(header(headerValue))
    .pipe(gulp.dest('./public/dist'));
});

/**
 *  Compile Less to CSS.
 */
gulp.task('compileLess', function(cb) {
  return gulp.src(lessFiles)
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./tmp/css'));
});

/**
 *  Combine and minify the CSS file.
 */
gulp.task('minifyCSS', ['compileLess'], function(cb) {
  var headerValue = '/* Minified CSS.\n* Contact: robert.weindl@sinus.io\n**/\n';
  return gulp.src(cssFiles)
    .pipe(concat('combined.css'))
    .pipe(gulp.dest('./public/dist'))
    .pipe(rename('combined.min.css'))
    .pipe(minifyCSS())
    .pipe(header(headerValue))
    .pipe(gulp.dest('./public/dist'));
});

/**
 *  Inject the CSS and JavaScript files - Used for the live reload functionality.
 */
gulp.task('injectWatch', ['minifyJSWatch', 'minifyCSS'], function(cb) {
  var target = gulp.src('./public/index.html');
  var injectFiles = _.union(
    ['./public/dist/combined.js', './public/dist/combined.css'],
    lintFiles
  );
  var sources = gulp.src(injectFiles, {read: false});
  return target.pipe(inject(sources, {relative: true}))
    .pipe(gulp.dest('./public'));
});

/**
 *  Inject the CSS and JavaScript files - Used for development.
 */
gulp.task('injectDevelopment', ['minifyJS', 'minifyCSS'], function(cb) {
  var target = gulp.src('./public/index.html');
  var sources = gulp.src(['./public/dist/combined.js', './public/dist/combined.css'], {read: false});
  return target.pipe(inject(sources, {relative: true}))
    .pipe(gulp.dest('./public'));
});

/**
 *  Inject the minified CSS and JavaScript files - Used for production.
 */
gulp.task('injectProduction', ['minifyJS', 'minifyCSS'], function(cb) {
  var target = gulp.src('./public/index.html');
  var sources = gulp.src(['./public/dist/combined.min.js', './public/dist/combined.min.css'], {read: false});
  return target.pipe(inject(sources, {relative: true}))
    .pipe(gulp.dest('./public'));
});

/**
 *  Removes all files which are needed for the development build from the public/dist folder.
 */
gulp.task('finalizeDistWatch', ['injectWatch'], function(cb) {
  del([
    'public/dist/combined.min.js',
    'public/dist/combined.min.css'
  ]);
  return cb();
});

/**
 *  Removes all files which are needed for the development build from the public/dist folder.
 */
gulp.task('finalizeDistDevelopment', ['injectDevelopment'], function(cb) {
  del([
    'public/dist/combined.min.js',
    'public/dist/combined.min.css'
  ]);
  return cb();
});

/**
 *  Removes all files which are need for the development build from the public/dist folder.
 */
gulp.task('finalizeDistProduction', ['injectProduction'], function(cb) {
  del([
    'public/dist/combined.js',
    'public/dist/combined.css'
  ]);
  return cb();
});

/**
 *  Moving all important release files to a parent directory with name of form "<timestamp>-secure-coding".
 */
gulp.task('moveReleaseFiles', ['production'], function(cb) {

});

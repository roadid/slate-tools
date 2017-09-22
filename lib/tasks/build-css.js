'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var sassGlob = require('gulp-sass-glob');
var filter = require('gulp-filter');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var postcssFlexbugs = require('postcss-flexbugs-fixes');
var autoprefixer = require('autoprefixer');
var chokidar = require('chokidar');
var mainBowerFiles = require('main-bower-files');
var concat = require('gulp-concat');
var rename = require('gulp-rename');

var config = require('./includes/config.js');
var utils = require('./includes/utilities.js');
var messages = require('./includes/messages.js');

/**
 * Concatenate css via gulp-cssimport and copys to the `/dist` folder
 *
 * @param {Array} files
 * @returns {Stream}
 * @private
 */
function processCss() {
  messages.logProcessFiles('build:css');
  var scssFilter = filter('**/*.scss', { restore: true });
  var themeFilter = filter('**/theme.css', { restore: true });
  return gulp.src(config.roots.css).pipe(plumber(utils.errorHandler)).pipe(scssFilter).pipe(sourcemaps.init()).pipe(sassGlob()).pipe(sass({ outputStyle: 'compressed' })).pipe(postcss([postcssFlexbugs, autoprefixer()])
  // Put a copy of theme in snippets
  ).pipe(themeFilter).pipe(rename(function (path) {
    path.extname = '.liquid';
  })).pipe(gulp.dest(config.dist.snippets)).pipe(rename(function (path) {
    path.extname = '.css';
  })).pipe(themeFilter.restore
  // Write out to assets
  ).pipe(sourcemaps.write('.')).pipe(scssFilter.restore).pipe(gulp.dest(config.dist.assets));
}

function processVendorCss() {
  messages.logProcessFiles('build:vendor-css');
  var cssFilter = filter('**/*.css', { restore: true });
  return gulp.src(mainBowerFiles()).pipe(cssFilter).pipe(sourcemaps.init()).pipe(plumber(utils.errorHandler)).pipe(concat('vendor.css')).pipe(sourcemaps.write('.')).pipe(gulp.dest(config.dist.assets));
}

/**
 * Concatenate css via gulp-cssimport
 *
 * @function build:css
 * @memberof slate-cli.tasks.build
 * @static
 */
gulp.task('build:css', function () {
  return processCss();
});

/**
 * Watches css in the `/src` directory
 *
 * @function watch:css
 * @memberof slate-cli.tasks.watch
 * @static
 */
gulp.task('watch:css', function () {
  chokidar.watch(config.src.css, { ignoreInitial: true }).on('all', function (event, path) {
    messages.logFileEvent(event, path);
    processCss();
  });
});

gulp.task('build:vendor-css', function () {
  processVendorCss();
});
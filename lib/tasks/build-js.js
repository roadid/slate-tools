'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var include = require('gulp-include');
var plumber = require('gulp-plumber');
var chokidar = require('chokidar');
var mainBowerFiles = require('main-bower-files');
var filter = require('gulp-filter');
var flatten = require('gulp-flatten');
var concat = require('gulp-concat');
var merge2 = require('merge2');
var sourcemaps = require('gulp-sourcemaps');
var ngAnnotate = require('gulp-ng-annotate');

var config = require('./includes/config.js');
var messages = require('./includes/messages.js');
var utils = require('./includes/utilities.js');

function processThemeJs() {
  messages.logProcessFiles('build:js');
  var gulpSettings = gulp.src([config.roots.js, '!' + config.roots.vendorJs]).pipe(sourcemaps.init()).pipe(plumber(utils.errorHandler)).pipe(include()).pipe(ngAnnotate());

  // only minify and compress if product flag is set.
  if (process.env.NODE_ENV === 'production') {
    gulpSettings = gulpSettings.pipe(uglify({
      mangle: true,
      compress: true,
      preserveComments: 'license'
    })).pipe(sourcemaps.write('.'));
  }
  return gulpSettings.pipe(gulp.dest(config.dist.assets));
}

function processVendorJs() {
  messages.logProcessFiles('build:vendor-js');
  var jsFilter = filter('**/*.js', { restore: true });
  return merge2(gulp.src(mainBowerFiles()).pipe(jsFilter), gulp.src(config.roots.vendorJs)).pipe(sourcemaps.init()).pipe(plumber(utils.errorHandler)).pipe(include()).pipe(uglify({
    mangle: true,
    compress: true,
    preserveComments: 'license'
  })).pipe(flatten()).pipe(concat('vendor.js')).pipe(sourcemaps.write('.')).pipe(gulp.dest(config.dist.assets));
}

gulp.task('build:js', function () {
  processThemeJs();
});

gulp.task('watch:js', function () {
  chokidar.watch([config.src.js, '!' + config.roots.vendorJs, '!' + config.src.vendorJs], { ignoreInitial: true }).on('all', function (event, path) {
    messages.logFileEvent(event, path);
    processThemeJs();
  });
});

gulp.task('build:vendor-js', function () {
  processVendorJs();
});

gulp.task('watch:vendor-js', function () {
  chokidar.watch([config.roots.vendorJs, config.src.vendorJs], { ignoreInitial: true }).on('all', function (event, path) {
    messages.logFileEvent(event, path);
    processVendorJs();
  });
});
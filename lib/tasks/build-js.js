'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var include = require('gulp-include');
var plumber = require('gulp-plumber');
var chokidar = require('chokidar');
var print = require('gulp-print');
var mainBowerFiles = require('main-bower-files');
var filter = require('gulp-filter');
var flatten = require('gulp-flatten');
var concat = require('gulp-concat');
var merge2 = require('merge2');

var config = require('./includes/config.js');
var messages = require('./includes/messages.js');
var utils = require('./includes/utilities.js');

function processThemeJs() {
  messages.logProcessFiles('build:js');
  return gulp.src([config.roots.js, '!' + config.roots.vendorJs]).pipe(plumber(utils.errorHandler)).pipe(include()).pipe(gulp.dest(config.dist.assets));
}

function processVendorJs() {
  messages.logProcessFiles('build:vendor-js');
  var jsFilter = filter('**/*.js', { restore: true });
  return merge2(gulp.src(config.roots.vendorJs), gulp.src(mainBowerFiles()).pipe(jsFilter)).pipe(plumber(utils.errorHandler)).pipe(include()).pipe(print()).pipe(uglify({
    mangle: true,
    compress: true,
    preserveComments: 'license'
  })).pipe(flatten()).pipe(concat('vendor.js')).pipe(gulp.dest(config.dist.assets));
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
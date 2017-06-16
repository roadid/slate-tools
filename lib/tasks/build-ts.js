'use strict';

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var chokidar = require('chokidar');
var ts = require('gulp-typescript');
var tslint = require('gulp-tslint');
var babel = require('gulp-babel');

var config = require('./includes/config.js');
var messages = require('./includes/messages.js');
var utils = require('./includes/utilities.js');

function processThemeTs() {
  messages.logProcessFiles('build:ts');
  // pull in the project TypeScript config
  var tsProject = ts.createProject('tsconfig.json');

  return gulp.src([config.roots.ts]).pipe(plumber(utils.errorHandler)).pipe(tslint({ formatter: 'verbose' })).pipe(tslint.report()).pipe(ts(tsProject)).pipe(babel()).pipe(gulp.dest(config.dist.assets));
}

gulp.task('build:ts', function () {
  processThemeTs();
});

gulp.task('watch:ts', function () {
  chokidar.watch([config.src.ts], { ignoreInitial: true }).on('all', function (event, path) {
    messages.logFileEvent(event, path);
    processThemeTs();
  });
});
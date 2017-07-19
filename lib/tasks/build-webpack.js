'use strict';

var gulp = require('gulp');

var chokidar = require('chokidar');
// const size = require('gulp-size');
var webpack = require('webpack-stream');
var plumber = require('gulp-plumber');
var utils = require('./includes/utilities.js');

var config = require('./includes/config.js');
var messages = require('./includes/messages.js');

function processWebpackJs(continueOnError) {
  messages.logProcessFiles('build:webpack');
  var configFile = config.themeRoot + '/webpack.config.js';
  var gulpPipe = gulp.src(config.src.webpack);

  if (continueOnError) {
    gulpPipe = gulpPipe.pipe(plumber(utils.errorHandlerButContinue));
  } else {
    gulpPipe = gulpPipe.pipe(plumber(utils.errorHandler));
  }
  // gulpPipe.pipe(size({    showFiles: true,    pretty: true,  }))
  return gulpPipe.pipe(webpack(require(configFile))).pipe(gulp.dest('dist/assets'));
}
gulp.task('build:webpack', function () {
  processWebpackJs(false);
});

gulp.task('watch:webpack', function () {
  chokidar.watch([config.src.webpack], { ignoreInitial: true }).on('all', function (event, path) {
    messages.logFileEvent(event, path);
    processWebpackJs(true);
  });
});
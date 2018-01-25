'use strict';

var gulp = require('gulp');

// const chokidar = require('chokidar');
// const size = require('gulp-size');
var webpackStream = require('webpack-stream');
var webpack = require('webpack');
var plumber = require('gulp-plumber');
var utils = require('./includes/utilities.js');

var config = require('./includes/config.js');
var messages = require('./includes/messages.js');

var webpackConfigPath = config.themeRoot + '/webpack.config.js';
var webpackConfig = require(webpackConfigPath);

var entryFiles = [];

if (webpackConfig.entry) {
  for (var propertyName in webpackConfig.entry) {
    if (Object.prototype.hasOwnProperty.call(webpackConfig.entry, propertyName)) {
      var entries = webpackConfig.entry[propertyName];
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].indexOf('babel-polyfill') < 0) {
          entryFiles.push(entries[i]);
        }
      }
    }
  }
}

function processWebpackJs(continueOnError, watch) {

  messages.logProcessFiles(watch ? 'watch:webpack' : 'build:webpack');

  var gulpPipe = gulp.src(config.src.webpackOutputFiles);

  if (continueOnError) {
    gulpPipe = gulpPipe.pipe(plumber(utils.errorHandlerButContinue));
  } else {
    gulpPipe = gulpPipe.pipe(plumber(utils.errorHandler));
  }
  // gulpPipe.pipe(size({    showFiles: true,    pretty: true,  }))

  webpackConfig.watch = watch;

  gulpPipe.pipe(webpackStream(webpackConfig, webpack)).pipe(gulp.dest('dist/assets'));
}

gulp.task('build:webpack', function () {
  processWebpackJs(false, false);
});

gulp.task('watch:webpack', function () {
  processWebpackJs(false, true);
});
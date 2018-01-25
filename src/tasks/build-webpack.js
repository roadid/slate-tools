const gulp = require('gulp');

// const chokidar = require('chokidar');
// const size = require('gulp-size');
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const plumber = require('gulp-plumber');
const utils = require('./includes/utilities.js');

const config = require('./includes/config.js');
const messages = require('./includes/messages.js');

const webpackConfigPath = `${config.themeRoot}/webpack.config.js`;
const webpackConfig = require(webpackConfigPath);

const entryFiles = [];

if (webpackConfig.entry) {
  for (const propertyName in webpackConfig.entry) {
    if (Object.prototype.hasOwnProperty.call(webpackConfig.entry, propertyName)) {
      const entries = webpackConfig.entry[propertyName];
      for (let i = 0; i < entries.length; i++) {
        if (entries[i].indexOf('babel-polyfill') < 0) {
          entryFiles.push(entries[i]);
        }
      }
    }
  }
}

function processWebpackJs(continueOnError, watch) {


  messages.logProcessFiles(watch ? 'watch:webpack' : 'build:webpack');

  let gulpPipe = gulp.src(config.src.webpackOutputFiles);

  if (continueOnError) {
    gulpPipe = gulpPipe.pipe(plumber(utils.errorHandlerButContinue));
  } else {
    gulpPipe = gulpPipe.pipe(plumber(utils.errorHandler));
  }
  // gulpPipe.pipe(size({    showFiles: true,    pretty: true,  }))

  webpackConfig.watch = watch;

  gulpPipe.pipe(webpackStream(webpackConfig, webpack))
    .pipe(gulp.dest('dist/assets'));
}

gulp.task('build:webpack', () => {
  processWebpackJs(false, false);
});


gulp.task('watch:webpack', () => {
  processWebpackJs(false, true);
});


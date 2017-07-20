const gulp = require('gulp');

const chokidar = require('chokidar');
// const size = require('gulp-size');
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const plumber = require('gulp-plumber');
const utils = require('./includes/utilities.js');

const config = require('./includes/config.js');
const messages = require('./includes/messages.js');


function processWebpackJs(continueOnError) {
  messages.logProcessFiles('build:webpack');
  const webpackConfig = `${config.themeRoot}/webpack.config.js`;
  let gulpPipe = gulp.src(config.src.webpack);

  if (continueOnError) {
    gulpPipe = gulpPipe.pipe(plumber(utils.errorHandlerButContinue));
  } else {
    gulpPipe = gulpPipe.pipe(plumber(utils.errorHandler));
  }
  // gulpPipe.pipe(size({    showFiles: true,    pretty: true,  }))
  return gulpPipe.pipe(webpackStream(require(webpackConfig), webpack))
    .pipe(gulp.dest('dist/assets'));
}
gulp.task('build:webpack', () => {
  processWebpackJs(false);
});


gulp.task('watch:webpack', () => {


  chokidar.watch([config.src.webpack], {ignoreInitial: true})
    .on('all', (event, path) => {
      messages.logFileEvent(event, path);
      processWebpackJs(true);
    });

  // processWebpackJs(true);
});


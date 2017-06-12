const gulp = require('gulp');
const cssimport = require('gulp-cssimport');
const sass = require('gulp-sass');
const filter = require('gulp-filter');
const print = require('gulp-print');
const extReplace = require('gulp-ext-replace');
const plumber = require('gulp-plumber');

const chokidar = require('chokidar');

const config = require('./includes/config.js');
const utils = require('./includes/utilities.js');
const messages = require('./includes/messages.js');

/**
 * Concatenate css via gulp-cssimport and copys to the `/dist` folder
 *
 * @param {Array} files
 * @returns {Stream}
 * @private
 */
function processCss() {
  messages.logProcessFiles('build:css');
  const scssFilter = filter('**/*.scss', {restore: true});
  return gulp.src(config.roots.css)
    .print(print())
    .pipe(plumber(utils.errorHandler))
    .pipe(scssFilter)
    .pipe(sass().on('error', sass.logError))
    .pipe(scssFilter.restore)
    .pipe(cssimport())
    .pipe(gulp.dest(config.dist.assets));
}

/**
 * Concatenate css via gulp-cssimport
 *
 * @function build:css
 * @memberof slate-cli.tasks.build
 * @static
 */
gulp.task('build:css', () => {
  return processCss();
});

/**
 * Watches css in the `/src` directory
 *
 * @function watch:css
 * @memberof slate-cli.tasks.watch
 * @static
 */
gulp.task('watch:css', () => {
  chokidar.watch(config.src.css, {ignoreInitial: true})
    .on('all', (event, path) => {
      messages.logFileEvent(event, path);
      processCss();
    });
});

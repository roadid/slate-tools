const gulp = require('gulp');
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const filter = require('gulp-filter');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const postcssFlexbugs = require('postcss-flexbugs-fixes');
const chokidar = require('chokidar');
const mainBowerFiles = require('main-bower-files');
const concat = require('gulp-concat');

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
    .pipe(plumber(utils.errorHandler))
    .pipe(scssFilter)
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(postcss([postcssFlexbugs]))
    .pipe(sourcemaps.write('.'))
    .pipe(scssFilter.restore)
    .pipe(gulp.dest(config.dist.assets));
}

function processVendorCss() {
  messages.logProcessFiles('build:vendor-css');
  const cssFilter = filter('**/*.css', {restore: true});
  return gulp.src(mainBowerFiles())
    .pipe(cssFilter)
    .pipe(sourcemaps.init())
    .pipe(plumber(utils.errorHandler))
    .pipe(concat('vendor.css'))
    .pipe(sourcemaps.write('.'))
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

gulp.task('build:vendor-css', () => {
  processVendorCss();
});

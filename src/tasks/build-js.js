const gulp = require('gulp');
const uglify = require('gulp-uglify');
const include = require('gulp-include');
const plumber = require('gulp-plumber');
const chokidar = require('chokidar');
const print = require('gulp-print');
const mainBowerFiles = require('main-bower-files');
const filter = require('gulp-filter');
const flatten = require('gulp-flatten');

const config = require('./includes/config.js');
const messages = require('./includes/messages.js');
const utils = require('./includes/utilities.js');

function processThemeJs() {
  messages.logProcessFiles('build:js');
  return gulp.src([config.roots.js, `!${config.roots.vendorJs}`])
    .pipe(plumber(utils.errorHandler))
    .pipe(include())
    .pipe(gulp.dest(config.dist.assets));
}

function processVendorJs() {
  messages.logProcessFiles('build:vendor-js');
  return gulp.src(config.roots.vendorJs)
    .pipe(plumber(utils.errorHandler))
    .pipe(include())
    .pipe(print())
    .pipe(uglify({
      mangle: true,
      compress: true,
      preserveComments: 'license',
    }))
    .pipe(gulp.dest(config.dist.assets));
}

function processBowerVendorJs() {
  messages.logProcessFiles('build:bower-vendor-js');
  const jsFilter = filter('**/*.js', {restore: true});
  return gulp.src(mainBowerFiles())
    .pipe(jsFilter)
    .pipe(plumber(utils.errorHandler))
    .pipe(include())
    .pipe(print())
    .pipe(uglify({
      mangle: true,
      compress: true,
      preserveComments: 'license',
    }))
    .pipe(flatten())
    .pipe(gulp.dest(config.dist.assets));
}

gulp.task('build:js', () => {
  processThemeJs();
});

gulp.task('watch:js', () => {
  chokidar.watch([config.src.js, `!${config.roots.vendorJs}`, `!${config.src.vendorJs}`], {ignoreInitial: true})
    .on('all', (event, path) => {
      messages.logFileEvent(event, path);
      processThemeJs();
    });
});

gulp.task('build:vendor-js', () => {
  processVendorJs();
  processBowerVendorJs();
});

gulp.task('watch:vendor-js', () => {
  chokidar.watch([config.roots.vendorJs, config.src.vendorJs], {ignoreInitial: true})
    .on('all', (event, path) => {
      messages.logFileEvent(event, path);
      processVendorJs();
    });
});

const gulp = require('gulp');
const uglify = require('gulp-uglify');
const include = require('gulp-include');
const plumber = require('gulp-plumber');
const chokidar = require('chokidar');
const mainBowerFiles = require('main-bower-files');
const filter = require('gulp-filter');
const flatten = require('gulp-flatten');
const concat = require('gulp-concat');
const merge2 = require('merge2');
const sourcemaps = require('gulp-sourcemaps');
const ngAnnotate = require('gulp-ng-annotate');

const config = require('./includes/config.js');
const messages = require('./includes/messages.js');
const utils = require('./includes/utilities.js');


function processThemeJs() {
  messages.logProcessFiles('build:js');
  let gulpSettings = gulp.src([config.roots.js, `!${config.roots.vendorJs}`])
    .pipe(sourcemaps.init())
    .pipe(plumber(utils.errorHandler))
    .pipe(include())
    .pipe(ngAnnotate());

  // only minify and compress if product flag is set.
  if (process.env.NODE_ENV === 'production') {
    gulpSettings = gulpSettings.pipe(uglify({
      mangle: true,
      compress: true,
      preserveComments: 'license',
    }))
      .pipe(sourcemaps.write('.'));
  }
  return gulpSettings.pipe(gulp.dest(config.dist.assets));
}

function processVendorJs() {
  messages.logProcessFiles('build:vendor-js');
  const jsFilter = filter('**/*.js', {restore: true});
  return merge2(gulp.src(mainBowerFiles())
    .pipe(jsFilter)
    , gulp.src(config.roots.vendorJs))
    .pipe(sourcemaps.init())
    .pipe(plumber(utils.errorHandler))
    .pipe(include())
    .pipe(uglify({
      mangle: true,
      compress: true,
      preserveComments: 'license',
    }))
    .pipe(flatten())
    .pipe(concat('vendor.js'))
    .pipe(sourcemaps.write('.'))
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
});

gulp.task('watch:vendor-js', () => {
  chokidar.watch([config.roots.vendorJs, config.src.vendorJs], {ignoreInitial: true})
    .on('all', (event, path) => {
      messages.logFileEvent(event, path);
      processVendorJs();
    });
});

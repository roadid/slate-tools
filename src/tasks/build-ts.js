const gulp = require('gulp');
const plumber = require('gulp-plumber');
const chokidar = require('chokidar');
const ts = require('gulp-typescript');
const tslint = require('gulp-tslint');


const config = require('./includes/config.js');
const messages = require('./includes/messages.js');
const utils = require('./includes/utilities.js');


function processThemeTs() {
  messages.logProcessFiles('build:ts');
  // pull in the project TypeScript config
  const tsProject = ts.createProject('tsconfig.json');

  var tsResult = gulp.src([config.roots.js])
    .pipe(plumber(utils.errorHandler))
    .pipe(tslint({formatter: 'verbose'}))
    .pipe(tslint.report())
    .pipe(tsProject());

  return tsResult.js.pipe(gulp.dest(config.dist.assets));
}

gulp.task('build:ts', () => {
    processThemeTs();
});

gulp.task('watch:ts', () => {
  chokidar.watch([config.src.ts], {ignoreInitial: true})
    .on('all', (event, path) => {
      messages.logFileEvent(event, path);
        processThemeTs();
    });
});
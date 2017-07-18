const gulp = require('gulp');

const chokidar = require('chokidar');
const size = require('gulp-size');
const webpack = require('webpack-stream');

/*
const plumber = require('gulp-plumber');
const ts = require('gulp-typescript');
const tslint = require('gulp-tslint');
const utils = require('./includes/utilities.js');
*/
const config = require('./includes/config.js');


const messages = require('./includes/messages.js');

/*
function processThemeTs() {
  messages.logProcessFiles('build:ts');
  // pull in the project TypeScript config
  const tsProject = ts.createProject('tsconfig.json');


  const tsResult = gulp.src([config.roots.ts])
    .pipe(plumber(utils.errorHandler))
    .pipe(tslint({formatter: 'verbose'}))
    .pipe(tslint.report())
    .pipe(tsProject());

  return tsResult.js
    .pipe(size({
      showFiles: true,
      pretty: true,
    }))
    .pipe(webpack({
      output: {
        filename: 'webpack_output.js',
      },
    }))
    .pipe(gulp.dest(config.dist.assets));
}
*/


function processTestJs() {
  messages.logProcessFiles('build:ts');
  const configFile = `${config.themeRoot}/webpack.config.js`;
  return gulp.src('src/scripts_webpack/test123.js')
    .pipe(size({
      showFiles: true,
      pretty: true,
    }))
    .pipe(webpack(require(configFile)))
    .pipe(gulp.dest('dist/assets'));
}

gulp.task('build:ts', () => {
  // processThemeTs();
  processTestJs();
});

gulp.task('watch:ts', () => {
  // chokidar.watch([config.src.ts], {ignoreInitial: true})
  chokidar.watch(['src/scripts_webpack/test123.js'], {ignoreInitial: true})
    .on('all', (event, path) => {
      messages.logFileEvent(event, path);
      // processThemeTs();
      processTestJs();
    });
});


/**
* The MIT License (MIT)
* Copyright (c) 2016 Shopify Inc.
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
* MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
* IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
* DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
* OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
* OR OTHER DEALINGS IN THE SOFTWARE.
* 
* Version: 0.4.0 Commit: bb8f1a1
**/'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var debug = require('debug')('slate-tools');
var argv = require('yargs').argv;
var runSequence = require('run-sequence');

var utils = require('./tasks/includes/utilities.js');

if (argv.environment && argv.environment !== 'undefined') {
  debug('setting tkEnvironments to ' + argv.environment);
  gutil.env.environments = argv.environment;
}

// imports gulp tasks from the `tasks` directory
require('require-dir')('./tasks');

gulp.task('build', function (done) {
  runSequence(['clean'], ['build:webpack', 'build:js', 'build:vendor-js', 'build:css', 'build:vendor-css', 'build:assets', 'build:config', 'build:svg'], ['output:errors'], done);
});

gulp.task('build:zip', function (done) {
  runSequence(['clean'], ['build:webpack', 'build:js', 'build:vendor-js', 'build:css', 'build:vendor-css', 'build:assets', 'build:svg'], done);
});

/**
 * Runs translation tests on each file using @shopify/theme-lint
 *
 * @function test
 * @memberof slate-cli.tasks
 * @static
 */
gulp.task('test', function (done) {
  runSequence('lint:locales', done);
});

/**
 * Does a full clean/rebuild of your theme and creates a `.zip` compatible with
 * shopify.
 *
 * @function zip
 * @memberof slate-cli.tasks
 * @static
 */
gulp.task('zip', function (done) {
  runSequence('build:zip', 'compress', 'output:errors', done);
});

/**
 * Simple wrapper around src & dist watchers
 *
 * @summary Monitor your codebase for file changes and take the appropriate
 *   action
 * @function watch
 * @memberof slate-cli.tasks.watch
 * @static
 */
gulp.task('watch', function () {
  runSequence('validate:id', 'build:config', defineWatchTasks());
});

function defineWatchTasks() {
  var tasks = ['watch:src', 'watch:dist', 'watch:dist-config'];

  // unless --nosync flag is set, start browser-sync
  if (!argv.nosync) {
    tasks.push('deploy:sync-reload');
  }

  return tasks;
}

/**
 * Does a full (re)build followed by a full deploy, cleaning existing files on
 * the remote server and replacing them with the full set of files pushed to
 * `dist` in the build
 *
 * @summary Deploy your built files to the Shopify Store set in
 *   `slate-cli.config`
 * @function deploy:manual
 * @memberof slate-cli.tasks.deploy
 * @static
 */
gulp.task('deploy', function (done) {
  runSequence('validate:id', 'build', 'deploy:replace', done);
});

/**
 * Creates a zip of your theme and opens the store from `config.yml` to manually
 * install a theme from the zip
 *
 * @function deploy:themes-store
 * @memberof slate-cli.tasks.deploy
 * @static
 */
gulp.task('deploy:manual', function (done) {
  runSequence('zip', 'open:admin', 'open:zip', done);
});

/**
 * Default function.  Starts watchers & (optionally) syncs browsers for
 * live-reload type development testing {@link slate-cli}
 *
 * @summary gulp | gulp --sync
 * @function default
 * @memberof slate-cli.tasks
 * @static
 */
gulp.task('default', function (done) {
  runSequence('deploy', 'watch', done);
});

/**
 * Handles the error summary at the end if there are errors to output.
 * This task will only be run for the build and zip tasks.
 */
gulp.task('output:errors', function () {
  utils.outputErrors();
});
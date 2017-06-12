'use strict';

var gulp = require('gulp');

var _require = require('@shopify/theme-lint'),
    runAll = _require.runAll;

var config = require('./includes/config.js');
var Reporter = require('./includes/lint-reporter.js').default;

/**
 * Runs all the translation tests and the reporter outputs
 * the locale results once completed.
 *
 * @returns {String} Finalized linting output
 * @private
 */
function lintLocales() {
  return runAll(config.src.root, new Reporter()).then(function (reporter) {
    return reporter.output();
  });
}

/**
 * Runs translation tests using @shopify/theme-lint
 *
 * @function lint:locales
 * @memberof slate-cli.tasks.lint
 * @static
 */
gulp.task('lint:locales', function () {
  return lintLocales();
});
'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var fs = require('fs');
var yaml = require('js-yaml');
var debug = require('debug')('slate-tools:deploy');

var config = require('./includes/config.js');
var messages = require('./includes/messages.js');

/**
 * Starts a [browserSync]{@link https://www.browsersync.io/} session proxying your
 * store URL when a `--sync` flag is passed to the default `gulp` function.
 *
 * @function deploy:sync-init
 * @memberof slate-cli.tasks.deploy
 * @static
 */
gulp.task('deploy:sync-init', function () {
  if (browserSync.active) {
    browserSync.exit();
  } else {
    fs.writeFileSync(config.deployLog, ''); // eslint-disable-line no-sync
  }

  var file = fs.readFileSync(config.tkConfig, 'utf8'); // eslint-disable-line no-sync
  var tkConfig = yaml.safeLoad(file);
  var queryStringComponents = [];
  var environment = config.environment.split(/\s*,\s*|\s+/)[0];

  var envObj = tkConfig[environment];
  var proxyTarget = 'https://' + envObj.store;

  // break theme preview cache by always setting a preview parameter
  var previewParam = envObj.theme_id === 'live' ? '' : envObj.theme_id;
  proxyTarget += '?preview_theme_id=' + previewParam;

  debug(proxyTarget);

  /**
   * Shopify sites with redirection enabled for custom domains force redirection
   * to that domain. `?_fd=0` prevents that forwarding.
   */
  queryStringComponents.push('_fd=0');

  browserSync.init({
    proxy: {
      target: proxyTarget,
      middleware: function middleware(req, res, next) {
        var prefix = req.url.indexOf('?') > -1 ? '&' : '?';
        req.url += prefix + queryStringComponents.join('&');
        next();
      }
    }
  });
});

/**
 * Starts a watcher to reload the [browserSync]{@link https://www.browsersync.io/}
 * session whenever a deploy completes.
 *
 * @function deploy:sync-reload
 * @memberof slate-cli.tasks.watch
 * @static
 */
gulp.task('deploy:sync-reload', ['deploy:sync-init'], function () {
  gulp.watch(config.tkConfig, ['deploy:sync-init']);
  gulp.watch(config.deployLog, function () {
    messages.logTransferDone();
    browserSync.reload();
  });
});
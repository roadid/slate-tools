'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var gutil = require('gulp-util');
var _ = require('lodash');

/** Class representing a custom reporter for @shopify/theme-lint */

var Reporter = function () {
  function Reporter() {
    (0, _classCallCheck3.default)(this, Reporter);

    this.successes = [];
    this.failures = [];
  }

  /**
   * Pushes a valid message onto successes.
   *
   * @param {String} message
   * @param {String} file
   */


  (0, _createClass3.default)(Reporter, [{
    key: 'success',
    value: function success(message) {
      var file = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      this.successes.push([message, file, index]);
    }

    /**
     * Pushes an invalid message onto failures.
     *
     * @param {String} message
     * @param {String} file
     */

  }, {
    key: 'failure',
    value: function failure(message) {
      var file = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      this.failures.push([message, file, index]);
    }

    /**
     * Builds string output for translation tests
     * depending on successes and failures.
     */

  }, {
    key: 'output',
    value: function output() {
      var testsRun = this.failures.length + this.successes.length;

      if (this.failures.length === 0) {
        gutil.log('Translation tests complete:', gutil.colors.green('Success (' + testsRun + ' checks run)'));
      } else {
        gutil.log('Translation tests complete:', gutil.colors.red('Failed (' + testsRun + ' checks run)'));

        var failureGroups = _.groupBy(this.failures, function (failure) {
          return failure[1];
        });

        _.forOwn(failureGroups, function (failures, file) {
          gutil.log(gutil.colors.red(file + ':'));

          failures.map(function (failure) {
            return gutil.log(failure[0]);
          });
        });
      }

      this.successes = this.failures = [];
    }
  }]);
  return Reporter;
}();

exports.default = Reporter;
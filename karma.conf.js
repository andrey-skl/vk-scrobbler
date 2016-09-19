/*jshint node: true*/

// Karma configuration
// Generated on Sat May 23 2015 18:24:14 GMT+0300 (MSK)

var getReporters = function () {
  var reporters = ['progress'];
  if (process.argv.indexOf('--coverage') !== -1) {
    reporters.push('coverage');
  }
  return reporters;
};

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'sinon', 'sinon-chai'],


    // list of files / patterns to load in the browser
    files: [
      'node_modules/js-md5/build/*.js',
      'node_modules/sinon-chrome/chrome.js',

      'blocks/namespace/*.js',

      // options
      'blocks/options/options-handlers.js',

      // log
      'blocks/log/log.js',

      //bus block
      'blocks/bus/*.js',

      //lastfm-api block
      'blocks/lastfm-api/lastfm-api__config.js',
      'blocks/lastfm-api/lastfm-api__client.js',
      'blocks/lastfm-api/lastfm-api.js',

      //indicators block
      'blocks/indicators/indicators__utils.js',
      'blocks/indicators/indicators.js',

      //content block
      'blocks/content/content__utils.js',
      'blocks/content/content__messages.js',
      'blocks/content/content__bus-wrapper.js',
      'blocks/content/content__player-handlers.js',

      //background block
      'blocks/background/background__actions.js',
      'blocks/background/background__auth.js',

      //vk inner
      'blocks/vk-inner/vk-inner__player.js',

      'blocks/**/*.test.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      'blocks/**/!(*test).js': ['coverage']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: getReporters(),


    coverageReporter: {
      type: process.env.TRAVIS ? 'lcovonly' :'html', //lcovonly are required for generating lcov.info files
      dir: 'coverage'
    },


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    electronOpts: {
      show: false,
      skipTaskbar: true,
      webPreferences: {
        pageVisibility: true
      }
    },

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Electron'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};

/*jshint node: true*/

// Karma configuration
// Generated on Sat May 23 2015 18:24:14 GMT+0300 (MSK)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'sinon-chai'],


    // list of files / patterns to load in the browser
    files: [
      'node_modules/js-md5/build/*.js',
      'node_modules/sinon-chrome/chrome.js',
      'blocks/namespace/namespace.js',

      //bus block
      'blocks/bus/bus__background.js',
      'blocks/bus/bus__content.js',
      'blocks/bus/*.test.js',

      //lastfm-api block
      'blocks/lastfm-api/lastfm-api__config.js',
      'blocks/lastfm-api/lastfm-api__client.js',
      'blocks/lastfm-api/lastfm-api.js',
      'blocks/lastfm-api/*.test.js',

      //indicators block
      'blocks/indicators/indicators__utils.js',
      'blocks/indicators/indicators.js',
      'blocks/indicators/*.test.js',

      //content block
      'blocks/content/content__utils.js',
      'blocks/content/content__messages.js',
      'blocks/content/content__bus-wrapper.js',
      'blocks/content/content__player-handlers.js',
      'blocks/content/*.test.js',

      //background block
      'blocks/background/background__actions.js',
      'blocks/background/background__auth.js',
      'blocks/background/*.test.js',

      //vk inner
      'blocks/vk-inner/vk-inner__player.js',
      'blocks/vk-inner/*.test.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: process.env.TRAVIS ? ['Chrome_travis_ci'] : ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};

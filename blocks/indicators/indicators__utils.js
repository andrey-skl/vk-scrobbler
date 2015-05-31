(function () {
  'use strict';

  var EIndicateState = {
    logotype: 'logotype',
    nowplaying: 'nowplaying',
    scrobbled: 'scrobbled',
    paused: 'paused'
  };

  var PATHS = {
    PLAYING: chrome.extension.getURL('blocks/indicators/__icon/indicators__icon-equalizer.gif'),
    DISABLED: chrome.extension.getURL('blocks/indicators/__icon/indicators__icon-disabled.png'),
    PAUSE: chrome.extension.getURL('blocks/indicators/__icon/indicators__icon-pause.png'),
    SCROBBLED: chrome.extension.getURL('blocks/indicators/__icon/indicators__icon-check-blue.png'),
    TWITTER: chrome.extension.getURL("blocks/indicators/__icon/indicators__icon-tweet.png"),
    HEART_GRAY: chrome.extension.getURL("blocks/indicators/__icon/indicators__icon-unlove.png"),
    HEART_BLUE: chrome.extension.getURL("blocks/indicators/__icon/indicators__icon-love.png")
  };

  var ifExist = function (selector) {
    var element = document.querySelector(selector);
    return {
      run: function (callback) {
        element && callback(element);
      }
    };
  };

  /**
   * Interface
   */
  window.vkScrobbler.IdicatorsUtils = {
    EIndicateState: EIndicateState,
    PATHS: PATHS,
    ifExist: ifExist
  };
})();

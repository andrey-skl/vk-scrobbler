(function () {
  'use strict';

  var EIndicateState = {
    logotype: 0,
    nowplaying: 1,
    scrobbled: 2,
    paused: 3
  };

  var PATHS = {
    PLAYING: chrome.extension.getURL('blocks/indicators/__icon/indicators__icon-equalizer.gif'),
    DISABLED: chrome.extension.getURL('blocks/indicators/__icon/indicators__icon-disabled.png'),
    PAUSE: chrome.extension.getURL('blocks/indicators/__icon/indicators__icon-pause.png'),
    SCROBBLED: chrome.extension.getURL('blocks/indicators/__icon/indicators__icon-check-blue.png'),
    TWITTER: chrome.extension.getURL("blocks/indicators/__icon/indicators__icon-tweet.png"),
    HEART_GRAY: chrome.extension.getURL("blocks/indicators/__icon/indicators__icon-love.png"),
    HEART_BLUE: chrome.extension.getURL("blocks/indicators/__icon/indicators__icon-unlove.png")
  };

  var ifExist = function (selector) {
    var element = document.querySelector(selector);
    return {
      run: function (callback) {
        element && callback(element);
      }
    }
  };

  /**
   * Interface
   */
  window.vkScrobbler.IdicatorsUtils = {
    EIndicateState: EIndicateState,
    PATHS: PATHS,
    ifExist: ifExist
  }
})();

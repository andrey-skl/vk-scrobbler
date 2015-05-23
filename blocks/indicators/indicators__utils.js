(function () {
  'use strict';

  var EIndicateState = {
    logotype: 0,
    nowplaying: 1,
    scrobbled: 2,
    paused: 3
  };

  var PATHS = {
    PLAYING: chrome.extension.getURL('img/icon_eqB.gif'),
    DISABLED: chrome.extension.getURL('img/pause.png'),
    PAUSE: chrome.extension.getURL("img/icon_eq_pause.png"),
    SCROBBLED: chrome.extension.getURL('img/checkB.png'),
    TWITTER: chrome.extension.getURL("img/twitter.png"),
    HEART_GRAY: chrome.extension.getURL("img/heartBW.png"),
    HEART_BLUE: chrome.extension.getURL("img/heartB.png")
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

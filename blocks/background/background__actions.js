(function () {
  'use strict';

  var MSG = window.vkScrobbler.contentMessages;
  var LastFmApi = window.vkScrobbler.LastFmApi;


  var BackgroundActions = function (secretKey, userName) {
    this.api = new LastFmApi(secretKey, userName, this.onReauth.bind(this));
  };

  BackgroundActions.prototype[MSG.NEED_SCROOBLE] = function (params) {
    _gaq.push(['_trackPageview', '/scrobbling']);//трекаем как просмотр страницы
    _gaq.push(['_trackEvent', "scrobbled", params.artist + ":" + params.title]);

    return this.api.scrobble(params).then(function (response) {
      console.info("Композиция " + params.artist + ": " + params.title + " заскробблена!", response);
      return response;
    });
  };

  BackgroundActions.prototype[MSG.NOW_PLAYING] = function (params) {
    return this.api.nowPlaying(params).then(function (response) {
      console.info("Композиция " + params.artist + ": " + params.title + " отмечена как проигрываемая!");
      return response;
    });
  };

  BackgroundActions.prototype[MSG.NEED_LOVE] = function (params) {
    _gaq.push(['_trackEvent', "loved", params.artist + ":" + params.title]);

    return this.api.makeLoved(params).then(function (response) {
      console.info("Признана любовь к " + params.artist + ": " + params.title);
      return response;
    });
  };

  BackgroundActions.prototype[MSG.NOT_NEED_LOVE] = function (params) {
    _gaq.push(['_trackEvent', "unloved", params.artist + ":" + params.title]);

    return this.api.makeNotLoved(params).then(function (response) {
      console.info("Утеряна любовь к " + params.artist + ": " + params.title);
      return response;
    });
  };

  BackgroundActions.prototype[MSG.GET_TRACK_INFO] = function (params) {
    return this.api.getTrackInfo(params).then(function (res) {
      console.info("Получена информация о композиции: ", res.track);
      return res;
    });
  };

  BackgroundActions.prototype[MSG.TOGGLE_PAUSE] = function (params) {
    _gaq.push(['_trackEvent', "toggle pause scrobbling", "new status: " + params.paused, params.artist + ":" + params.title]);
    return new Promise(function (resolve) {
      resolve();
    });
  };

  BackgroundActions.prototype.onReauth = function () {
    localStorage.clear();
    chrome.runtime.reload();
  };

  window.vkScrobbler.BackgroundActions = BackgroundActions;
})();

(function () {
  'use strict';

  var MSG = window.vkScrobbler.contentMessages;
  var LastFmApi = window.vkScrobbler.LastFmApi;
  var log = window.vkScrobbler.log;


  var BackgroundActions = function (secretKey, userName) {
    this.api = new LastFmApi(secretKey, userName, this.onReauth.bind(this));
  };

  BackgroundActions.prototype[MSG.NEED_SCROOBLE] = function (params) {
    _ga('pageview', '/scrobbling');//трекаем как просмотр страницы
    _ga('event', "scrobbled", params.artist + ":" + params.title);

    return this.api.scrobble(params).then(function (response) {
      log.s(params.artist, params.title, response);
      return response;
    });
  };

  BackgroundActions.prototype[MSG.NOW_PLAYING] = function (params) {
    return this.api.nowPlaying(params).then(function (response) {
      log.p(params.artist, params.title);
      return response;
    });
  };

  BackgroundActions.prototype[MSG.NEED_LOVE] = function (params) {
    _ga('event', "loved", params.artist + ":" + params.title);

    return this.api.makeLoved(params).then(function (response) {
      log.l(params.artist, params.title);
      return response;
    });
  };

  BackgroundActions.prototype[MSG.NOT_NEED_LOVE] = function (params) {
    _ga('event', "unloved", params.artist + ":" + params.title);

    return this.api.makeNotLoved(params).then(function (response) {
      log.u(params.artist, params.title);
      return response;
    });
  };

  BackgroundActions.prototype[MSG.GET_TRACK_INFO] = function (params) {
    return this.api.getTrackInfo(params).then(function (res) {
      console.table(res.track);
      return res;
    });
  };

  BackgroundActions.prototype[MSG.TOGGLE_PAUSE] = function (params) {
    _ga('event', "toggle pause scrobbling", "new status: " + params.paused, params.artist + ":" + params.title);
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

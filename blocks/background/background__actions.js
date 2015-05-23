(function () {
  'use strict';

  var MSG = window.connectMessages;

  var RequestActions = function (secretKey, userName) {
    this.api = new window.LastFmApi(secretKey, userName);
  };

  RequestActions.prototype[MSG.NEED_SCROOBLE] = function (params) {
    _gaq.push(['_trackPageview', '/scrobbling']);//трекаем как просмотр страницы
    _gaq.push(['_trackEvent', "scrobbled", params.artist + ":" + params.title]);

    return this.api.scrobble(params).then(function (response) {
      console.info("Композиция " + params.artist + ": " + params.title + " заскробблена!", response);
    });
  };

  RequestActions.prototype[MSG.NOW_PLAYING] = function (params) {
    _gaq.push(['_trackEvent', "nowPlaying", params.artist + ":" + params.title]);

    return this.api.nowPlaying(params).then(function (response) {
      console.info("Композиция " + params.artist + ": " + params.title + " отмечена как проигрываемая!");
    });
  };

  RequestActions.prototype[MSG.NEED_LOVE] = function (params) {
    _gaq.push(['_trackEvent', "loved", params.artist + ":" + params.title]);

    return this.api.makeLoved(params).then(function (response) {
      console.info("Признана любовь к " + params.artist + ": " + params.title);
    });
  };

  RequestActions.prototype[MSG.NOT_NEED_LOVE] = function (params) {
    _gaq.push(['_trackEvent', "unloved", params.artist + ":" + params.title]);

    return this.api.makeNotLoved(params).then(function (response) {
      console.info("Утеряна любовь к " + params.artist + ": " + params.title);
      return response;
    });
  };

  RequestActions.prototype[MSG.GET_TRACK_INFO] = function (params) {
    this.api.getTrackInfo(params).then(function (res) {
      console.info("Получена информация о композиции: ", res.track);
      params.sendResponse(res);
    }, function (error) {
      params.sendResponse(error);
    });

    return true; //mark listener as asynchronous
  };

  RequestActions.prototype[MSG.TOGGLE_PAUSE] = function (params) {
    _gaq.push(['_trackEvent', "toggle pause scrobbling", "new status: " + params.request.paused, params.artist + ":" + params.title]);
  };

  window.RequestActions = RequestActions;
})();

(function () {
  'use strict';

  var api = new window.LastFmApi();
  var MSG = window.connectMessages;

  var requestActions = {};

  requestActions[MSG.NEED_SCROOBLE] = function (params) {
    _gaq.push(['_trackPageview', '/scrobbling']);//трекаем как просмотр страницы
    _gaq.push(['_trackEvent', "scrobbled", params.artist + ":" + params.title]);

    return api.scrobble(params).then(function (response) {
      console.info("Композиция " + params.artist + ": " + params.title + " заскробблена!", response);
    });
  };

  requestActions[MSG.NOW_PLAYING] = function (params) {
    _gaq.push(['_trackEvent', "nowPlaying", params.artist + ":" + params.title]);

    return api.nowPlaying(params).then(function (response) {
      console.info("Композиция " + params.artist + ": " + params.title + " отмечена как проигрываемая!");
    });
  };

  requestActions[MSG.NEED_LOVE] = function (params) {
    _gaq.push(['_trackEvent', "loved", params.artist + ":" + params.title]);

    return api.makeLoved(params).then(function (response) {
      console.info("Признана любовь к " + params.artist + ": " + params.title);
    });
  };

  requestActions[MSG.NOT_NEED_LOVE] = function (params) {
    _gaq.push(['_trackEvent', "unloved", params.artist + ":" + params.title]);

    return api.makeNotLoved(params).then(function (response) {
      console.info("Утеряна любовь к " + params.artist + ": " + params.title);
      return response;
    });
  };

  requestActions[MSG.GET_TRACK_INFO] = function (params) {
    api.getTrackInfo(params).then(function (res) {
      console.info("Получена информация о композиции: ", res.track);
      params.sendResponse(res);
    }, function (error) {
      params.sendResponse(error);
    });

    return true; //mark listener as asynchronous
  };

  requestActions[MSG.TOGGLE_PAUSE] = function (params) {
    _gaq.push(['_trackEvent', "toggle pause scrobbling", "new status: " + params.request.paused, params.artist + ":" + params.title]);
  };

  window.backgroundActions = requestActions;
})();

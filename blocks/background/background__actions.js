(function () {
  var api = window.LastFmApi;
  var MSG = window.connectMessages;

  var requestActions = {};

  requestActions[MSG.NEED_SCROOBLE] = function (params) {
    api.scrobble(params);
    _gaq.push(['_trackPageview', '/scrobbling']);//трекаем как просмотр страницы
    _gaq.push(['_trackEvent', "scrobbled", params.artist + ":" + params.title]);
  };

  requestActions[MSG.NOW_PLAYING] = function (params) {
    api.nowPlaying(params);
    _gaq.push(['_trackEvent', "nowPlaying", params.artist + ":" + params.title]);
  };

  requestActions[MSG.NEED_LOVE] = function (params) {
    api.makeLoved(params);
    _gaq.push(['_trackEvent', "loved", params.artist + ":" + params.title]);
  };

  requestActions[MSG.GET_TRACK_INFO] = function (params) {
    return api.getTrackInfo(params).then(function (res) {
      params.sendResponse(res);
    });
  };

  requestActions[MSG.TOGGLE_PAUSE] = function (params) {
    _gaq.push(['_trackEvent', "toggle pause scrobbling", "new status: " + params.request.paused, params.artist + ":" + params.title]);
  };

  window.backgroundActions = requestActions;
})();

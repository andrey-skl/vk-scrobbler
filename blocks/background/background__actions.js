(function () {
  var api = window.LastFmApi;
  var MSG = window.connectMessages;

  var requestActions = {};

  requestActions[MSG.NEED_SCROOBLE] = function (artist, title, secretApiKey) {
    api.scrobble(artist, title, secretApiKey);
    _gaq.push(['_trackPageview', '/scrobbling']);//трекаем как просмотр страницы
    _gaq.push(['_trackEvent', "scrobbled", artist + ":" + title]);
  };

  requestActions[MSG.NOW_PLAYING] = function (artist, title, secretApiKey) {
    api.nowPlaying(artist, title, secretApiKey);
    _gaq.push(['_trackEvent', "nowPlaying", artist + ":" + title]);
  };

  requestActions[MSG.NEED_LOVE] = function (artist, title, secretApiKey) {
    api.makeLoved(artist, title, secretApiKey);
    _gaq.push(['_trackEvent', "loved", artist + ":" + title]);
  };

  requestActions[MSG.TOGGLE_PAUSE] = function (artist, title, secretApiKey, request) {
    _gaq.push(['_trackEvent', "toggle pause scrobbling", "new status: " + request.paused, artist + ":" + title]);
  };

  window.backgroundActions = requestActions;
})();

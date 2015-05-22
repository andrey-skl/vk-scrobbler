(function () {
  var NONE_VALUE = "vknone";
  var MSG = window.connectMessages;

  function notNone(artist, title) {
    return artist !== NONE_VALUE && title !== NONE_VALUE
  }

  window.ConnectBus = {
    sendScrobleRequest: function sendScrobleRequest(artist, title, track) {
      if (notNone(artist, title)) {
        chrome.extension.sendMessage({
          message: MSG.NEED_SCROOBLE,
          artist: artist,
          title: track
        });
      } else {
        console.warn("none artist detected while sending scrobble request");
      }
    },
    sendNowPlayingRequest: function sendNowPlayingRequest(artist, title, track) {
      if (notNone(artist, title)) {
        chrome.extension.sendMessage({
          message: MSG.NOW_PLAYING,
          artist: artist,
          title: track
        });
      } else {
        console.warn("none artist detected while sending now playing request");
      }
    },
    sendPauseStatus: function sendPauseStatus(artist, track, paused) {
      chrome.extension.sendMessage({
        message: MSG.TOGGLE_PAUSE,
        paused: paused,
        artist: artist,
        title: track
      });
    },
    sendNeedLove: function (artist, track) {
      chrome.extension.sendMessage({
        message: MSG.NEED_LOVE,
        artist: artist,
        title: track
      });
    },
    getTrackInfoRequest: function (artist, track) {
      return new Promise(function (resolve) {
        chrome.extension.sendMessage({
          message: MSG.GET_TRACK_INFO,
          artist: artist,
          title: track
        }, {}, function onResponse(response) {
          resolve(response);
        });
      });
    }
  }


})();

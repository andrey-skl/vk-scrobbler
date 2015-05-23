(function () {
  'use strict';

  var NONE_VALUE = "vknone";
  var MSG = window.vkScrobbler.contentMessages;

  function notNone(artist, title) {
    return artist !== NONE_VALUE && title !== NONE_VALUE
  }

  var ContentBus = {
    sendScrobleRequest: function sendScrobleRequest(artist, title, track) {
      if (notNone(artist, title)) {
        chrome.runtime.sendMessage({
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
        chrome.runtime.sendMessage({
          message: MSG.NOW_PLAYING,
          artist: artist,
          title: track
        });
      } else {
        console.warn("none artist detected while sending now playing request");
      }
    },
    sendPauseStatus: function sendPauseStatus(artist, track, paused) {
      chrome.runtime.sendMessage({
        message: MSG.TOGGLE_PAUSE,
        paused: paused,
        artist: artist,
        title: track
      });
    },
    sendNeedLove: function (artist, track) {
      chrome.runtime.sendMessage({
        message: MSG.NEED_LOVE,
        artist: artist,
        title: track
      });
    },
    sendUnlove: function (artist, track) {
      chrome.runtime.sendMessage({
        message: MSG.NOT_NEED_LOVE,
        artist: artist,
        title: track
      });
    },
    getTrackInfoRequest: function (artist, track) {
      return new Promise(function (resolve, reject) {
        chrome.runtime.sendMessage({
          message: MSG.GET_TRACK_INFO,
          artist: artist,
          title: track
        }, function onResponse(response) {
          resolve(response);
        });
      });
    }
  }

  window.vkScrobbler.ContentBus = ContentBus;

})();

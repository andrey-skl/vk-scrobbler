(function () {
  'use strict';
  var BusContent = window.vkScrobbler.BusContent;
  var NONE_VALUE = "vknone";
  var MSG = window.vkScrobbler.contentMessages;

  function notNone(artist, track) {
    return artist !== NONE_VALUE && track !== NONE_VALUE;
  }

  var ContentBusWrapper = function () {
    this.bus = new BusContent('vk-scrobbler-bus');
  };

  ContentBusWrapper.prototype.sendScrobleRequest = function (artist, track) {
    if (notNone(artist, track)) {
      this.bus.sendMessage(MSG.NEED_SCROOBLE, {
        artist: artist,
        title: track
      });
    } else {
      console.warn("none artist detected while sending scrobble request");
    }
  };

  ContentBusWrapper.prototype.sendNowPlayingRequest = function (artist, track) {
    if (notNone(artist, track)) {
      this.bus.sendMessage(MSG.NOW_PLAYING, {
        artist: artist,
        title: track
      });
    } else {
      console.warn("none artist detected while sending now playing request");
    }
  };

  ContentBusWrapper.prototype.sendPauseStatus = function (artist, track, paused) {
    this.bus.sendMessage(MSG.TOGGLE_PAUSE, {
      paused: paused,
      artist: artist,
      title: track
    });
  };

  ContentBusWrapper.prototype.sendNeedLove = function (artist, track) {
    this.bus.sendMessage(MSG.NEED_LOVE, {
      artist: artist,
      title: track
    });
  };

  ContentBusWrapper.prototype.sendUnlove = function (artist, track) {
    this.bus.sendMessage(MSG.NOT_NEED_LOVE, {
      artist: artist,
      title: track
    });
  };

  ContentBusWrapper.prototype.getTrackInfoRequest = function (artist, track) {
    return this.bus.sendMessage(MSG.GET_TRACK_INFO, {
      artist: artist,
      title: track
    });
  };

  window.vkScrobbler.ContentBusWrapper = ContentBusWrapper;
})();

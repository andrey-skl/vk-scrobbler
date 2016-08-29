(function () {
  'use strict';
  const BusContent = window.vkScrobbler.BusContent;
  const MSG = window.vkScrobbler.contentMessages;

  const ContentBusWrapper = function () {
    this.bus = new BusContent('vk-scrobbler-bus');
  };

  ContentBusWrapper.prototype.sendScrobleRequest = function (artist, track) {
    return this.bus.sendMessage(MSG.NEED_SCROOBLE, {
      artist: artist,
      title: track
    });
  };

  ContentBusWrapper.prototype.sendNowPlayingRequest = function (artist, track) {
    return this.bus.sendMessage(MSG.NOW_PLAYING, {
      artist: artist,
      title: track
    });
  };

  ContentBusWrapper.prototype.sendPauseStatus = function (artist, track, paused) {
    return this.bus.sendMessage(MSG.TOGGLE_PAUSE, {
      paused: paused,
      artist: artist,
      title: track
    });
  };

  ContentBusWrapper.prototype.sendNeedLove = function (artist, track) {
    return this.bus.sendMessage(MSG.NEED_LOVE, {
      artist: artist,
      title: track
    });
  };

  ContentBusWrapper.prototype.sendUnlove = function (artist, track) {
    return this.bus.sendMessage(MSG.NOT_NEED_LOVE, {
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

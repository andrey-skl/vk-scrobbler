(function () {
  'use strict';
  var SCROBBLE_PERCENTAGE = 50;
  var nowPlayingInterval = 15 * 1000;

  var utils = window.vkScrobbler.ContentUils;
  var Indicators = window.vkScrobbler.Indicators;
  var BusWrapper = window.vkScrobbler.ContentBusWrapper;

  function PlayerHandlers() {
    this.busWrapper = new BusWrapper();
    this.state = {
      enabled: true,
      playing: false,
      scrobbled: false,

      artist: null,
      track: null,

      nowPlayingSendTimeStamp: null,
      playTimeStamp: null, //timeStamp of previous "progress" call
      playedTime: 0
    };

    this.setUpIndicatorsListeners();
  }

  PlayerHandlers.prototype.progress = function (data) {
    var timeDiff = Date.now() - (this.state.playTimeStamp || Date.now());
    this.state.playTimeStamp = Date.now();
    this.state.playedTime += timeDiff / 1000;
    var playedPercent = this.state.playedTime / data.total * 100;

    this.sendNowPlayingIfNeeded();
    this.scrobbleIfNeeded(playedPercent);
  };

  PlayerHandlers.prototype.pause = function () {
    this.state.playing = false;
    this.state.scrobbled ? Indicators.indicateScrobbled() : Indicators.indicateVKscrobbler();
  };

  PlayerHandlers.prototype.resume = function () {
    this.state.playing = true;
    this.state.scrobbled ? Indicators.indicateScrobbled() : Indicators.indicatePlayNow();
  };

  PlayerHandlers.prototype.stop = function () {
    this.state.playing = false;
    Indicators.indicateVKscrobbler();
  };

  PlayerHandlers.prototype.playStart = function (data) {
    this.state.artist = data.artist;
    this.state.track = data.title;

    this.state.scrobbled = false;
    this.state.playing = true;
    this.state.playedTime = 0;
    this.state.playTimeStamp = Date.now();
    this.state.nowPlayingSendTimeStamp = null;

    Indicators.indicatePlayNow();
    Indicators.setTwitButtonHref(utils.getTwitLink(data.artist, data.title));
    this.checkTrackLove(data.artist, data.title);
  };

  PlayerHandlers.prototype.isNowPlayingIntervalPassed = function () {
    return Date.now() - this.state.nowPlayingSendTimeStamp > nowPlayingInterval;
  };

  PlayerHandlers.prototype.sendNowPlayingIfNeeded = function () {
    if (!this.state.nowPlayingSendTimeStamp || this.isNowPlayingIntervalPassed()) {
      this.busWrapper.sendNowPlayingRequest(this.state.artist, this.state.track);
      this.state.nowPlayingSendTimeStamp = Date.now();
    }
  };

  PlayerHandlers.prototype.scrobbleIfNeeded = function (percent) {
    if (!this.state.scrobbled && percent > SCROBBLE_PERCENTAGE) {
      this.busWrapper.sendScrobleRequest(this.state.artist, this.state.track)
        .then(function () {
          this.state.scrobbled = true;
          Indicators.indicateScrobbled();
        }.bind(this));
    }
  };

  PlayerHandlers.prototype.checkTrackLove = function (artist, track) {
    Indicators.indicateNotLove();

    return this.busWrapper.getTrackInfoRequest(artist, track)
      .then(function (response) {
        var loved = response.track && response.track.userloved === '1';
        if (loved) {
          Indicators.indicateLoved();
        }
      });
  };

  PlayerHandlers.prototype.indicateScrobblerStatus = function () {
    if (!this.state.enabled) {
      Indicators.indicatePauseScrobbling();
    } else if (this.state.scrobbled) {
      Indicators.indicateScrobbled();
    } else if (this.state.playing) {
      Indicators.indicatePlayNow();
    } else {
      Indicators.indicateVKscrobbler();
    }
  };

  PlayerHandlers.prototype.setUpIndicatorsListeners = function () {
    Indicators.setListeners({
      toggleLove: function (isLove) {
        if (!this.state.artist || !this.state.track) {
          return new Promise(function(resolve, reject) {reject();});
        }
        if (isLove) {
          return this.busWrapper.sendUnlove(this.state.artist, this.state.track).then(Indicators.indicateNotLove);
        } else {
          return this.busWrapper.sendNeedLove(this.state.artist, this.state.track).then(Indicators.indicateLoved);
        }
      }.bind(this),
      togglePauseScrobbling: function togglePauseScrobbling() {
        this.state.enabled = !this.state.enabled;
        this.indicateScrobblerStatus();
        this.busWrapper.sendPauseStatus(this.state.artist, this.state.track, !this.state.enabled);
      }.bind(this)
    });
  };

  window.vkScrobbler.PlayerHandlers = PlayerHandlers;
})();

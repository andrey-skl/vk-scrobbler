(function () {
  'use strict';
  const isOldUI = Boolean(document.getElementById('top_new_msg')); //new UI doesn't have this element

  const SCROBBLE_PERCENTAGE = 50;
  const nowPlayingInterval = 15 * 1000;

  const utils = window.vkScrobbler.ContentUils;
  const Indicators = isOldUI ? window.vkScrobbler.IndicatorsOld : window.vkScrobbler.Indicators;
  const BusWrapper = window.vkScrobbler.ContentBusWrapper;

  function PlayerHandlers() {
    this.busWrapper = new BusWrapper();
    this.state = {
      enabled: true,
      playing: false,
      scrobbled: 0,
      scrobbling: false,
      nowPlayingCanBeSet: false,

      artist: null,
      track: null,

      nowPlayingSendTimeStamp: null,
      playTimeStamp: null, //timeStamp of previous "progress" call
      playedTime: 0
    };

    this.setUpIndicatorsListeners();
  }

  PlayerHandlers.prototype.progress = function (data) {
    if (!this.state.playing) {
      return;
    }
    const timeDiff = Date.now() - (this.state.playTimeStamp || Date.now());
    this.state.playedTime += timeDiff / 1000;

    this.state.playTimeStamp = Date.now();
    this.sendNowPlayingIfNeeded();
    const playedPercent = this.state.playedTime / data.total * 100;
    this.scrobbleIfNeeded(playedPercent);
    this.setNowPlayingForMultiscrobble(playedPercent);
  };

  PlayerHandlers.prototype.pause = function () {
    this.state.playing = false;
    this.state.playTimeStamp = null;
    this.indicateScrobblerStatus();
  };

  PlayerHandlers.prototype.resume = function (data) {
    if (!this.state.artist && !this.state.artist) {
      return this.playStart(data);
    }

    this.state.playing = true;
    this.indicateScrobblerStatus();
  };

  PlayerHandlers.prototype.stop = function () {
    this.state.playing = false;
    this.state.enabled && Indicators.indicateVKscrobbler();
  };

  PlayerHandlers.prototype.playStart = function (data) {
    this.state.artist = data.artist;
    this.state.track = data.title;

    this.state.scrobbled = 0;
    this.state.playing = true;
    this.state.playedTime = 0;
    this.state.playTimeStamp = Date.now();
    this.state.nowPlayingSendTimeStamp = null;

    this.state.enabled && Indicators.indicatePlayNow();
    Indicators.setTwitButtonHref(utils.getTwitLink(data.artist, data.title));
    this.checkTrackLove(data.artist, data.title);
  };

  PlayerHandlers.prototype.isNowPlayingIntervalPassed = function () {
    return Date.now() - this.state.nowPlayingSendTimeStamp > nowPlayingInterval;
  };

  PlayerHandlers.prototype.sendNowPlayingIfNeeded = function () {
    if (this.state.enabled && (!this.state.nowPlayingSendTimeStamp || this.isNowPlayingIntervalPassed())) {
      this.busWrapper.sendNowPlayingRequest(this.state.artist, this.state.track);
      this.state.nowPlayingSendTimeStamp = Date.now();
    }
  };

  PlayerHandlers.prototype.setNowPlayingForMultiscrobble = function (percent) {
    if (this.state.enabled &&
        this.state.nowPlayingCanBeSet &&
        this.state.artist &&
        this.state.track &&
        percent > 100 * this.state.scrobbled &&
        percent <= 100 * this.state.scrobbled + SCROBBLE_PERCENTAGE) {
      Indicators.indicatePlayNow();
      this.state.nowPlayingCanBeSet = false;
    }
  };

  PlayerHandlers.prototype.scrobbleIfNeeded = function (percent) {
    if (this.state.enabled &&
      !this.state.scrobbling &&
      this.state.artist &&
      this.state.track &&
      percent > SCROBBLE_PERCENTAGE + 100 * this.state.scrobbled) {
      this.state.scrobbling = true;
      this.busWrapper.sendScrobleRequest(this.state.artist, this.state.track)
        .then(function () {
          this.state.scrobbling = false;
          this.state.nowPlayingCanBeSet = true;
          this.state.scrobbled++;
          Indicators.indicateScrobbled();
        }.bind(this), function onError() {
          this.state.scrobbling = false;
        }.bind(this));
    }
  };

  PlayerHandlers.prototype.isSameTrack = function (artist, track) {
    return this.state.artist === artist && this.state.track === track;
  };

  PlayerHandlers.prototype.checkTrackLove = function (artist, track) {
    Indicators.indicateNotLove();

    return this.busWrapper.getTrackInfoRequest(artist, track)
      .then(function (response) {
        const loved = response.track && response.track.userloved === '1';
        if (loved && this.isSameTrack(artist, track)) {
          Indicators.indicateLoved();
        }
      }.bind(this));
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

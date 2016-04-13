(function () {
  'use strict';
  var messageProgress = 'progress';
  var messagePause = 'pause';
  var messageResume = 'resume';
  var messageStop = 'stop';
  var messagePlayStart = 'playStart';
  var ARTIST_NUM = 4;
  var TITLE_NUM = 3;
  var TOTAL_NUM = 5;
  var TRY_PATCH_INTERVAL = 300;

  var PlayerListener = function () {
    this.waitForPlayerAndSubscribe();
  };

  PlayerListener.prototype.sendMessage = function (msg) {
    window.postMessage({vkPlayerPatcherMessage: true, message: msg}, window.location.href);
  };


  PlayerListener.prototype.getTotal = function () {
    //_currentAudio should be used because total argument of onProgress is unstable with flash-based player (#4 issue)
    var totalStr = this.audioPlayer._currentAudio[TOTAL_NUM];
    return parseInt(totalStr);
  };

  /**
   *
   * @param track - playing track
   * @param playedPart - part of zero. like 0.50 for 50%
     */
  PlayerListener.prototype.onProgress = function (track, playedPart) {
    this.sendMessage({message: messageProgress, data: {
      current: this.getTotal() * playedPart,
      total: this.getTotal()
    }});
  };

  PlayerListener.prototype.onPause = function () {
    this.sendMessage({message: messagePause});
  };

  PlayerListener.prototype.onResume = function () {
    this.sendMessage({message: messageResume});
  };

  PlayerListener.prototype.onStop = function () {
    this.sendMessage({message: messageStop});
  };

  PlayerListener.prototype.onPlayStart = function (track, isNewTrackStarted) {
    if (!isNewTrackStarted) {
      return this.onResume();
    }

    this.sendMessage({message: messagePlayStart, data: {
      artist: PlayerListener.decodeHtmlEntity(this.audioPlayer._currentAudio[ARTIST_NUM]),
      title: PlayerListener.decodeHtmlEntity(this.audioPlayer._currentAudio[TITLE_NUM])
    }});
  };

  PlayerListener.prototype.subscribeToPlayerEvents = function (audioPlayer) {
    this.audioPlayer = audioPlayer;

    audioPlayer.subscribers.push({et: 'start', cb: this.onPlayStart.bind(this)});
    audioPlayer.subscribers.push({et: 'progress', cb: this.onProgress.bind(this)});
    audioPlayer.subscribers.push({et: 'pause', cb: this.onProgress.bind(this)});
    audioPlayer.subscribers.push({et: 'stop', cb: this.onProgress.bind(this)});
  };

  /**
   * Decodes html special chars into normal text
   */
  PlayerListener.decodeHtmlEntity = function(str) {
    var tmp = document.createElement('textarea'); //use textarea to be sure that no scripts can be injected
    tmp.innerHTML = str;
    return tmp.textContent;
  };

  PlayerListener.prototype.waitForPlayerAndSubscribe = function () {
    if (window.ap) {
      this.subscribeToPlayerEvents(window.ap);
    } else {
      setTimeout(this.waitForPlayerAndSubscribe.bind(this), TRY_PATCH_INTERVAL);
    }
  };


  window.vkScrobbler.PlayerListener = PlayerListener;
})();

(function () {
  'use strict';
  const messageProgress = 'progress';
  const messagePause = 'pause';
  const messageResume = 'resume';
  const messageStop = 'stop';
  const messagePlayStart = 'playStart';
  const ARTIST_NUM = 4;
  const TITLE_NUM = 3;
  const TOTAL_NUM = 5;
  const TRY_PATCH_INTERVAL = 300;

  const PlayerListener = function () {
    this.waitForPlayerAndSubscribe();
  };

  PlayerListener.prototype.sendMessage = function (msg) {
    window.postMessage({vkPlayerPatcherMessage: true, message: msg}, window.location.href);
  };


  PlayerListener.prototype.getTotal = function () {
    //_currentAudio should be used because total argument of onProgress is unstable with flash-based player (#4 issue)
    const totalStr = this.audioPlayer._currentAudio[TOTAL_NUM];
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

  PlayerListener.prototype.onStop = function () {
    this.sendMessage({message: messageStop});
  };

  PlayerListener.prototype.onPlayStart = function (track, isNewTrackStarted) {
    const message = isNewTrackStarted ? messagePlayStart : messageResume;

    this.sendMessage({message: message, data: {
      artist: PlayerListener.decodeHtmlEntity(this.audioPlayer._currentAudio[ARTIST_NUM]),
      title: PlayerListener.decodeHtmlEntity(this.audioPlayer._currentAudio[TITLE_NUM])
    }});
  };

  PlayerListener.prototype.subscribeToPlayerEvents = function (audioPlayer) {
    this.audioPlayer = audioPlayer;

    audioPlayer.subscribers.push({et: 'start', cb: this.onPlayStart.bind(this)});
    audioPlayer.subscribers.push({et: 'progress', cb: this.onProgress.bind(this)});
    audioPlayer.subscribers.push({et: 'pause', cb: this.onPause.bind(this)});
    audioPlayer.subscribers.push({et: 'stop', cb: this.onStop.bind(this)});
  };

   // Decodes html special chars into normal text
   // http://stackoverflow.com/a/9609450/1589989
  PlayerListener.decodeHtmlEntity = function(str) {
    const tmp = document.createElement('textarea'); //use textarea to be sure that no scripts can be injected
    if(str && typeof str === 'string') {
      // strip script/html tags
      str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
      str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
      tmp.innerHTML = str;
      str = tmp.textContent;
      tmp.textContent = '';
    }
    return str;
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

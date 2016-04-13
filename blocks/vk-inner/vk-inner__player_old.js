(function () {
  'use strict';
  var messageProgress = 'progress';
  var messagePause = 'pause';
  var messageResume = 'resume';
  var messageStop = 'stop';
  var messagePlayStart = 'playStart';
  var ARTIST_NUM = 5;
  var TITLE_NUM = 6;
  var TOTAL_NUM = 3;
  var TRY_PATCH_INTERVAL = 300;

  var PlayerPatcherOld = function () {
    this.osOperating = false; //is audioPlayer.operate function is calling
    this.waitForPlayerAndPatch();
  };

  PlayerPatcherOld.prototype.sendMessage = function (msg) {
    window.postMessage({vkPlayerPatcherMessage: true, message: msg}, window.location.href);
  };

  PlayerPatcherOld.prototype.getTotal = function () {
    //lastSong should be used because total argument of onProgress is unstable with flash-based player (#4 issue)
    var totalStr = this.audioPlayer.lastSong[TOTAL_NUM];
    return parseInt(totalStr);
  };

  PlayerPatcherOld.prototype.onProgress = function (current) {
    this.sendMessage({message: messageProgress, data: {
      current: current,
      total: this.getTotal()
    }});
  };

  PlayerPatcherOld.prototype.onPause = function () {
    this.sendMessage({message: messagePause});
  };

  PlayerPatcherOld.prototype.onResume = function () {
    this.sendMessage({message: messageResume});
  };

  PlayerPatcherOld.prototype.onStop = function () {
    this.sendMessage({message: messageStop});
  };

  PlayerPatcherOld.prototype.onPlayStart = function () {
    this.sendMessage({message: messagePlayStart, data: {
      artist: PlayerPatcherOld.decodeHtmlEntity(this.audioPlayer.lastSong[ARTIST_NUM]),
      title: PlayerPatcherOld.decodeHtmlEntity(this.audioPlayer.lastSong[TITLE_NUM])
    }});
  };

  PlayerPatcherOld.prototype.patchAudioPlayer = function (audioPlayer) {
    this.audioPlayer = audioPlayer;

    PlayerPatcherOld.addCallListener(audioPlayer, 'onPlayProgress', this.onProgress.bind(this));

    PlayerPatcherOld.addCallListener(audioPlayer, 'stop', this.onStop.bind(this));

    PlayerPatcherOld.addCallListener(audioPlayer, 'playback', function (paused) {
      paused ? this.onPause() : this.onResume();
    }.bind(this));

    PlayerPatcherOld.addCallListener(audioPlayer, 'operate', {
      before: function () {
        this.isOperating = true;
      }.bind(this),
      after: function () {
        this.isOperating = false;
      }.bind(this)
    });

    PlayerPatcherOld.addCallListener(audioPlayer, 'loadGlobal', function () {
      /**
       * If calling by audioPlayer.operate, then it is starting new track playing
       */
      this.isOperating && this.onPlayStart();
    }.bind(this));
  };


  PlayerPatcherOld.prototype.waitForPlayerAndPatch = function () {
    if (window.audioPlayer) {
      this.patchAudioPlayer(window.audioPlayer);
    } else {
      setTimeout(this.waitForPlayerAndPatch.bind(this), TRY_PATCH_INTERVAL);
    }
  };

  /**
   * Decodes html special chars into normal text
   */
  PlayerPatcherOld.decodeHtmlEntity = function(str) {
    var tmp = document.createElement('textarea'); //use textarea to be sure that no scripts can be injected
    tmp.innerHTML = str;
    return tmp.textContent;
  };

  /**
   * Adds listener to function's calls by monkey patching
   * @param object - object to patch
   * @param method - method to replace with monkey patched one
   * @param callbacks, can contain "after" and "before" callbacks, If function passed, it will be called before original
   * @returns {Function} - patched function
   */
  PlayerPatcherOld.addCallListener = function (object, method, callbacks) {
    var before = callbacks.before || callbacks;
    var original = object[method];

    object[method] = function callHandler() {
      before && before.apply(callbacks, arguments);

      var result = original.apply(this, arguments);

      callbacks.after && callbacks.after.apply(callbacks, arguments);
      return result;
    };
  };

  window.vkScrobbler.PlayerPatcherOld = PlayerPatcherOld;
})();

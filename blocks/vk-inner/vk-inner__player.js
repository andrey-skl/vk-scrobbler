(function () {
  'use strict';
  var messageProgress = 'progress';
  var messagePause = 'pause';
  var messageResume = 'resume';
  var messageStop = 'stop';
  var messagePlayStart = 'playStart';
  var ARTIST_NUM = 5;
  var TITLE_NUM = 6;
  var TRY_PATCH_INTERVAL = 300;

  var PlayerPatcher = function () {
    this.osOperating = false; //is audioPlayer.operate function is calling
    this.waitForPlayerAndPatch();
  };

  PlayerPatcher.prototype.sendMessage = function (msg) {
    window.postMessage({vkPlayerPatcherMessage: true, message: msg}, window.location.href);
  };

  PlayerPatcher.prototype.onProgress = function (current, total) {
    if (total === 0) {
      //Fixes #2, #3. On windows, onPlayProgress calls before start by some reasons
      return;
    }
    this.sendMessage({message: messageProgress, data: {
      current: current,
      total: total
    }});
  };

  PlayerPatcher.prototype.onPause = function () {
    this.sendMessage({message: messagePause});
  };

  PlayerPatcher.prototype.onResume = function () {
    this.sendMessage({message: messageResume});
  };

  PlayerPatcher.prototype.onStop = function () {
    this.sendMessage({message: messageStop});
  };

  PlayerPatcher.prototype.onPlayStart = function () {
    this.sendMessage({message: messagePlayStart, data: {
      artist: PlayerPatcher.decodeHtmlEntity(this.audioPlayer.lastSong[ARTIST_NUM]),
      title: PlayerPatcher.decodeHtmlEntity(this.audioPlayer.lastSong[TITLE_NUM])
    }});
  };

  PlayerPatcher.prototype.patchAudioPlayer = function (audioPlayer) {
    this.audioPlayer = audioPlayer;

    PlayerPatcher.addCallListener(audioPlayer, 'onPlayProgress', this.onProgress.bind(this));

    PlayerPatcher.addCallListener(audioPlayer, 'stop', this.onStop.bind(this));

    PlayerPatcher.addCallListener(audioPlayer, 'playback', function (paused) {
      paused ? this.onPause() : this.onResume();
    }.bind(this));

    PlayerPatcher.addCallListener(audioPlayer, 'operate', {
      before: function () {
        this.isOperating = true;
      }.bind(this),
      after: function () {
        this.isOperating = false;
      }.bind(this)
    });

    PlayerPatcher.addCallListener(audioPlayer, 'loadGlobal', function () {
      /**
       * If calling by audioPlayer.operate, then it is starting new track playing
       */
      this.isOperating && this.onPlayStart();
    }.bind(this));
  };


  PlayerPatcher.prototype.waitForPlayerAndPatch = function () {
    if (window.audioPlayer) {
      this.patchAudioPlayer(window.audioPlayer);
    } else {
      setTimeout(this.waitForPlayerAndPatch.bind(this), TRY_PATCH_INTERVAL);
    }
  };

  /**
   * Decodes html special chars into normal text
   */
  PlayerPatcher.decodeHtmlEntity = function(str) {
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
  PlayerPatcher.addCallListener = function (object, method, callbacks) {
    var before = callbacks.before || callbacks;
    var original = object[method];

    object[method] = function callHandler() {
      before && before.apply(callbacks, arguments);

      var result = original.apply(this, arguments);

      callbacks.after && callbacks.after.apply(callbacks, arguments);
      return result;
    };
  };

  window.vkScrobbler.PlayerPatcher = PlayerPatcher;
})();

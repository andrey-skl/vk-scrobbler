(function () {
  'use strict';
  var messageProgress = 'progress';
  var messagePause = 'pause';
  var messageResume = 'resume';
  var messageStop = 'stop';
  var messagePlayStart = 'playStart';
  var ARTIST_NUM = 5;
  var TITLE_NUM = 6;
  var SAVE_LINK = 2;

  var PlayerPatcher = function (extensionId) {
    this.extensionId = extensionId;
    this.osOperating = false; //is audioPlayer.operate function calling
  };

  PlayerPatcher.prototype.sendMessage = function (msg) {
    chrome.runtime.sendMessage(this.extensionId, msg);
  };

  PlayerPatcher.prototype.onProgress = function (current, total) {
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
    this.sendMessage({message: messagePlayStart});
  };

  PlayerPatcher.prototype.patchAudioPlayer = function (audioPlayer) {
    PlayerPatcher.addCallListener(audioPlayer, 'onPlayProgress', {
      before: this.onProgress.bind(this)
    });

    PlayerPatcher.addCallListener(audioPlayer, 'stop', {
      before: this.onStop.bind(this)
    });

    PlayerPatcher.addCallListener(audioPlayer, 'playback', {
      before: function (paused) {
        paused ? this.onPause() : this.onResume();
      }.bind(this)
    });

    PlayerPatcher.addCallListener(audioPlayer, 'operate', {
      before: function () {
        this.isOperating = true;
      }.bind(this),
      after: function () {
        this.isOperating = false;
      }.bind(this)
    });

    PlayerPatcher.addCallListener(audioPlayer, 'loadGlobal', {
      before: function () {
        /**
         * If calling by audioPlayer.operate, then it is starting new track playing
         */
        this.isOperating && this.onPlayStart();
      }.bind(this)
    });
  };

  /**
   * Adds listener to function's calls by monkey patching
   * @param object - object to patch
   * @param method - method to replace with monkey patched one
   * @param callbacks, can contain "after" and "before" callbacks
   * @returns {Function} - patched function
   */
  PlayerPatcher.addCallListener = function (object, method, callbacks) {
    var original = object[method];

    object[method] = function callHandler() {
      callbacks.before && callbacks.before.apply(callbacks, arguments);

      var result = original.apply(this, arguments);

      callbacks.after && callbacks.after.apply(callbacks, arguments);
      return result;
    };
  };

  window.vkScrobbler.PlayerPatcher = PlayerPatcher;
})();

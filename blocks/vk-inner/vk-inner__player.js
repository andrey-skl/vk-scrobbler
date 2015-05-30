(function () {
  'use strict';

  var PlayerPatcher = function (extensionId) {
    this.extensionId = extensionId;
  };

  PlayerPatcher.prototype.sendMessage = function (msg) {
    chrome.runtime.sendMessage(this.extensionId, msg);
  };

  window.vkScrobbler = {
    PlayerPatcher: PlayerPatcher
  };
})();

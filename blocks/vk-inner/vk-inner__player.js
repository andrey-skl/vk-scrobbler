(function () {
  'use strict';

  var PlayerPatcher = function (extensionId) {
    this.extensionId = extensionId;
  };

  PlayerPatcher.prototype.sendMessage = function (msg) {
    chrome.runtime.sendMessage(this.extensionId, msg);
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

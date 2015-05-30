(function () {
  'use strict';

  var PlayerPatcher = window.vkScrobbler.PlayerPatcher;

  function readExtensionId() {
    var scriptNode = document.getElementById('vk-scrobbler-player-patcher');
    return scriptNode.getAttribute('extension-id');
  }

  var patcher = new PlayerPatcher(readExtensionId());
})();

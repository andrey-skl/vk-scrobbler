(function() {
  'use strict';
  var PlayerListener = window.vkScrobbler.PlayerListener;
  var PlayerPatcher = window.vkScrobbler.PlayerPatcherOld;
  var isOldUI = Boolean(document.getElementById('top_new_msg')); //new UI doesn't have this element
  var log = window.vkScrobbler.log;

  log.i('vk-inner.js: New ui detected = '+ !isOldUI);

  var PlayerPatcherToUse = isOldUI ? PlayerPatcher : PlayerListener;

  new PlayerPatcherToUse();
})();

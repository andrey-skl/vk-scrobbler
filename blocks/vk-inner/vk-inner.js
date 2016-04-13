(function () {
  'use strict';
  var PlayerListener = window.vkScrobbler.PlayerListener;
  var PlayerPatcher = window.vkScrobbler.PlayerPatcherOld;

  var isOldUI = 'Page' in window; //new UI doesn't have Page object in window

  var PlayerPatcherToUse = isOldUI ? PlayerPatcher : PlayerListener;

  new PlayerPatcherToUse();
})();

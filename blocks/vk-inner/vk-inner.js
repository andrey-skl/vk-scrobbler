(function () {
  'use strict';
  var PlayerListener = window.vkScrobbler.PlayerListener;
  var PlayerPatcher = window.vkScrobbler.PlayerPatcherOld;

  var isOldUI = Boolean(document.getElementById('top_new_msg')); //new UI doesn't have this element
  console.info('vk scrobbler:inner. New ui detected = ', !isOldUI);

  var PlayerPatcherToUse = isOldUI ? PlayerPatcher : PlayerListener;

  new PlayerPatcherToUse();
})();

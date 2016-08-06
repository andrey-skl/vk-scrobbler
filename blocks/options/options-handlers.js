(function () {
  'use strict';

  var optionsHandlers = {
    // Because Firefox doesn't support syncing between
    // Chrome browsers
    storageGet: function (defaults, getThings) {
      if (chrome.storage.sync) {
        chrome.storage.sync.get(defaults, getThings);
      } else {
        chrome.storage.local.get(defaults, getThings);
      }
    },
  };

  window.vkScrobbler.optionsHandlers = optionsHandlers;

})();

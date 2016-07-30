(function () {
  'use strict';

  var scriptInjector = {
    injectNamespace: function () {
      //namespace
      var nsScript = document.createElement('script');
      nsScript.src = chrome.extension.getURL("blocks/namespace/namespace.js");
      document.body.appendChild(nsScript);
    },
    injectLog: function () {
      //namespace
      var nsScript = document.createElement('script');
      nsScript.src = chrome.extension.getURL("blocks/log/log.js");
      document.body.appendChild(nsScript);
    },
    injectPlayerPatcher: function () {
      //share vk-inner__player.js to vk.com
      var playerScript = document.createElement('script');
      playerScript.src = chrome.extension.getURL("blocks/vk-inner/vk-inner__player.js");
      document.body.appendChild(playerScript);

      var playerScriptOld = document.createElement('script');
      playerScriptOld.src = chrome.extension.getURL("blocks/vk-inner/vk-inner__player_old.js");
      document.body.appendChild(playerScriptOld);
    },
    injectVkInner: function () {
      //исполнить скрипт vk_inner в контексте vk.com
      var script = document.createElement('script');
      script.src = chrome.extension.getURL("blocks/vk-inner/vk-inner.js");
      document.body.appendChild(script);
    },
    injectPatcher: function () {

      scriptInjector.injectNamespace();
      scriptInjector.injectLog();

      setTimeout(function () {
        scriptInjector.injectPlayerPatcher();

        setTimeout(function () {
          scriptInjector.injectVkInner();
        }, 100);
      }, 100);
    }
  };

  window.vkScrobbler.scriptInjector = scriptInjector;

})();

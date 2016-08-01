(function () {
  'use strict';

  var backgroundAuth = window.vkScrobbler.backgroundAuth;
  var BackgroundHandlers = window.vkScrobbler.BackgroundActions;
  var BusBackground = window.vkScrobbler.BusBackground;
  var log = window.vkScrobbler.log;
  var bus;

  var SECRET_KEY = "skey";
  var USER_NAME = "userName";

  var secretApiKey = localStorage[SECRET_KEY];
  var userName = localStorage[USER_NAME];


  function startConnection(secretApiKey, userName) {
    if (bus) {
      bus.close();
    }
    var handlers = new BackgroundHandlers(secretApiKey, userName);
    bus = new BusBackground(handlers);
  }

  var activate = function () {
    if (!secretApiKey || !userName) {
      backgroundAuth();
    } else {
      startConnection(secretApiKey, userName);
    }
    log.i('Background started');
  };
  activate();

  window.vkScrobbler.backgroundApi = {
    setCredentials: function (secretKey, name) {
      localStorage[SECRET_KEY] = secretApiKey = secretKey;
      localStorage[USER_NAME] = userName = name;

      startConnection(secretKey, name);
      log.i('Authorization data obtained: '+ secretKey + " " + name);
    }
  };
})();

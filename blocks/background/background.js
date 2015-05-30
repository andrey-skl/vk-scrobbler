(function () {
  'use strict';

  var backgroundAuth = window.vkScrobbler.backgroundAuth;
  var RequestActions = window.vkScrobbler.RequestActions;
  var BusBackground = window.vkScrobbler.BusBackground;
  var bus;

  var SECRET_KEY = "skey";
  var USER_NAME = "userName";

  var secretApiKey = localStorage[SECRET_KEY];
  var userName = localStorage[USER_NAME];


  function startConnection(secretApiKey, userName) {
    if (bus) {
      bus.close();
    }
    var requestActions = new RequestActions(secretApiKey, userName);
    bus = new BusBackground(requestActions);
  }

  var activate = function () {
    if (!secretApiKey || !userName) {
      backgroundAuth();
    } else {
      startConnection(secretApiKey, userName);
    }
    console.info('Background started');
  };
  activate();

  window.vkScrobbler.backgroundApi = {
    setCredentials: function (secretKey, name) {
      localStorage[SECRET_KEY] = secretApiKey = secretKey;
      localStorage[USER_NAME] = userName = name;

      startConnection(secretKey, name);
      console.info('Получены данные авторизации', secretKey, name);
    }
  };
})();

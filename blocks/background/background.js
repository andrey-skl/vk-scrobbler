(function () {
  'use strict';

  const backgroundAuth = window.vkScrobbler.backgroundAuth;
  const BackgroundHandlers = window.vkScrobbler.BackgroundActions;
  const BusBackground = window.vkScrobbler.BusBackground;
  const log = window.vkScrobbler.log;

  const SECRET_KEY = 'skey';
  const USER_NAME = 'userName';

  let bus;
  let secretApiKey = localStorage[SECRET_KEY];
  let userName = localStorage[USER_NAME];


  function startConnection(secretApiKey, userName) {
    if (bus) {
      bus.close();
    }
    const handlers = new BackgroundHandlers(secretApiKey, userName);
    bus = new BusBackground(handlers);
  }

  const activate = function () {
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
      log.i(`Authorization data obtained: ${secretKey} ${name}`);
    }
  };
})();

(function () {
  'use strict';

  var backgroundAuth = window.vkScrobbler.backgroundAuth;
  var RequestActions = window.vkScrobbler.RequestActions;
  var requestActions = null;

  var SECRET_KEY = "skey";
  var USER_NAME = "userName";

  var secretApiKey = localStorage[SECRET_KEY];
  var userName = localStorage[USER_NAME];

  var activate = function () {
    if (!secretApiKey || !userName) {
      backgroundAuth();
    } else {
      requestActions = new RequestActions(secretApiKey, userName);
    }
    console.info('Background started');
  };
  activate();


  function listenMessagesFromInjectedScript() {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

      if (requestActions && requestActions[request.message]) {
        return requestActions[request.message]({
          artist: escapeDoubleQuotes(request.artist),
          title: escapeDoubleQuotes(request.title),
          request: request,
          sendResponse: sendResponse
        });
      } else {
        if (requestActions) {
          throw new Error('Cant find listener for message: ' + request.message);
        }
        throw new Error('Trying to make requests while credentials is empty' + requestActions);
      }
    });
  }
  listenMessagesFromInjectedScript();

  function escapeDoubleQuotes(text) {
    return text ? text.replace(/"/g, "'") : text;
  }

  window.vkScrobbler.backgroundApi = {
    setCredentials: function (secretKey, name) {
      localStorage[SECRET_KEY] = secretApiKey = secretKey;
      localStorage[USER_NAME] = userName = name;

      requestActions = new RequestActions(secretKey, name);
      console.info('Получены данные авторизации', secretKey, name);
    }
  };
})();

(function () {
  'use strict';

  var RequestActions = window.RequestActions;
  var requestActions = null;

  var secretApiKey = localStorage["skey"] || "";
  var userName = localStorage["userName"] || "";

  var activate = function () {
    if (!secretApiKey || !userName) {
      window.backgroundAuth();
    } else {
      requestActions = new RequestActions(secretApiKey, userName);
    }
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
        throw new Error('Cant find listener for message: ' +
          request.message + ' or maybe requestActoins is null: ' + requestActions);
      }
    });
  }
  listenMessagesFromInjectedScript();

  function escapeDoubleQuotes(text) {
    return text ? text.replace(/"/g, "'") : text;
  }

  window.backgroundApi = {
    setCredentials: function (secretKey, name) {
      secretApiKey = secretKey;
      userName = name;
      requestActions = new RequestActions(secretKey, name);
    }
  };
})();

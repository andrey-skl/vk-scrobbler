(function () {
  'use strict';

  var messageActions = window.backgroundActions;
  var secretApiKey = localStorage["skey"] || "";
  var userName = localStorage["userName"] || "";

  var activate = function () {
    if (!secretApiKey) {
      window.backgroundAuth();
    }
  };
  activate();


  function listenMessagesFromInjectedScript() {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      if (messageActions[request.message]) {
        return messageActions[request.message]({
          artist: escapeDoubleQuotes(request.artist),
          title: escapeDoubleQuotes(request.title),
          key: secretApiKey,
          userName: userName,
          request: request,
          sendResponse: sendResponse
        });
      } else {
        throw new Error('Cant find listener for message: ', request.message);
      }
    });
  }
  listenMessagesFromInjectedScript();

  function escapeDoubleQuotes(text) {
    return text ? text.replace(/"/g, "'") : text;
  }

  window.backgroundApi = {
    setSecretApiKey: function (secretKey) {
      secretApiKey = secretKey;
    },
    setUserName: function (name) {
      userName = name;
    }
  };
})();

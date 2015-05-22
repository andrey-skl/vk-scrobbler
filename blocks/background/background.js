(function () {
  var messageActions = window.backgroundActions;
  var secretApiKey = localStorage["skey"] || "";


  var activate = function () {
    if (!secretApiKey) {
      window.backgroundAuth();
    }
  };
  activate();


  function listenMessagesFromInjectedScript() {
    chrome.extension.onRequest.addListener(function (request) {
      if (messageActions[request.message]) {
        messageActions[request.message](escapeDoubleQuotes(request.artist), escapeDoubleQuotes(request.title), secretApiKey, request);
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
    }
  };
})();

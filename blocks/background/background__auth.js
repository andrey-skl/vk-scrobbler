(function () {
  var LastFmApiConfig = window.LastFmApiConfig;
  var oauthRedirectUrl = "https://vk.com/registervkscrobbler";
  var tokenRegEx = /\?token\=.*/;

  function openLastFmAuthTab() {
    chrome.tabs.create({
      "url": "http://www.lastfm.ru/api/auth/?api_key=" + LastFmApiConfig.apiKey,
      "selected": true
    });
  }

  function redirectToAuthPage(tabId, urlSearch) {
    chrome.tabs.update(tabId, {url: "blocks/auth/auth.html" + urlSearch, active: true}, null);
  }

  /**
   * Export authorization function
   */
  window.backgroundAuth = function () {

    openLastFmAuthTab();

    function handleOAuthRedirect() {

      chrome.tabs.getAllInWindow(null, function (tabs) {
        for (var i = 0; i < tabs.length; i++) {
          var tabUrl = tabs[i].url;

          if (tabUrl.indexOf(oauthRedirectUrl) == 0) {
            chrome.tabs.onUpdated.removeListener(handleOAuthRedirect);
            redirectToAuthPage(tabs[i].id, tabUrl.match(tokenRegEx));
            return;
          }
        }
      });

    }

    chrome.tabs.onUpdated.addListener(handleOAuthRedirect);
  };
})();

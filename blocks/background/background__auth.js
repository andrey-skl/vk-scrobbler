(function() {
  'use strict';

  const LastFmApiConfig = window.vkScrobbler.LastFmApiConfig;
  const oauthRedirectUrl = 'https://vk.com/registervkscrobbler';
  const tokenRegEx = /\?token\=.*/;

  function openLastFmAuthTab() {
    chrome.tabs.create({
      'url': 'http://www.lastfm.ru/api/auth?api_key=' + LastFmApiConfig.apiKey,
      'active': true
    });
  }

  function redirectToAuthPage(tabId, urlSearch) {
    chrome.tabs.update(tabId, {
      url: 'blocks/auth/auth.html' + urlSearch,
      active: true
    }, null);
  }

  const backgroundAuth = function() {

    openLastFmAuthTab();

    function handleOAuthRedirect() {
          // @TODO
          // I think, It should be rewritten
      chrome.tabs.query({
          active: true,
          currentWindow: true
      },
        function(tabs) {
          for (let i = 0; i < tabs.length; i++) {
            const tabUrl = tabs[i].url;

            if (tabUrl.indexOf(oauthRedirectUrl) === 0) {
              chrome.tabs.onUpdated.removeListener(handleOAuthRedirect);
              redirectToAuthPage(tabs[i].id, tabUrl.match(tokenRegEx));
              return;
            }
          }
        });
    }

    chrome.tabs.onUpdated.addListener(handleOAuthRedirect);
  };

  window.vkScrobbler.backgroundAuth = backgroundAuth;
})();

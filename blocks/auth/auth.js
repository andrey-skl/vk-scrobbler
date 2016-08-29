(function() {
  'use strict';

  const GET_SESSION = 'auth.getSession';
  const GET_USER_INFO = 'user.getInfo';

  const lastFmClient = new window.LastFMClient(window.vkScrobbler.LastFmApiConfig);
  const log = window.vkScrobbler.log;

  const token = window.location.search.replace('?token=', '');

  const recreateMessageNode = function (msg) {
    let div = document.createElement('div');
    div.id = 'message';
    div.className = 'auth__message';
    div.appendChild(document.createTextNode(msg));
    document.getElementById('auth').appendChild(div);
  };

  const getUserInfo = function(user) {
    return lastFmClient.signedCall('POST', {
      method: GET_USER_INFO,
      user: user
    }).catch(function(e) {
      throw e;
    });
  };

  const processUserParams = function(userInfo) {
    const img = document.createElement('img');
    img.src = userInfo.user.image[0]['#text'];
    document.getElementById('userImage').appendChild(img);
  };

  const showInformation = function(userName) {
    document.getElementById('loader').remove();
    document.getElementById('message').remove();
    recreateMessageNode('VK scrobbler успешно подключен. Обновите открытые вкладки vk.com!');
    getUserInfo(userName).then(processUserParams);
    document.getElementById('userName').appendChild(document.createTextNode(userName));
  };

  const sendCredentialsToBackground = function(key, name) {
    const backgroundApi = chrome.extension.getBackgroundPage().vkScrobbler.backgroundApi;
    backgroundApi.setCredentials(key, name);
  };

  const checkToken = function(token) {
    if (!token) {
      throw new Error('Token not found for url ' + window.location.href);
    } else {
      log.i('Token: ' + token);

      return lastFmClient.signedCall('POST', {
        method: GET_SESSION,
        token: token
      }).catch(function(e) {
        _ga.push(['_trackEvent', 'JS Error Auth', e, navigator.userAgent]);

        document.getElementById('message').remove();
        recreateMessageNode(JSON.stringify(e.message || e));
        throw e;
      });
    }
  };

  const processAuthParams = function(data) {
    const userName = data.session.name;
    const secretKey = data.session.key;

    log.i(`Name: ${userName}, key: ${secretKey}`);

    sendCredentialsToBackground(secretKey, userName);
    showInformation(userName);
  };

  // Setting default values for settings
  const presetSettings = function () {
    log.i('Setting default options.');
    chrome.storage.local.set({
      twitter: true,
      eq: {
        showTopbar: true,
      }
    });
  };

  const activate = function() {
    checkToken(token).then(processAuthParams);
    presetSettings();
  };
  activate();
})();

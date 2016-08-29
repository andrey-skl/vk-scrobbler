(function() {
  'use strict';

  var GET_SESSION = 'auth.getSession';
  var GET_USER_INFO = 'user.getInfo';

  var lastFmClient = new window.LastFMClient(window.vkScrobbler.LastFmApiConfig);
  var log = window.vkScrobbler.log;

  var token = window.location.search.replace('?token=', '');

  var showInformation = function(userName) {
    document.getElementById("loader").remove();
    document.getElementById("message").remove();
    recreateMessageNode("VK scrobbler успешно подключен. Обновите уже открытые вкладки vk.com!");
    getUserInfo(userName).then(processUserParams);
    document.getElementById("userName").appendChild(document.createTextNode(userName));
  };

  let recreateMessageNode = function (msg) {
    let div = document.createElement('div');
    div.id = "message";
    div.className = "auth__message";
    div.appendChild(document.createTextNode(msg));
    document.getElementById("auth").appendChild(div);
  };

  var sendCredentialsToBackground = function(key, name) {
    var backgroundApi = chrome.extension.getBackgroundPage().vkScrobbler.backgroundApi;
    backgroundApi.setCredentials(key, name);
  };

  var checkToken = function(token) {
    if (!token) {
      throw new Error("Token not found for url " + window.location.href);
    } else {
      log.i("Token: " + token);

      return lastFmClient.signedCall('POST', {
        method: GET_SESSION,
        token: token
      }).catch(function(e) {
        _ga.push(['_trackEvent', 'JS Error Auth', e, navigator.userAgent]);
        
        document.getElementById("message").remove();
        recreateMessageNode(JSON.stringify(e.message || e));
        throw e;
      });
    }
  };

  var getUserInfo = function(user) {
    return lastFmClient.signedCall('POST', {
      method: GET_USER_INFO,
      user: user
    }).catch(function(e) {
      throw e;
    });
  };

  var processUserParams = function(userInfo) {
    var img = document.createElement("img");
    img.src = userInfo.user.image[0]['#text'];
    document.getElementById("userImage").appendChild(img);
  };


  var processAuthParams = function(data) {
    var userName = data.session.name;
    var secretKey = data.session.key;

    log.i("Name: ", userName, ", key: " + secretKey);

    sendCredentialsToBackground(secretKey, userName);
    showInformation(userName);
  };

  // Setting default values for settings
  let presetSettings = function () {
    log.i("Setting default options.");
    chrome.storage.local.set({
      twitter: true,
      eq: {
        showTopbar: true,
      }
    });
  };

  var activate = function() {
    checkToken(token).then(processAuthParams);
    presetSettings();
  };
  activate();
})();

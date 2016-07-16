(function() {
  'use strict';

  var GET_SESSION = 'auth.getSession';
  var GET_USER_INFO = 'user.getInfo';
  var lastFmClient = new window.LastFMClient(window.vkScrobbler.LastFmApiConfig);
  var log = window.log;

  var token = window.location.search.replace('?token=', '');

  var showInformation = function(userName) {
    document.getElementById("loader").remove();
    getUserInfo(userName).then(processUserParams);
    document.getElementById("userName").innerHTML = userName;
    document.getElementById("message").innerHTML = "VK scrobbler успешно подключен.<br>Обновите уже открытые вкладки vk.com!";
  };

  var sendCredentialsToBackground = function(key, name) {
    var backgroundApi = chrome.extension.getBackgroundPage().vkScrobbler.backgroundApi;
    backgroundApi.setCredentials(key, name);
  };

  var checkToken = function(token) {
    if (!token) {
      throw new Error("Token not found for url " + window.location.href);
    } else {
      log("Token: " + token);

      return lastFmClient.signedCall('POST', {
        method: GET_SESSION,
        token: token
      }).catch(function(e) {
        _gaq.push(['_trackEvent', 'JS Error Auth', e, navigator.userAgent]);

        document.getElementById("message").innerHTML = JSON.stringify(e.message || e);
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
    console.log(userInfo.user.image[1]['#text']);
    var img = document.createElement("img");
    img.src = userInfo.user.image[0]['#text'];
    document.getElementById("userImage").appendChild(img);
  };


  var processAuthParams = function(data) {
    var userName = data.session.name;
    var secretKey = data.session.key;

    console.info("Name: ", userName, ", key: " + secretKey);

    sendCredentialsToBackground(secretKey, userName);
    showInformation(userName);
  };

  var activate = function() {
    checkToken(token).then(processAuthParams);
  };
  activate();
})();

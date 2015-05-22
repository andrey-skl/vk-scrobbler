(function () {
  var GET_SESSION = 'auth.getSession';
  var lastfm = new LastFMClient(window.LastFmApiConfig);

  var token = window.location.search.replace('?token=', '');

  var saveCredentials = function (key, name) {
    localStorage["skey"] = key;
    localStorage["userName"] = name;
  };

  var showInformatoin = function (userName) {
    document.getElementById("userName").innerHTML = userName;
    document.getElementById("message").innerHTML = "VK scrobbler подключен к вашему аккуанту. <br>" +
      "Не забудьте обновить уже открытые вкладки vk.com!";
  };

  var sendKeyToBackground = function (key, name) {
    var backgroundApi = chrome.extension.getBackgroundPage().backgroundApi;
    backgroundApi.setSecretApiKey(key);
    backgroundApi.setUserName(name)
  };

  var checkToken = function (token) {
    if (!token) {
      throw new Error("Token not finded for url " + window.location.href);
    } else {
      console.info("Token: " + token);

      return lastfm.signedCall('POST', {
        method: GET_SESSION,
        token: token
      }).catch(function (e) {
          document.getElementById("message").innerHTML = e.message || e;
          throw e;
        });
    }
  };

  var processAuthParams = function (data) {
    var userName = data.session.name;
    var secretKey = data.session.key;

    console.info("Name: ", userName, ", key: " + secretKey);

    saveCredentials(secretKey, userName);
    sendKeyToBackground(secretKey, userName);
    showInformatoin(userName);
  };

  checkToken(token).then(processAuthParams);
})();

(function () {
  'use strict';

  var lastFmClient = new LastFMClient(window.LastFmApiConfig);

  var extend = function (destination, source) {
    for (var prop in source)
      destination[prop] = source[prop];
    return destination;
  };

  var LastFmApi = function (secretKey) {
    this.secretKey = secretKey;
  };

  LastFmApi.prototype._sendRequest = function (params, data) {
    return lastFmClient.signedCall('POST', extend({
      artist: params.artist,
      track: params.title,
      sk: this.secretKey || params.key
    }, data))
  };

  LastFmApi.prototype.scrobble = function (params) {
    var ts = Math.round(new Date().getTime() / 1000);

    return this._sendRequest(params, {
      method: 'track.scrobble',
      timestamp: ts
    }).then(function (response) {
      console.info("Композиция " + params.artist + ": " + params.title + " заскробблена!", response);
      return response;
    });
  };

  LastFmApi.prototype.nowPlaying = function (params) {
    return this._sendRequest(params, {method: 'track.updateNowPlaying'})
      .then(function (response) {
        console.info("Композиция " + params.artist + ": " + params.title + " заскробблена!", response);
        return response;
      });
  };

  LastFmApi.prototype.makeLoved = function (params) {
    return this._sendRequest(params, {method: 'track.love'})
      .then(function (response) {
        console.info("Признана любовь к " + params.artist + ": " + params.title);
        return response;
      });
  };

  LastFmApi.prototype.makeNotLoved = function (params) {
    return this._sendRequest(params, {method: 'track.unlove'})
      .then(function (response) {
        console.info("Утеряна любовь к " + params.artist + ": " + params.title);
        return response;
      });
  };

  LastFmApi.prototype.getTrackInfo = function (params) {

    return this._sendRequest(params, {
      method: 'track.getInfo',
      username: params.userName
    })
      .then(function (response) {
        console.info("Информация о композиции: ", response);
        return response;
      });
  };

  window.LastFmApi = LastFmApi;
})();

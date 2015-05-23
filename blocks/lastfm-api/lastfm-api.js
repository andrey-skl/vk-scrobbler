(function () {
  'use strict';

  var lastFmClient = new LastFMClient(window.vkScrobbler.LastFmApiConfig);

  var extend = function (destination, source) {
    for (var prop in source)
      destination[prop] = source[prop];
    return destination;
  };

  var LastFmApi = function (secretKey, userName) {
    this.secretKey = secretKey;
    this.userName = userName;
  };

  LastFmApi.prototype._sendRequest = function (params, data) {
    return lastFmClient.signedCall('POST', extend({
      artist: params.artist,
      track: params.title,
      sk: this.secretKey
    }, data))
  };

  LastFmApi.prototype.scrobble = function (params) {
    var ts = Math.round(new Date().getTime() / 1000);

    return this._sendRequest(params, {
      method: 'track.scrobble',
      timestamp: ts
    });
  };

  LastFmApi.prototype.nowPlaying = function (params) {
    return this._sendRequest(params, {method: 'track.updateNowPlaying'});
  };

  LastFmApi.prototype.makeLoved = function (params) {
    return this._sendRequest(params, {method: 'track.love'});
  };

  LastFmApi.prototype.makeNotLoved = function (params) {
    return this._sendRequest(params, {method: 'track.unlove'});
  };

  LastFmApi.prototype.getTrackInfo = function (params) {
    return this._sendRequest(params, {
      method: 'track.getInfo',
      username: this.userName
    });
  };

  window.vkScrobbler.LastFmApi = LastFmApi;
})();

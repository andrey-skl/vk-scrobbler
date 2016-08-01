(function () {
  'use strict';

  var md5 = window.md5;
  var log = window.vkScrobbler.log;

  function LastFMClient(options) {
    this.apiKey = options.apiKey || log.e('LastFMClient: apiKey is required');
    this.apiSecret = options.apiSecret || log.e('LastFMClient: apiSecret is required');
    this.apiUrl = options.apiUrl || 'http://ws.audioscrobbler.com/2.0/';
  }

  LastFMClient.prototype._getApiSignature = function (data) {
    var keys = Object.keys(data).sort();
    var nameValueString = keys.reduce(function (prev, key) {
      return prev + key + data[key];
    }, '');
    return md5(nameValueString + this.apiSecret);
  };

  LastFMClient.prototype._formUrlEncode = function (obj) {
    var pairs = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        pairs.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
      }
    }
    return pairs.join("&");
  };

  LastFMClient.prototype._call = function (type, data) {
    data.format = 'json';

    return window.fetch(this.apiUrl, {
        method: type,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: this._formUrlEncode(data)
      })
      .then(function (res) {
        if (res.status >= 200 && res.status < 400) {
          return res.json();
        }
        throw res;
      });
  };

  LastFMClient.prototype._signedCall = function (type, data, callback, context, async) {
    data.api_key = this.apiKey;
    data.api_sig = this._getApiSignature(data);
    return this._call(type, data, callback, context, async);
  };

  LastFMClient.prototype.signedCall = function (type, data, callback, context) {
    return this._signedCall(type, data, callback, context, true);
  };

  LastFMClient.prototype.unsignedCall = function (type, data, callback, context) {
    data.api_key = this.apiKey;
    return this._call(type, data, callback, context, true);
  };

  /**
   * Export
   */
  window.LastFMClient = LastFMClient;
})();

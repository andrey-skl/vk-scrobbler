function LastFMClient(options) {
  this.apiKey = options.apiKey || console.error('LastFMClient: apiKey is required');
  this.apiSecret = options.apiSecret || console.error('LastFMClient: apiSecret is required');
  this.apiUrl = options.apiUrl || 'http://ws.audioscrobbler.com/2.0/';
}

LastFMClient.prototype._getApiSignature = function (data) {
  var keys = Object.keys(data).sort();
  var nameValueString = keys.reduce(function (prev, key) {
    return prev + key + data[key];
  }, '');
  return md5(nameValueString + this.apiSecret);
};

LastFMClient.prototype._formUrlEncode  = function (obj) {
  var pairs = [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      pairs.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
    }
  }
  return pairs.join("&");
};

LastFMClient.prototype._call = function (type, data, callback, context, async) {
  data.format = 'json';

  var request = new XMLHttpRequest();
  request.open(type, this.apiUrl, async);
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

  var promise = new Promise(function(resolve, reject) {
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        callback && callback.call(context, JSON.parse(request.responseText), request);
        resolve(JSON.parse(request.responseText));
      } else {
        reject(request);
        console.error('Something went wrong', request);
      }
    };

    request.onerror = function(res) {
      reject(res);
      console.error('Something went wrong', res);
    };
  });

  var formEncoded = this._formUrlEncode(data);
  request.send(formEncoded);

  return promise;
};


LastFMClient.prototype._signedCall = function (type, data, callback, context, async) {
  data.api_key = this.apiKey;
  data.api_sig = this._getApiSignature(data);
  return this._call(type, data, callback, context, async);
};

LastFMClient.prototype.synchronousSignedCall = function (type, data, callback, context) {
  return this._signedCall(type, data, callback, context, false);
};


LastFMClient.prototype.signedCall = function (type, data, callback, context) {
  return this._signedCall(type, data, callback, context, true);
};

LastFMClient.prototype.unsignedCall = function (type, data, callback, context) {
  data.api_key = this.apiKey;
  return this._call(type, data, callback, context, true);
};

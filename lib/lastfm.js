function LastFMClient(options) {
    this.apiKey = options.apiKey || console.error('LastFMClient: apiKey is required');
    this.apiSecret = options.apiSecret || console.error('LastFMClient: apiSecret is required');
    this.apiUrl = options.apiUrl || 'http://ws.audioscrobbler.com/2.0/';
}


LastFMClient.prototype._getApiSignature = function(data) {
    var keys = Object.keys(data).sort();
    var nameValueString = keys.reduce(function(prev, key) {
        return prev + key + data[key];
    }, '');
    return md5(nameValueString + this.apiSecret);
}


LastFMClient.prototype._call = function(type, data, callback, context, async) {
    data.format = 'json';
    return $.ajax({
        type: type,
        url: this.apiUrl,
        data: data,
        dataType: 'json',
        async: async,
        success: context ? callback.bind(context) : callback,
        error: function(data) {
            console.log('Something went wrong', data);
        }
    });
}


LastFMClient.prototype._signedCall = function(type, data, callback, context, async) {
    data.api_key = this.apiKey;
    data.api_sig = this._getApiSignature(data);
    return this._call(type, data, callback, context, async);
}


LastFMClient.prototype.synchronousSignedCall = function(type, data, callback, context) {
    return this._signedCall(type, data, callback, context, false);
};


LastFMClient.prototype.signedCall = function(type, data, callback, context) {
    return this._signedCall(type, data, callback, context, true);
};


LastFMClient.prototype.unsignedCall = function(type, data, callback, context) {
    data.api_key = this.apiKey;
    return this._call(type, data, callback, context, true);
}

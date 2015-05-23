describe('Last FM API client', function () {
  var lastFmClient = new LastFMClient(window.LastFmApiConfig);

  beforeEach(function () {
    this.xhr = sinon.useFakeXMLHttpRequest();
    var requests = this.requests = [];

    this.xhr.onCreate = function (xhr) {
      requests.push(xhr);
    };

    this.getLastRequest = function () {
      return requests[requests.length - 1];
    };
  });

  afterEach(function () {
    this.xhr.restore();
  });

  it('Should init', function () {
    lastFmClient.should.been.defined;
  });

  it('Should send http requests', function () {
    lastFmClient.signedCall('POST', {test: 'foo'});
    this.getLastRequest().should.been.defined;
  });

  it('Should send http requests with provided METHOD', function () {
    lastFmClient.signedCall('GET', {test: 'foo'});
    this.getLastRequest().method.should.be.equal('GET');
  });

  it('Should return promise', function () {
    var promise = lastFmClient.signedCall('GET', {test: 'foo'});
    promise.should.be.instanceOf(Promise);
  });

  it('Should correctly convert object to url encoded data', function () {
    var encoded = lastFmClient._formUrlEncode({foo: 'bar', num: 123});
    encoded.should.be.equal('foo=bar&num=123');
  });

  it('Should send URL encoded data', function () {
    var promise = lastFmClient.signedCall('POST', {test: 'foo'});
    this.getLastRequest().requestBody.should.contain('test=foo&');
  });

  it('Should resolve promise in case of success response', function (done) {
    var promise = lastFmClient.signedCall('POST', {test: 'foo'});

    promise.then(function (res) {
      res.bar.should.be.equal('test');
      done();
    });
    this.getLastRequest().respond(200, {"Content-Type": "application/json"}, JSON.stringify({bar: 'test'}));
  });

  it('Should reject promise in case of error code response', function (done) {

    lastFmClient.signedCall('POST', {test: 'foo'}).then(null, function (xhr) {
      xhr.responseText.should.be.equal('{"bar":"test"}');
      done();
    });

    this.getLastRequest().respond(503, {"Content-Type": "application/json"}, JSON.stringify({bar: 'test'}));
  });

});

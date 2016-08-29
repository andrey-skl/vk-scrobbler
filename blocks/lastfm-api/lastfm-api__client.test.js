describe('Last FM API client', function () {
  const lastFmClient = new window.LastFMClient(window.vkScrobbler.LastFmApiConfig);

  beforeEach(function () {
    const requests = this.requests = [];

    sinon.stub(window, 'fetch', function(url, options) {
      return new Promise(function(resolve, reject) {
        requests.push({
          url: url,
          options: options,
          requestBody: options.body,
          resolve: resolve,
          reject: reject
        });
      });
    });

    this.getLastRequest = function () {
      return requests[requests.length - 1];
    };
  });

  afterEach(function () {
    window.fetch.restore();
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
    this.getLastRequest().options.method.should.be.equal('GET');
  });

  it('Should return promise', function () {
    const promise = lastFmClient.signedCall('GET', {test: 'foo'});
    promise.should.be.instanceOf(Promise);
  });

  it('Should correctly convert object to url encoded data', function () {
    const encoded = lastFmClient._formUrlEncode({foo: 'bar', num: 123});
    encoded.should.be.equal('foo=bar&num=123');
  });

  it('Should send URL encoded data', function () {
    lastFmClient.signedCall('POST', {test: 'foo'});
    this.getLastRequest().requestBody.should.contain('test=foo&');
  });

  it('Should resolve promise in case of success response', function (done) {
    const promise = lastFmClient.signedCall('POST', {test: 'foo'});

    promise.then(function (res) {
      res.bar.should.be.equal('test');
      done();
    });

    this.getLastRequest().resolve({
      status: 200,
      json: function() {
        return {bar: 'test'};
      }
    });
  });

  it('Should reject promise in case of error code response', function (done) {

    lastFmClient.signedCall('POST', {test: 'foo'}).catch(function (error) {
      error.status.should.be.equal(503);
      done();
    });

    this.getLastRequest().resolve({
      status: 503
    });
  });

});

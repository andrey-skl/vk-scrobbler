describe('API client', function () {
  var api = window.LastFmApi;

  var fakeParams = {
    artist: 'Foo',
    title: 'Bar',
    key: 'key'
  };

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

  it('should provide API config', function () {
    window.LastFmApiConfig.should.been.defined;
  });

  it('should provice API', function () {
    api.should.been.defined;
  });

  describe('Scrobble request', function () {

    beforeEach(function () {
      api.scrobble(fakeParams);
    });

    it('Should send correct method', function () {
      this.getLastRequest().requestBody.should.contain('method=track.scrobble');
    });

    it('Should send format', function () {
      this.getLastRequest().requestBody.should.contain('format=json');
    });

    it('Should send artist', function () {
      this.getLastRequest().requestBody.should.contain('artist=Foo');
    });

    it('Should send track', function () {
      this.getLastRequest().requestBody.should.contain('track=Bar');
    });

    it('Should send api key', function () {
      this.getLastRequest().requestBody.should.contain('api_key=' + window.LastFmApiConfig.apiKey);
    });

    it('Should send timestamp', function () {
      var timeStamp = Math.round(new Date().getTime() / 1000);
      this.getLastRequest().requestBody.should.contain('timestamp=' + timeStamp);
    });
  });

});

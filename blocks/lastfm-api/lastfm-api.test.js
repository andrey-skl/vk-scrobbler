describe('API client', function () {
  var api = new window.LastFmApi('key');

  var fakeParams = {
    artist: 'Foo',
    title: 'Bar',
    userName: 'testUser'
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

    it('Should send secret key', function () {
      this.getLastRequest().requestBody.should.contain('sk=key');
    });

    it('Should send api key', function () {
      this.getLastRequest().requestBody.should.contain('api_key=' + window.LastFmApiConfig.apiKey);
    });

    it('Should send timestamp', function () {
      var timeStamp = Math.round(new Date().getTime() / 1000);
      this.getLastRequest().requestBody.should.contain('timestamp=' + timeStamp);
    });
  });

  describe('Now playing request', function () {

    beforeEach(function () {
      api.nowPlaying(fakeParams);
    });

    it('Should send correct method', function () {
      this.getLastRequest().requestBody.should.contain('method=track.updateNowPlaying');
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
  });

  describe('makeLoved request', function () {

    beforeEach(function () {
      api.makeLoved(fakeParams);
    });

    it('Should send correct method', function () {
      this.getLastRequest().requestBody.should.contain('track.love');
    });

    it('Should send artist', function () {
      this.getLastRequest().requestBody.should.contain('artist=Foo');
    });

    it('Should send track', function () {
      this.getLastRequest().requestBody.should.contain('track=Bar');
    });
  });

  describe('makeNotLoved request', function () {

    beforeEach(function () {
      api.makeNotLoved(fakeParams);
    });

    it('Should send correct method', function () {
      this.getLastRequest().requestBody.should.contain('track.unlove');
    });

    it('Should send artist', function () {
      this.getLastRequest().requestBody.should.contain('artist=Foo');
    });

    it('Should send track', function () {
      this.getLastRequest().requestBody.should.contain('track=Bar');
    });
  });

  describe('getTrackInfo request', function () {
    var promise;

    beforeEach(function () {
      promise = api.getTrackInfo(fakeParams);
    });

    it('Should send correct method', function () {
      this.getLastRequest().requestBody.should.contain('track.getInfo');
    });

    it('Should send artist', function () {
      this.getLastRequest().requestBody.should.contain('artist=Foo');
    });

    it('Should send track', function () {
      this.getLastRequest().requestBody.should.contain('track=Bar');
    });

    it('Should send username', function () {
      this.getLastRequest().requestBody.should.contain('username=testUser');
    });

    it('Should return response', function (done) {
      var fakeResponse = {
        track: {
          artist: 'testArtist',
          userloved: '1'
        }
      };

      promise.then(function (result) {
        result.track.artist.should.be.equal('testArtist');
        result.track.userloved.should.be.equal('1');
        done();
      });

      this.getLastRequest().respond(200, {"Content-Type": "application/json"}, JSON.stringify(fakeResponse));
    });
  });

});

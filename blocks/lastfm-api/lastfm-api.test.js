describe('Last FM api', function () {
  var api = new window.vkScrobbler.LastFmApi('key', 'testUser');

  var fakeParams = {
    artist: 'Foo',
    title: 'Bar'
  };

  beforeEach(function () {
    var requests = this.requests = [];

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

  it('should provide API config', function () {
    window.vkScrobbler.LastFmApiConfig.should.been.defined;
  });

  it('should provice API', function () {
    api.should.been.defined;
  });

  describe('Scrobble request', function () {

    beforeEach(function () {
      api.scrobble(fakeParams);
    });

    it('Should return promise', function () {
      var promise = api.scrobble(fakeParams);
      promise.should.be.instanceOf(Promise);
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
      this.getLastRequest().requestBody.should.contain('api_key=' + window.vkScrobbler.LastFmApiConfig.apiKey);
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
      this.getLastRequest().requestBody.should.contain('api_key=' + window.vkScrobbler.LastFmApiConfig.apiKey);
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

      this.getLastRequest().resolve({
        status: 200,
        json: function() {
          return fakeResponse;
        }
      });
    });
  });

});

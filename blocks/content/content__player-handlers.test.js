describe('Content PlayerHandlers', function () {
  var Indicators = window.vkScrobbler.Indicators;
  var PlayerHandlers = window.vkScrobbler.PlayerHandlers;
  var handlers;

  //To make bus__content work
  beforeEach(function () {
    var fakePort = {
      onMessage: {
        addListener: sinon.stub()
      }
    };

    chrome.runtime.connect.returns(fakePort);
  });

  beforeEach(function () {
    this.sinon = sinon.sandbox.create();
    handlers = new PlayerHandlers();
  });

  afterEach(function () {
    this.sinon.restore();
  });

  describe('Initialization', function () {
    it('Should initialize', function () {
      handlers.should.be.defined;
    });

    it('Should initialize state', function () {
      handlers.state.should.be.deep.equal({
        enabled: true,
        playing: false,
        scrobbled: false,
        scrobbling: false,

        artist: null,
        track: null,

        nowPlayingSendTimeStamp: null,
        playTimeStamp: null,
        playedTime: 0
      });
    });

    it('Should set indicators listeners on initialize', function () {
      this.sinon.stub(PlayerHandlers.prototype, 'setUpIndicatorsListeners');
      handlers = new PlayerHandlers();
      handlers.setUpIndicatorsListeners.should.have.been.called;
    });
  });

  describe('Progress', function () {
    it('Should call sendNowPlayingIfNeeded every time', function () {
      this.sinon.stub(handlers, 'sendNowPlayingIfNeeded');
      handlers.playStart({});
      handlers.progress({current: 10, total: 20});
      handlers.sendNowPlayingIfNeeded.should.have.been.called;
    });

    it('Should not handle progress call when state.playing = false (before playStart)', function () {
      this.sinon.stub(handlers, 'sendNowPlayingIfNeeded');

      handlers.progress({current: 10, total: 20});
      handlers.sendNowPlayingIfNeeded.should.not.have.been.called;
    });

    it('Should not handle progress call when state.playing = false (after pause/stop)', function () {
      this.sinon.stub(handlers, 'sendNowPlayingIfNeeded');
      handlers.playStart({});

      handlers.pause();
      handlers.progress({current: 10, total: 20});
      handlers.sendNowPlayingIfNeeded.should.not.have.been.called;
    });

    it('Should calculate percentage and send it to scrobbleIfNeeded', function () {
      var total = 20;
      var half = total / 2;
      this.sinon.stub(Date, 'now').returns(33333);
      this.sinon.stub(handlers, 'scrobbleIfNeeded');
      handlers.playStart({});

      //Emulate that now 5 seconds is stored and 5 passed from last progress call
      handlers.state.playedTime = half/2;
      handlers.state.playTimeStamp = 33333 - half/2 * 1000;

      handlers.progress({total: total});
      handlers.scrobbleIfNeeded.should.have.been.calledWith(50);
    });

    it('Should not scrobble track when pause one and go to another after big time (calls order from windows, #2 issue)', function () {
      this.sinon.stub(handlers.busWrapper, 'sendScrobleRequest').returns({then: function(){}});
      this.sinon.stub(Date, 'now').returns(33333);

      //Start first track and payuse
      handlers.playStart({artist: 'foo', title: 'bar'});
      handlers.progress({current: 0, total: 100});
      handlers.pause();
      handlers.progress({current: 0, total: 100});

      //handlers.resume();
      Date.now.restore();
      handlers.progress({current: 0, total: 100});

      handlers.busWrapper.sendScrobleRequest.should.not.have.been.called;
    });
  });

  describe('pause/resume/stop', function () {

    it('Should turn off "playing" flag on pause', function () {
      handlers.state.playing = true;
      handlers.pause();
      handlers.state.playing.should.be.false;
    });

    it('Should indicate scrobbled if scrobbled on pause', function () {
      this.sinon.stub(Indicators, 'indicateScrobbled');
      handlers.state.scrobbled = true;
      handlers.pause();
      Indicators.indicateScrobbled.should.have.been.called;
    });

    it('Should indicate pause if not scrobbled on pause', function () {
      this.sinon.stub(Indicators, 'indicateVKscrobbler');
      handlers.state.scrobbled = false;
      handlers.pause();
      Indicators.indicateVKscrobbler.should.have.been.called;
    });

    it('Should clear playTimeStamp on pause', function () {
      this.sinon.stub(Indicators, 'indicateVKscrobbler');
      handlers.state.playTimeStamp = 12341234;
      handlers.pause();
      expect(handlers.state.playTimeStamp).to.be.null;
    });

    it('Should turn on "playing" flag on resume', function () {
      handlers.state.playing = false;
      handlers.resume();
      handlers.state.playing.should.be.true;
    });

    it('Should indicate scrobbled if scrobbled on resume', function () {
      this.sinon.stub(Indicators, 'indicateScrobbled');
      handlers.state.scrobbled = true;
      handlers.resume();
      Indicators.indicateScrobbled.should.have.been.called;
    });

    it('Should indicate playing if not scrobbled on resume', function () {
      this.sinon.stub(Indicators, 'indicatePlayNow');
      handlers.state.scrobbled = false;
      handlers.resume();
      Indicators.indicatePlayNow.should.have.been.called;
    });

    it('Should turn off "playing" flag on stop', function () {
      handlers.state.playing = true;
      handlers.stop();
      handlers.state.playing.should.be.false;
    });

    it('Should indicate playing if not scrobbled on resume', function () {
      this.sinon.stub(Indicators, 'indicateVKscrobbler');
      handlers.stop();
      Indicators.indicateVKscrobbler.should.have.been.called;
    });
  });

  describe('playStart', function () {
    it('Should reset state', function () {
      handlers.playStart({});

      handlers.state.scrobbled.should.be.false;
      handlers.state.playing.should.be.true;
      handlers.state.playedTime.should.be.equal(0);
      expect(handlers.state.nowPlayingSendTimeStamp).to.be.null;
    });

    it('Should store artist and track in state', function () {
      handlers.playStart({artist: 'foo', title: 'bar'});
      handlers.state.artist.should.be.equal('foo');
      handlers.state.track.should.be.equal('bar');
    });

    it('Should save playTimeStamp', function () {
      this.sinon.stub(Date, 'now').returns(123);
      handlers.playStart({});
      handlers.state.playTimeStamp.should.be.equal(123);
    });

    it('Should indicate playing', function () {
      this.sinon.stub(Indicators, 'indicatePlayNow');
      handlers.playStart({});
      Indicators.indicatePlayNow.should.have.been.called;
    });

    it('Should set twitter link', function () {
      this.sinon.stub(Indicators, 'setTwitButtonHref');
      handlers.playStart({artist: 'foo', title: 'bar'});
      Indicators.setTwitButtonHref.should.have.been.called;
    });

    it('Should request track love information', function () {
      this.sinon.stub(handlers, 'checkTrackLove');
      handlers.playStart({artist: 'foo', title: 'bar'});
      handlers.checkTrackLove.should.have.been.calledWith('foo', 'bar');
    });

    it('Should indicate track love if track is loved', function () {
      this.sinon.stub(Indicators, 'indicateLoved');
      this.sinon.stub(handlers.busWrapper, 'getTrackInfoRequest').returns({then: function(callback){
        callback({track: {userloved: '1'}});
      }});
      handlers.state.artist = 'foo';
      handlers.state.track = 'bar';

      handlers.checkTrackLove('foo', 'bar');
      Indicators.indicateLoved.should.have.been.called;
    });

    it('Should not indicate track love if track is changed while performing request', function () {
      var callback;
      this.sinon.stub(Indicators, 'indicateLoved');
      this.sinon.stub(handlers.busWrapper, 'getTrackInfoRequest').returns({then: function(cb){
        callback = cb;
      }});
      handlers.state.artist = 'foo';
      handlers.state.track = 'bar';
      handlers.checkTrackLove('foo', 'bar');
      handlers.state.track = 'other';
      callback({track: {userloved: '1'}});

      Indicators.indicateLoved.should.not.have.been.called;
    });
  });

  describe('scrobbleIfNeeded', function () {
    it('Should not scrobble, if not enabled', function () {
      this.sinon.stub(handlers.busWrapper, 'sendScrobleRequest');

      handlers.state.enabled = false;
      handlers.state.scrobbled = false;
      handlers.state.scrobbling = false;

      handlers.scrobbleIfNeeded(90);
      handlers.busWrapper.sendScrobleRequest.should.not.have.been.called;
    });

    it('Should not scrobble, if percentage < 50', function () {
      this.sinon.stub(handlers.busWrapper, 'sendScrobleRequest');
      handlers.scrobbleIfNeeded(49);
      handlers.busWrapper.sendScrobleRequest.should.not.have.been.called;
    });

    it('Should scrobble, if percentage > 50', function () {
      this.sinon.stub(handlers.busWrapper, 'sendScrobleRequest').returns({then: function(){}});
      handlers.scrobbleIfNeeded(51);
      handlers.busWrapper.sendScrobleRequest.should.have.been.called;
    });

    it('Should set scrobbling flag while scrobbling', function () {
      this.sinon.stub(handlers.busWrapper, 'sendScrobleRequest').returns({then: function(){}});
      handlers.scrobbleIfNeeded(51);
      handlers.state.scrobbling.should.be.true;
    });

    it('Should update state after success scrobbling', function () {
      this.sinon.stub(handlers.busWrapper, 'sendScrobleRequest').returns({then: function(callback){
        callback();
      }});
      handlers.scrobbleIfNeeded(51);
      handlers.state.scrobbling.should.be.false;
      handlers.state.scrobbled.should.be.true;
    });

    it('Should indicate scrobbled after successfull scrobble', function () {
      this.sinon.stub(Indicators, 'indicateScrobbled');
      this.sinon.stub(handlers.busWrapper, 'sendScrobleRequest').returns({then: function(callback){
        callback();
      }});
      handlers.scrobbleIfNeeded(51);
      Indicators.indicateScrobbled.should.have.been.called;
    });
  });
});

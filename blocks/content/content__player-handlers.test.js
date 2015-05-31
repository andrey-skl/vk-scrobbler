describe.only('Content PlayerHandlers', function () {
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
      handlers.progress({current: 10, total: 20});
      handlers.sendNowPlayingIfNeeded.should.have.been.called;
    });

    it('Should calculate percentage and send it to scrobbleIfNeeded', function () {
      var total = 20;
      var half = total / 2;
      this.sinon.stub(handlers, 'scrobbleIfNeeded');

      //Emulate that now 5 seconds is stored and 5 passed from last progress call
      handlers.state.playedTime = half/2;
      handlers.state.playTimeStamp = Date.now() - half/2 * 1000;

      handlers.progress({total: total});
      handlers.scrobbleIfNeeded.should.have.been.calledWith(50);
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
  });
});

describe('Vk-inner player', function () {
  'use strict';
  var ARTIST_NUM = 4;
  var TITLE_NUM = 3;
  var TOTAL_NUM = 5;
  var patcher;
  var PlayerListener = window.vkScrobbler.PlayerListener;

  beforeEach(function () {
    this.sinon = sinon.sandbox.create();
    this.sinon.stub(PlayerListener.prototype, 'waitForPlayerAndSubscribe');
    patcher = new PlayerListener();

    this.sinon.stub(window, 'postMessage');
  });

  afterEach(function () {
    this.sinon.restore();
  });

  it('Should init with chrome extension id', function () {
    patcher.should.been.defined;
  });

  it('Send message should send message to extension', function () {
    patcher.sendMessage({foo: 'bar'});
    window.postMessage.should.have.been.calledWith({vkPlayerPatcherMessage: true, message: {foo: 'bar'}});
  });

  describe('player patching', function () {
    describe('waiting and patching window.ap (audioPlayer)', function () {
      beforeEach(function () {
        PlayerListener.prototype.waitForPlayerAndSubscribe.restore();
        this.clock = this.sinon.useFakeTimers();
      });

      it('Should wait for ap in window and patch it', function () {
        var p = new PlayerListener();
        p.subscribeToPlayerEvents = this.sinon.stub();

        this.clock.tick(10000);

        window.ap = {b: 'foo', subscribers: []};

        this.clock.tick(1000);

        p.subscribeToPlayerEvents.should.have.been.calledWith(window.ap);
      });

      it('Should no try to patch ap while it not exist on page', function () {
        var p = new PlayerListener();
        p.subscribeToPlayerEvents = this.sinon.stub();
        this.clock.tick(10000);
        p.subscribeToPlayerEvents.should.not.have.been.calledWith({b: 'foo'});
      });

      it('should add subscribers', function () {
        var p = new PlayerListener();

        var fakePlayer = {
          subscribers: []
        };

        p.subscribeToPlayerEvents(fakePlayer);

        fakePlayer.subscribers.length.should.equal(4);
      });
    });

  });

  describe('Player listeners', function () {
    beforeEach(function () {
      this.sinon.stub(patcher, 'sendMessage');
    });

    it('Should send correct message on progress', function () {
      patcher.audioPlayer = {
        _currentAudio: []
      };
      patcher.audioPlayer._currentAudio[TOTAL_NUM] = 20;

      patcher.onProgress(patcher.audioPlayer._currentAudio, 0.5);
      patcher.sendMessage.should.have.been.calledWith({message: 'progress', data: {current: 10, total: 20}});
    });

    it('Should send correct message on pause', function () {
      patcher.onPause();
      patcher.sendMessage.should.have.been.calledWith({message: 'pause'});
    });

    it('Should send correct message on resume', function () {
      patcher.onResume();
      patcher.sendMessage.should.have.been.calledWith({message: 'resume'});
    });

    it('Should send correct message on stop', function () {
      patcher.onStop();
      patcher.sendMessage.should.have.been.calledWith({message: 'stop'});
    });

    it('Should send correct message on start playing ', function () {
      patcher.audioPlayer = {_currentAudio: []};
      patcher.audioPlayer._currentAudio[ARTIST_NUM] = 'foo';
      patcher.audioPlayer._currentAudio[TITLE_NUM] = 'bar';

      patcher.onPlayStart(patcher.audioPlayer._currentAudio, true);
      patcher.sendMessage.should.have.been.calledWith({
        message: 'playStart', data: {
          artist: 'foo',
          title: 'bar'
        }
      });
    });

    it('Should send resume message onPlayStart if new song flag is not passed', function () {
      patcher.onPlayStart({}, false);
      patcher.sendMessage.should.have.been.calledWith({message: 'resume'});
    });

    it('Should decode html entities from artist and track', function () {
      patcher.audioPlayer = {_currentAudio: []};
      patcher.audioPlayer._currentAudio[ARTIST_NUM] = 'foo &amp; &lt; &quot; &plusmn; &deg;';
      patcher.audioPlayer._currentAudio[TITLE_NUM] = 'bar &amp;&copy;';

      patcher.onPlayStart(patcher.audioPlayer._currentAudio, true);
      patcher.sendMessage.should.have.been.calledWith({
        message: 'playStart', data: {
          artist: 'foo & < " ± °',
          title: 'bar &©'
        }
      });
    });
  });
});

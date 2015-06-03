describe('Vk-inner player', function () {
  'use strict';
  var ARTIST_NUM = 5;
  var TITLE_NUM = 6;
  var patcher;
  var PlayerPatcher = window.vkScrobbler.PlayerPatcher;

  beforeEach(function () {
    this.sinon = sinon.sandbox.create();
    this.sinon.stub(PlayerPatcher.prototype, 'waitForPlayerAndPatch');
    patcher = new PlayerPatcher();

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

  describe('callListener', function () {
    var method;
    var handler;
    var fakeObj = {};

    beforeEach(function () {
      method = this.sinon.stub();
      fakeObj.method = method;
    });

    beforeEach(function () {
      handler = {
        before: this.sinon.stub(),
        after: this.sinon.stub()
      };
      PlayerPatcher.addCallListener(fakeObj, 'method', handler);
    });

    it('Should pass call to original', function () {
      fakeObj.method('foo', {bar: 'test'});

      method.should.have.been.calledWith('foo', {bar: 'test'});
    });

    it('Should call "after" handler', function () {
      fakeObj.method('foo', {bar: 'test'});

      handler.after.should.have.been.calledWith('foo', {bar: 'test'});
    });

    it('Should call "before" handler', function () {
      fakeObj.method('foo', {bar: 'test'});

      handler.before.should.have.been.calledWith('foo', {bar: 'test'});
    });

    it('Should not miss function call result', function () {
      method.returns('res');
      var result = fakeObj.method();
      result.should.be.equal('res');
    });

    it('Should support function passing and call it before', function () {
      fakeObj.method = method;
      var before = this.sinon.stub();
      PlayerPatcher.addCallListener(fakeObj, 'method', before);
      fakeObj.method('foo', {bar: 'test'});

      before.should.have.been.calledWith('foo', {bar: 'test'});
    });
  });

  describe('player patching', function () {
    var fakePlayer;

    beforeEach(function () {
      fakePlayer = {
        onPlayProgress: this.sinon.stub(),
        stop: this.sinon.stub(),
        playback: this.sinon.stub(),
        operate: this.sinon.stub(),
        loadGlobal: this.sinon.stub()
      };
    });

    it('Should patch audioPlayer methods', function () {
      patcher.patchAudioPlayer(fakePlayer);

      fakePlayer.onPlayProgress.name.should.be.equal('callHandler');
      fakePlayer.stop.name.should.be.equal('callHandler');
      fakePlayer.playback.name.should.be.equal('callHandler');
      fakePlayer.operate.name.should.be.equal('callHandler');
      fakePlayer.loadGlobal.name.should.be.equal('callHandler');
    });

    it('Sould call progress listener on progress', function () {
      this.sinon.stub(patcher, 'onProgress');

      patcher.patchAudioPlayer(fakePlayer);

      fakePlayer.onPlayProgress(10, 20);
      patcher.onProgress.should.have.been.calledWith(10, 20);
    });

    it('Sould call onPause listener on pause', function () {
      this.sinon.stub(patcher, 'onPause');

      patcher.patchAudioPlayer(fakePlayer);

      fakePlayer.playback(true);
      patcher.onPause.should.have.been.called;
    });

    it('Sould call onResume listener on resume', function () {
      this.sinon.stub(patcher, 'onResume');

      patcher.patchAudioPlayer(fakePlayer);

      fakePlayer.playback();
      patcher.onResume.should.have.been.called;
    });

    it('Sould call onStop listener on stop', function () {
      this.sinon.stub(patcher, 'onStop');

      patcher.patchAudioPlayer(fakePlayer);

      fakePlayer.stop();
      patcher.onStop.should.have.been.called;
    });

    it('Should set isOperating while audioPlayer.operate function is calling', function () {
      var setter = this.sinon.stub();
      Object.defineProperty(patcher, 'isOperating', {set: setter});

      patcher.patchAudioPlayer(fakePlayer);

      fakePlayer.operate();

      setter.should.have.been.calledTwice;
    });

    it('Should call onPlayStart on start playing new track', function () {
      this.sinon.stub(patcher, 'onPlayStart');

      patcher.patchAudioPlayer(fakePlayer);

      patcher.isOperating = true;

      fakePlayer.loadGlobal();

      patcher.onPlayStart.should.have.been.called;
    });

    it('Should not call onPlayStart on calling loadGlobal not from audioPlayer.operate', function () {
      this.sinon.stub(patcher, 'onPlayStart');

      patcher.patchAudioPlayer(fakePlayer);

      patcher.isOperating = false;

      fakePlayer.loadGlobal();

      patcher.onPlayStart.should.not.have.been.called;
    });

    describe('waiting and patching window.audioPlayer', function () {
      beforeEach(function () {
        PlayerPatcher.prototype.waitForPlayerAndPatch.restore();
        this.clock = this.sinon.useFakeTimers();
      });

      it('Should wait for audioPLayer in window and patch it', function () {
        var p = new PlayerPatcher();
        p.patchAudioPlayer = this.sinon.stub();

        this.clock.tick(10000);

        window.audioPlayer = {b: 'foo'};

        this.clock.tick(1000);

        p.patchAudioPlayer.should.have.been.calledWith({b: 'foo'});
      });

      it('Should no try to patch audioPlayer while it not exist on page', function () {
        var p = new PlayerPatcher();
        p.patchAudioPlayer = this.sinon.stub();
        this.clock.tick(10000);
        p.patchAudioPlayer.should.not.have.been.calledWith({b: 'foo'});
      });
    });

  });

  describe('Player listeners', function () {
    beforeEach(function () {
      this.sinon.stub(patcher, 'sendMessage');
    });

    it('Should send correct message on progress', function () {
      patcher.onProgress(10, 20);
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
      patcher.audioPlayer = {lastSong: []};
      patcher.audioPlayer.lastSong[ARTIST_NUM] = 'foo';
      patcher.audioPlayer.lastSong[TITLE_NUM] = 'bar';

      patcher.onPlayStart();
      patcher.sendMessage.should.have.been.calledWith({
        message: 'playStart', data: {
          artist: 'foo',
          title: 'bar'
        }
      });
    });

    it('Should decode html entities from artist and track', function () {
      patcher.audioPlayer = {lastSong: []};
      patcher.audioPlayer.lastSong[ARTIST_NUM] = 'foo &amp; &lt; &quot; &plusmn; &deg;';
      patcher.audioPlayer.lastSong[TITLE_NUM] = 'bar &amp;&copy;';

      patcher.onPlayStart();
      patcher.sendMessage.should.have.been.calledWith({
        message: 'playStart', data: {
          artist: 'foo & < " ± °',
          title: 'bar &©'
        }
      });
    });
  });
});

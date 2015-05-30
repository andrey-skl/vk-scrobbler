describe('Vk-inner player', function () {
  'use strict';
  var patcher;
  var PlayerPatcher = window.vkScrobbler.PlayerPatcher;

  beforeEach(function () {
    patcher = new PlayerPatcher('fakeId');
  });

  afterEach(function () {
    chrome.runtime.sendMessage.reset();
  });

  it('Should init with chrome extension id', function () {
    patcher.should.been.defined;
  });

  it('Send message should send message to extension', function () {
    patcher.sendMessage({foo: 'bar'});
    chrome.runtime.sendMessage.should.have.been.calledWith('fakeId', {foo: 'bar'});
  });

  describe('callListener', function () {
    var method;
    var handler;
    var fakeObj = {};

    beforeEach(function () {
      method = sinon.stub();
      fakeObj.method = method;
    });

    beforeEach(function () {
      handler = {
        before: sinon.stub(),
        after: sinon.stub()
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
  });

  describe('player patching', function () {
    var fakePlayer;

    beforeEach(function () {
      fakePlayer = {
        onPlayProgress: sinon.stub(),
        stop: sinon.stub(),
        playback: sinon.stub(),
        operate: sinon.stub,
        loadGlobal: sinon.stub()
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
      sinon.stub(patcher, 'onProgress');

      patcher.patchAudioPlayer(fakePlayer);

      fakePlayer.onPlayProgress(10, 20);
      patcher.onProgress.should.have.been.calledWith(10, 20);
    });

    it('Sould call onPause listener on pause', function () {
      sinon.stub(patcher, 'onPause');

      patcher.patchAudioPlayer(fakePlayer);

      fakePlayer.playback(true);
      patcher.onPause.should.have.been.called;
    });

    it('Sould call onResume listener on resume', function () {
      sinon.stub(patcher, 'onResume');

      patcher.patchAudioPlayer(fakePlayer);

      fakePlayer.playback();
      patcher.onResume.should.have.been.called;
    });

    it('Sould call onStop listener on stop', function () {
      sinon.stub(patcher, 'onStop');

      patcher.patchAudioPlayer(fakePlayer);

      fakePlayer.stop();
      patcher.onStop.should.have.been.called;
    });

    it('Should set isOperating while audioPlayer.operate function is calling', function () {
      var setter = sinon.stub();
      Object.defineProperty(patcher, 'isOperating', {set: setter});

      patcher.patchAudioPlayer(fakePlayer);

      fakePlayer.operate();

      setter.should.have.been.calledTwice;
    });

    it('Should call onPlayNew on start playing new track', function () {
      sinon.stub(patcher, 'onPlayNew');

      patcher.patchAudioPlayer(fakePlayer);

      patcher.isOperating = true;

      fakePlayer.loadGlobal();

      patcher.onPlayNew.should.have.been.called;
    });

    it('Should not call onPlayNew on calling loadGlobal not from audioPlayer.operate', function () {
      sinon.stub(patcher, 'onPlayNew');

      patcher.patchAudioPlayer(fakePlayer);

      patcher.isOperating = false;

      fakePlayer.loadGlobal();

      patcher.onPlayNew.should.not.have.been.called;
    });

  });
});

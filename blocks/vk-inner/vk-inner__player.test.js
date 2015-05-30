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
  });
});

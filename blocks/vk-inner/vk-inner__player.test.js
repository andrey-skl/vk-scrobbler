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
});

describe('Content BUS', function () {
  var MSG = window.vkScrobbler.contentMessages;
  var bus = window.vkScrobbler.ContentBus;

  var fakeArtist = 'bar';
  var fakeTrack = 'foo';

  afterEach(function () {
    //chrome API methods already stubbed via sinon-chrome
    chrome.runtime.sendMessage.reset();
  });

  it('Should export interface', function () {
    bus.should.been.defined;
  });

  it('Should send scrobble request', function () {
    bus.sendScrobleRequest(fakeArtist, fakeTrack);
    chrome.runtime.sendMessage.should.been.calledWith({ artist: fakeArtist, message: MSG.NEED_SCROOBLE, title: fakeTrack });
  });

  it('Should send now playing request', function () {
    bus.sendNowPlayingRequest(fakeArtist, fakeTrack);
    chrome.runtime.sendMessage.should.been.calledWith({ artist: fakeArtist, message: MSG.NOW_PLAYING, title: fakeTrack });
  });

  it('Should send pause request', function () {
    bus.sendPauseStatus(fakeArtist, fakeTrack, true);
    chrome.runtime.sendMessage.should.been.calledWith({ artist: fakeArtist, message: MSG.TOGGLE_PAUSE, paused: true, title: fakeTrack });
  });

  it('Should send love request', function () {
    bus.sendNeedLove(fakeArtist, fakeTrack);
    chrome.runtime.sendMessage.should.been.calledWith({ artist: fakeArtist, message: MSG.NEED_LOVE, title: fakeTrack });
  });

  it('Should send unlove request', function () {
    bus.sendUnlove(fakeArtist, fakeTrack);
    chrome.runtime.sendMessage.should.been.calledWith({ artist: fakeArtist, message: MSG.NOT_NEED_LOVE, title: fakeTrack });
  });

  it('Should send track info request', function () {
    bus.getTrackInfoRequest(fakeArtist, fakeTrack);
    chrome.runtime.sendMessage.should.been.calledWith({ artist: fakeArtist, message: MSG.GET_TRACK_INFO, title: fakeTrack });
  });

  it('Should get track info request', function (done) {
    var promise = bus.getTrackInfoRequest(fakeArtist, fakeTrack);
    promise.then(function (response) {
      response.track.should.been.defined;
      done();
    });

    var onResponseCallback = chrome.runtime.sendMessage.firstCall.args[1];
    onResponseCallback({track: {}});
  });
});

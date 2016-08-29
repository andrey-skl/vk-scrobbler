describe('Content BUS', function () {
  const MSG = window.vkScrobbler.contentMessages;
  const BusContent = window.vkScrobbler.BusContent;
  const BusWrapper = window.vkScrobbler.ContentBusWrapper;

  let wrapper;

  const fakeArtist = 'bar';
  const fakeTrack = 'foo';

  beforeEach(function () {
    BusContent.prototype.sendMessage = sinon.stub();
    wrapper = new BusWrapper();
  });

  afterEach(function () {
    BusContent.prototype.sendMessage.reset();
  });

  it('Should export interface', function () {
    wrapper.should.been.defined;
  });

  it('Should send scrobble request', function () {
    wrapper.sendScrobleRequest(fakeArtist, fakeTrack);
    BusContent.prototype.sendMessage.should.been.calledWith(MSG.NEED_SCROOBLE, { artist: fakeArtist, title: fakeTrack });
  });

  it('Should send now playing request', function () {
    wrapper.sendNowPlayingRequest(fakeArtist, fakeTrack);
    BusContent.prototype.sendMessage.should.been.calledWith(MSG.NOW_PLAYING, { artist: fakeArtist, title: fakeTrack });
  });

  it('Should send pause request', function () {
    wrapper.sendPauseStatus(fakeArtist, fakeTrack, true);
    BusContent.prototype.sendMessage.should.been.calledWith(MSG.TOGGLE_PAUSE, { artist: fakeArtist, title: fakeTrack, paused: true });
  });

  it('Should send love request', function () {
    wrapper.sendNeedLove(fakeArtist, fakeTrack);
    BusContent.prototype.sendMessage.should.been.calledWith(MSG.NEED_LOVE, { artist: fakeArtist, title: fakeTrack});
  });

  it('Should send unlove request', function () {
    wrapper.sendUnlove(fakeArtist, fakeTrack);
    BusContent.prototype.sendMessage.should.been.calledWith(MSG.NOT_NEED_LOVE, { artist: fakeArtist, title: fakeTrack});
  });

  it('Should send track info request', function () {
    wrapper.getTrackInfoRequest(fakeArtist, fakeTrack);
    BusContent.prototype.sendMessage.should.been.calledWith(MSG.GET_TRACK_INFO, { artist: fakeArtist, title: fakeTrack});
  });

  it('Should get track info request', function () {
    BusContent.prototype.sendMessage.returns({
      then: function (callback) {
        callback({track: {}});
      }
    });

    wrapper.getTrackInfoRequest(fakeArtist, fakeTrack).then(function (response) {
      response.track.should.been.defined;
    });
  });
});

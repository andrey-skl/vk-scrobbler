describe('background handlers', function () {
  var MSG = window.vkScrobbler.contentMessages;
  var Actions = window.vkScrobbler.BackgroundActions;

  var fakeKey = 'fffff';
  var fakeName = 'user';
  var gaq;
  var fakeTrackInfo = {artist: 'Muse', title: 'Dead Inside'};
  var noop = function(){};
  var handlers;

  beforeEach(function () {
    this.sinon = sinon.sandbox.create();
    window._gaq = gaq = this.sinon.stub({push: function(){}});

    handlers = new Actions(fakeKey, fakeName);
    handlers.api = this.sinon.stub(handlers.api);
  });

  afterEach(function () {
    this.sinon.restore();
  });

  it('Should init', function () {
    handlers.should.be.defined;
    handlers.api.should.be.defined;
  });

  it('Should handle scrobble request', function () {
    handlers.api.scrobble.returns({then: noop});
    handlers[MSG.NEED_SCROOBLE](fakeTrackInfo);
    handlers.api.scrobble.should.have.been.calledWith(fakeTrackInfo);
  });

  it('Should handle nowPlaying request', function () {
    handlers.api.nowPlaying.returns({then: noop});
    handlers[MSG.NOW_PLAYING](fakeTrackInfo);
    handlers.api.nowPlaying.should.have.been.called;
  });

  it('Should handle makeLoved request', function () {
    handlers.api.makeLoved.returns({then: noop});
    handlers[MSG.NEED_LOVE](fakeTrackInfo);
    handlers.api.makeLoved.should.have.been.called;
  });

  it('Should handle makeNotLoved request', function () {
    handlers.api.makeNotLoved.returns({then: noop});
    handlers[MSG.NOT_NEED_LOVE](fakeTrackInfo);
    handlers.api.makeNotLoved.should.have.been.called;
  });

  it('Should handle makeNotLoved request', function () {
    handlers.api.getTrackInfo.returns({then: noop});
    handlers[MSG.GET_TRACK_INFO](fakeTrackInfo);
    handlers.api.getTrackInfo.should.have.been.called;
  });
  it('Should handle makeNotLoved request', function () {
    handlers[MSG.TOGGLE_PAUSE](fakeTrackInfo);
    gaq.push.should.have.been.called;
  });
});

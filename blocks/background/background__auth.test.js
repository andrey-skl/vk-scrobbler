describe('Background auth', function () {
  const backgroundAuth = window.vkScrobbler.backgroundAuth;
  const lastFmConfig = window.vkScrobbler.LastFmApiConfig;

  afterEach(function () {
    //chrome API methods already stubbed via sinon-chrome
    chrome.tabs.create.reset();
    chrome.tabs.getAllInWindow.reset();
  });


  it('Should open tab with last fm auth', function () {
    backgroundAuth();

    chrome.tabs.create.should.been.calledWith({
      url: 'http://www.lastfm.ru/api/auth?api_key=' + lastFmConfig.apiKey,
      active: true
    });
  });

  it('Should read open tabs on updates', function () {
    backgroundAuth();
    chrome.tabs.onUpdated.applyTrigger();

    chrome.tabs.query.should.been.called;
  });

  it('Should handle oauth and redirect it to extension auth page', function () {
    backgroundAuth();
    chrome.tabs.onUpdated.applyTrigger();

    const sendTab = chrome.tabs.query.firstCall.args[1];
    sendTab([{id: '123', url: 'https://vk.com/registervkscrobbler?token=fakeToken'}]);

    chrome.tabs.update.should.been.calledWith('123',  {active: true, url: 'blocks/auth/auth.html?token=fakeToken' });
  });

});

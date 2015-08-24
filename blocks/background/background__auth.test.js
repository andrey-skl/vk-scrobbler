describe('Background auth', function () {
  var backgroundAuth = window.vkScrobbler.backgroundAuth;
  var lastFmConfig = window.vkScrobbler.LastFmApiConfig;

  afterEach(function () {
    //chrome API methods already stubbed via sinon-chrome
    chrome.tabs.create.reset();
    chrome.tabs.getAllInWindow.reset();
  });


  it('Should open tab with last fm auth', function () {
    backgroundAuth();

    chrome.tabs.create.should.been.calledWith({
      selected: true,
      url: "http://www.lastfm.ru/api/auth?api_key=" + lastFmConfig.apiKey
    });
  });

  it('Should read open tabs on updates', function () {
    backgroundAuth();
    chrome.tabs.onUpdated.applyTrigger();

    chrome.tabs.getAllInWindow.should.been.called;
  });

  it('Should handle oauth and redirect it to extension auth page', function () {
    backgroundAuth();
    chrome.tabs.onUpdated.applyTrigger();

    var sendTab = chrome.tabs.getAllInWindow.firstCall.args[1];
    sendTab([{id: '123', url: 'https://vk.com/registervkscrobbler?token=fakeToken'}]);

    chrome.tabs.update.should.been.calledWith('123',  {active: true, url: "blocks/auth/auth.html?token=fakeToken" });
  });

});

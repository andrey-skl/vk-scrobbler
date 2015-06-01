describe('Indicators', function () {
  'use strict';
  var Indicators = window.vkScrobbler.Indicators;
  var PATHS = window.vkScrobbler.IdicatorsUtils.PATHS;
  var mainPlayer;

  beforeEach(function () {
    this.sinon = sinon.sandbox.create();
    PATHS.PLAYING = 'http://foo.ru/play-now.png';
    PATHS.SCROBBLED = 'http://foo.ru/scrobbled.png';
    PATHS.DISABLED = 'http://foo.ru/disabled.png';

    Indicators.setListeners({
      togglePauseScrobbling: sinon.stub()
    });
  });

  afterEach(function () {
    this.sinon.restore();
  });

  describe('Setting up indicators', function () {
    it('Should set up mini indicators', function () {
      this.sinon.stub(Indicators, 'SetMiniIndicator');
      Indicators.SetAllMini();
      Indicators.SetMiniIndicator.should.have.been.called;
    });

    it('Should set up AC indicators', function () {
      this.sinon.stub(Indicators, 'SetAcIndicator');
      Indicators.SetAllAC();
      Indicators.SetAcIndicator.should.have.been.called;
    });

    it('Should set up PD indicators', function () {
      this.sinon.stub(Indicators, 'SetPdIndicator');
      Indicators.SetAllPD();
      Indicators.SetPdIndicator.should.have.been.called;
    });
  });

  describe('Main (AC) indicators', function() {

    beforeEach(function () {
      mainPlayer = document.createElement('div');
      mainPlayer.id = 'ac';
      mainPlayer.innerHTML = '<div id="ac_duration"></div>';

      document.body.appendChild(mainPlayer);
    });

    afterEach(function () {
      document.body.removeChild(mainPlayer);
    });

    it('Should add status indicator to main audio player', function () {
      Indicators.SetAcIndicator();
      mainPlayer.querySelector('#nowIndAC').should.be.defined;
    });

    it('Should add love to main audio player', function () {
      Indicators.SetLoveAC();
      mainPlayer.querySelector('#loveDivAC').should.be.defined;
    });

    it('Should add twitter icon', function () {
      Indicators.SetTwitterAC();
      mainPlayer.querySelector('#twitterDivAC').should.be.defined;
    });

    it('Should show equalizer if now playing', function () {
      Indicators.SetAcIndicator();
      Indicators.indicatePlayNow();
      mainPlayer.querySelector('#nowIndAC img').src.should.be.equal(PATHS.PLAYING);
    });

    it('Should show scrobbled', function () {
      Indicators.SetAcIndicator();
      Indicators.indicateScrobbled();
      mainPlayer.querySelector('#nowIndAC img').src.should.be.equal(PATHS.SCROBBLED);
    });

    it('Should show disabled if now playing', function () {
      Indicators.SetAcIndicator();
      Indicators.indicatePauseScrobbling();
      mainPlayer.querySelector('#nowIndAC img').src.should.be.equal(PATHS.DISABLED);
    });
  });

  describe('Popup (PD) indicators', function () {
    var popupPlayer;

    beforeEach(function () {
      popupPlayer = document.createElement('div');
      popupPlayer.id = 'pd';
      popupPlayer.innerHTML = '<div id="pd_duration"></div>';
      document.body.appendChild(popupPlayer);
    });

    afterEach(function () {
      document.body.removeChild(popupPlayer);
    });

    it('Should add status indicator to popup audio player', function () {
      Indicators.SetPdIndicator();
      popupPlayer.querySelector('#nowIndPD').should.be.defined;
    });

    it('Should add love icon', function () {
      Indicators.SetLovePD();
      popupPlayer.querySelector('#loveDivPD').should.be.defined;
    });

    it('Should add twitter icon', function () {
      Indicators.SetTwitterPD();
      popupPlayer.querySelector('#twitterDivPD').should.be.defined;
    });
  });
});

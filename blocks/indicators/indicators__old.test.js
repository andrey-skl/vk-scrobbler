describe('Indicators', function () {
  'use strict';
  var IndicatorsOld = window.vkScrobbler.IndicatorsOld;
  var PATHS = window.vkScrobbler.IdicatorsUtils.PATHS;
  var mainPlayer;

  beforeEach(function () {
    this.sinon = sinon.sandbox.create();
    IndicatorsOld.setListeners({
      togglePauseScrobbling: this.sinon.stub()
    });
  });

  afterEach(function () {
    this.sinon.restore();
  });

  describe('Setting up indicators', function () {
    it('Should set up mini indicators', function () {
      this.sinon.stub(IndicatorsOld, 'SetMiniIndicator');
      IndicatorsOld.SetAllMini();
      IndicatorsOld.SetMiniIndicator.should.have.been.called;
    });

    it('Should set up AC indicators', function () {
      this.sinon.stub(IndicatorsOld, 'SetAcIndicator');
      IndicatorsOld.SetAllAC();
      IndicatorsOld.SetAcIndicator.should.have.been.called;
    });

    it('Should set up PD indicators', function () {
      this.sinon.stub(IndicatorsOld, 'SetPdIndicator');
      IndicatorsOld.SetAllPD();
      IndicatorsOld.SetPdIndicator.should.have.been.called;
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
      IndicatorsOld.SetAcIndicator();
      mainPlayer.querySelector('#nowIndAC').should.be.defined;
    });

    it('Should add love to main audio player', function () {
      IndicatorsOld.SetLoveAC();
      mainPlayer.querySelector('#loveDivAC').should.be.defined;
    });

    it('Should add twitter icon', function () {
      IndicatorsOld.SetTwitterAC();
      mainPlayer.querySelector('#twitterDivAC').should.be.defined;
    });

    it('Should show equalizer if now playing', function () {
      PATHS.PLAYING = 'http://foo.ru/play-now.png';
      IndicatorsOld.SetAcIndicator();
      IndicatorsOld.indicatePlayNow();
      mainPlayer.querySelector('#nowIndAC img').src.should.be.equal(PATHS.PLAYING);
    });

    it('Should show scrobbled', function () {
      PATHS.SCROBBLED = 'http://foo.ru/scrobbled.png';
      IndicatorsOld.SetAcIndicator();
      IndicatorsOld.indicateScrobbled();
      mainPlayer.querySelector('#nowIndAC img').src.should.be.equal(PATHS.SCROBBLED);
    });

    it('Should show disabled if now playing', function () {
      PATHS.DISABLED = 'http://foo.ru/disabled.png';
      IndicatorsOld.SetAcIndicator();
      IndicatorsOld.indicatePauseScrobbling();
      mainPlayer.querySelector('#nowIndAC img').src.should.be.equal(PATHS.DISABLED);
    });

    it('Should indicateLoved', function () {
      PATHS.HEART_BLUE = 'http://foo.ru/blue.png';
      IndicatorsOld.SetLoveAC();
      IndicatorsOld.indicateLoved();
      mainPlayer.querySelector('#loveDivAC img').src.should.be.equal(PATHS.HEART_BLUE);
    });

    it('Should indicateNotLove', function () {
      PATHS.HEART_GRAY = 'http://foo.ru/gray.png';
      IndicatorsOld.SetLoveAC();
      IndicatorsOld.indicateNotLove();
      mainPlayer.querySelector('#loveDivAC img').src.should.be.equal(PATHS.HEART_GRAY);
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
      IndicatorsOld.SetPdIndicator();
      popupPlayer.querySelector('#nowIndPD').should.be.defined;
    });

    it('Should add love icon', function () {
      IndicatorsOld.SetLovePD();
      popupPlayer.querySelector('#loveDivPD').should.be.defined;
    });

    it('Should add twitter icon', function () {
      IndicatorsOld.SetTwitterPD();
      popupPlayer.querySelector('#twitterDivPD').should.be.defined;
    });
  });

  describe('Mini indicators', function () {
    var minPLayer;

    beforeEach(function () {
      minPLayer = document.createElement('div');
      minPLayer.innerHTML = '<div id="gp_small"></div>';
      document.body.appendChild(minPLayer);
    });

    afterEach(function () {
      document.body.removeChild(minPLayer);
    });

    it('Should add status indicator to mini audio player', function () {
      IndicatorsOld.SetMiniIndicator();
      minPLayer.querySelector('#nowIndicator').should.be.defined;
    });
  });

  describe('Love buttons actions', function () {
    var pulseClass = 'indicators__love_pulse';
    var fakeEvent;
    var elem;
    var fakeToggleLove;

    beforeEach(function () {
      fakeToggleLove = this.sinon.stub();
      IndicatorsOld.setListeners({
        toggleLove: fakeToggleLove
      });
      elem = document.createElement('div');
      fakeEvent = {target: elem};
    });

    it('Should add pulsing class while sending love request', function () {
      fakeToggleLove.returns({then: function() {}});
      IndicatorsOld._loveClickListener(fakeEvent);
      elem.classList.contains(pulseClass).should.be.true;
    });

    it('Should remove pulsing class after finish love request', function () {
      fakeToggleLove.returns({then: function(cb) {
        cb();
      }});
      IndicatorsOld._loveClickListener(fakeEvent);
      elem.classList.contains(pulseClass).should.be.false;
    });

    it('Should remove pulsing class after fail love request', function () {
      fakeToggleLove.returns({then: function(cb, errorcallback) {
        errorcallback();
      }});
      IndicatorsOld._loveClickListener(fakeEvent);
      elem.classList.contains(pulseClass).should.be.false;
    });

    it('Should do nothing if icon is already pulsing', function () {
      elem.classList.add(pulseClass);
      fakeToggleLove.returns({then: function() {}});
      IndicatorsOld._loveClickListener(fakeEvent);

      fakeToggleLove.should.not.have.been.called;
    });
  });

});

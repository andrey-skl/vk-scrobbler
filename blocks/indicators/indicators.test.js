describe('Indicators', function () {
  'use strict';
  var Indicators = window.vkScrobbler.Indicators;
  var PATHS = window.vkScrobbler.IdicatorsUtils.PATHS;
  var mainPlayer;

  beforeEach(function () {
    this.sinon = sinon.sandbox.create();
    Indicators.setListeners({
      togglePauseScrobbling: this.sinon.stub()
    });
  });

  afterEach(function () {
    this.sinon.restore();
  });

  describe('Setting up indicators', function () {
    it('Should set up mini indicators', function () {
      this.sinon.stub(Indicators, 'SetMiniIndicator');
      Indicators.SetHeaderIndicator();
      Indicators.SetMiniIndicator.should.have.been.called;
    });

    it('Should set up AC indicators', function () {
      this.sinon.stub(Indicators, 'SetAcIndicator');
      Indicators.SetAudioPageIndicators();
      Indicators.SetAcIndicator.should.have.been.called;
    });

    it('Should set up PD indicators', function () {
      this.sinon.stub(Indicators, 'SetPdIndicator');
      Indicators.SetDropdownIndicators();
      Indicators.SetPdIndicator.should.have.been.called;
    });
  });

  describe('Main (AC) indicators', function() {
    beforeEach(function () {
      mainPlayer = document.createElement('div');
      mainPlayer.className = 'page_block';

      mainPlayer.innerHTML = `<div class="audio_page_player">
        <div class="audio_page_player_volume_line"></div>
      </div>`;

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
      PATHS.PLAYING = 'http://foo.ru/play-now.png';
      Indicators.SetAcIndicator();
      Indicators.indicatePlayNow();
      mainPlayer.querySelector('#nowIndAC img').src.should.be.equal(PATHS.PLAYING);
    });

    it('Should show scrobbled', function () {
      PATHS.SCROBBLED = 'http://foo.ru/scrobbled.png';
      Indicators.SetAcIndicator();
      Indicators.indicateScrobbled();
      mainPlayer.querySelector('#nowIndAC img').src.should.be.equal(PATHS.SCROBBLED);
    });

    it('Should show disabled if now playing', function () {
      PATHS.DISABLED = 'http://foo.ru/disabled.png';
      Indicators.SetAcIndicator();
      Indicators.indicatePauseScrobbling();
      mainPlayer.querySelector('#nowIndAC img').src.should.be.equal(PATHS.DISABLED);
    });

    it('Should indicateLoved', function () {
      PATHS.HEART_BLUE = 'http://foo.ru/blue.png';
      Indicators.SetLoveAC();
      Indicators.indicateLoved();
      mainPlayer.querySelector('#loveDivAC img').src.should.be.equal(PATHS.HEART_BLUE);
    });

    it('Should indicateNotLove', function () {
      PATHS.HEART_GRAY = 'http://foo.ru/gray.png';
      Indicators.SetLoveAC();
      Indicators.indicateNotLove();
      mainPlayer.querySelector('#loveDivAC img').src.should.be.equal(PATHS.HEART_GRAY);
    });
  });

  describe('Popup (PD) indicators', function () {
    var popupPlayer;

    beforeEach(function () {
      popupPlayer = document.createElement('div');
      popupPlayer.id = 'audio_layer_tt';

      popupPlayer.innerHTML = `<div class="audio_page_player_volume_line"></div>`;

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

  describe('Mini indicators', function () {
    var minPLayer;

    beforeEach(function () {
      minPLayer = document.createElement('div');
      minPLayer.innerHTML = '<div id="top_audio"></div>';
      document.body.appendChild(minPLayer);
    });

    afterEach(function () {
      document.body.removeChild(minPLayer);
    });

    it('Should add status indicator to mini audio player', function () {
      Indicators.SetMiniIndicator();
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
      Indicators.setListeners({
        toggleLove: fakeToggleLove
      });
      elem = document.createElement('div');
      fakeEvent = {target: elem};
    });

    it('Should add pulsing class while sending love request', function () {
      fakeToggleLove.returns({then: function() {}});
      Indicators._loveClickListener(fakeEvent);
      elem.classList.contains(pulseClass).should.be.true;
    });

    it('Should remove pulsing class after finish love request', function () {
      fakeToggleLove.returns({then: function(cb) {
        cb();
      }});
      Indicators._loveClickListener(fakeEvent);
      elem.classList.contains(pulseClass).should.be.false;
    });

    it('Should remove pulsing class after fail love request', function () {
      fakeToggleLove.returns({then: function(cb, errorcallback) {
        errorcallback();
      }});
      Indicators._loveClickListener(fakeEvent);
      elem.classList.contains(pulseClass).should.be.false;
    });

    it('Should do nothing if icon is already pulsing', function () {
      elem.classList.add(pulseClass);
      fakeToggleLove.returns({then: function() {}});
      Indicators._loveClickListener(fakeEvent);

      fakeToggleLove.should.not.have.been.called;
    });
  });

});

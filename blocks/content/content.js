(function () {
  'use strict';

  var busWrapper = new window.vkScrobbler.ContentBusWrapper();
  var Indicators = window.vkScrobbler.Indicators;
  var utils = window.vkScrobbler.ContentUils;
  var vkPatcher = window.vkScrobbler.vkPatcher;
  var artist;
  var track;
  var position;
  var lastPos;

  var needScrobble = false;
  var scrobbleEnabled = true;
  var loved = false;

  var SCROBBLE_PERCENTAGE = 50;
  var checkPeriod = 1100;
  var periodsToNowPlay = 20;//число периодов, через которые посылается PlayNow  нотификация
  var periodNum = 0;
  var TrackInfo;

  Indicators.setListeners({
    toggleLove: function sendLoveRequest() {
      if (loved) {
        busWrapper.sendUnlove(artist, track);
        Indicators.indicateNotLove();
      } else {
        busWrapper.sendNeedLove(artist, track);
        Indicators.indicateLoved();
      }
      loved = !loved;
    },
    togglePauseScrobbling: function togglePauseScrobbling() {
      scrobbleEnabled = !scrobbleEnabled;
      if (scrobbleEnabled) {
        position > SCROBBLE_PERCENTAGE ? Indicators.indicateScrobbled() : Indicators.indicateVKscrobbler();
      } else {
        Indicators.indicatePauseScrobbling();
      }
      busWrapper.sendPauseStatus(artist, track, !scrobbleEnabled);
    }
  });

  var activate = function () {
    TrackInfo = vkPatcher.setUpTrackInfoHolder();
    vkPatcher.patchPlayer();

    parseInfoAndCheck();

    //вешаем событие на появление мини плеера, чтобы тут же вставить индикаторы
    document.body.addEventListener('DOMNodeInserted', function (e) {
      if (e.target.id === 'pad_wrap') {
        setTimeout(Indicators.addIndicatorsToPage.bind(Indicators), 100);
      }
    });
  };
  activate();

  /**
   * Parses information, provided by VK player and check scrobble/now-playing conditions
   */
  function parseInfoAndCheck() {
    Indicators.addIndicatorsToPage();

    artist = TrackInfo.getArtist().replace("&amp;", "&");
    track = TrackInfo.getTitle().replace("&amp;", "&");
    position = parseFloat(TrackInfo.getTrackPosition()) || 0;

    checkTrackStatus();

    Indicators.setTwitButtonHref(utils.getTwitLink(artist, track));

    setTimeout(parseInfoAndCheck, checkPeriod);
  }

  /**
   * Updates information, send requests in depend on conditions
   */
  function updateStatus() {
    if (position !== lastPos) {
      if (periodNum > periodsToNowPlay) {
        busWrapper.sendNowPlayingRequest(artist, track);
        periodNum = 0;
      }
      Indicators.indicatePlayNow();
    } else {
      Indicators.indicateVKscrobbler();
    }

    lastPos = position;
    periodNum++;

    if (position >= SCROBBLE_PERCENTAGE) { //отправим после того как половина трека проиграется
      busWrapper.sendScrobleRequest(artist, track);
      Indicators.indicateScrobbled();
      needScrobble = false;
    }
  }

  function checkTrackStatus() {
    if (scrobbleEnabled) {
      var isNeedScrobbleReceived = TrackInfo.getNeedScrobble() === 'true';

      if (isNeedScrobbleReceived) {
        needScrobble = true;
        periodNum = periodsToNowPlay;
        TrackInfo.setNeedScrobble(false);
        checkTrackLove();
      }

      if (needScrobble)	{
        updateStatus();
      }
    } else {
      Indicators.indicatePauseScrobbling();
    }
  }

  function checkTrackLove() {
    Indicators.indicateNotLove();
    busWrapper.getTrackInfoRequest(artist, track)
      .then(function (response) {
        loved = response.track && response.track.userloved === '1';
        if (loved) {
          Indicators.indicateLoved();
        }
      });
  }

})();

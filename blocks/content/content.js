(function () {
  'use strict';
  var Indicators = window.vkScrobbler.Indicators;
  var playerHandlers = new window.vkScrobbler.PlayerHandlers();
  var scriptInjector = window.vkScrobbler.scriptInjector;


  function instantIndicatorsInserter () {
    //listen to players inserting in document to instantly insert indicators nodes
    document.body.addEventListener('DOMNodeInserted', function (e) {
      if (e.target.classList && e.target.classList.contains('audio_page_player_volume_line')) {
        Indicators.SetDropdownIndicators();
        Indicators.SetAudioPageIndicators();
        return;
      }
      if (e.target.parentNode &&
        e.target.parentNode.classList &&
        e.target.parentNode.classList.contains('top_audio_player_title')) {
        return Indicators.SetHeaderIndicator();
      }
    });

    //If audio page is a landing page, then just attaching indicators
    Indicators.SetAudioPageIndicators();
    Indicators.SetHeaderIndicator();

    window.addEventListener('load', function () {
      Indicators.SetAudioPageIndicators();
      Indicators.SetHeaderIndicator();
    });
  }

  var activate = function () {
    instantIndicatorsInserter();
    scriptInjector.injectPatcher();

    window.addEventListener('message', function(e){
      if (e.data.vkPlayerPatcherMessage) {
        var payload = e.data.message;

        playerHandlers[payload.message](payload.data);
      }
    }, false);
  };
  activate();
})();

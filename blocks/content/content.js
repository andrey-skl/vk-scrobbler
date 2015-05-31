(function () {
  'use strict';
  var Indicators = window.vkScrobbler.Indicators;
  var playerHandlers = new window.vkScrobbler.PlayerHandlers();
  var scriptInjector = window.vkScrobbler.scriptInjector;


  function instantIndicatorsInserter () {
    //listen to players inserting in document to instantly insert indicators nodes
    document.body.addEventListener('DOMNodeInserted', function (e) {
      if (e.target.id === 'pad_controls') {
        Indicators.SetAllPD();
      }
      if (e.target.classList && e.target.classList.contains('wrap') && e.target.querySelector('#gp_info')) {
        Indicators.SetAllMini();
      }
      if(e.target.id === 'wrap2' && e.target.querySelector('#audio') !== null) {
        Indicators.SetAllAC();
      }
    });

    //If audio page is a langing page, then just attaching indicators
    Indicators.SetAllAC();
    window.addEventListener("load", function () {
      Indicators.SetAllAC();
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

(function() {
  'use strict';

  var Indicators = window.vkScrobbler.Indicators;
  var IndicatorsOld = window.vkScrobbler.IndicatorsOld;
  var playerHandlers = new window.vkScrobbler.PlayerHandlers();
  var scriptInjector = window.vkScrobbler.scriptInjector;
  var isOldUI = Boolean(document.getElementById('top_new_msg')); //new UI doesn't have this element
  console.info('vk scrobbler. New ui detected = ', !isOldUI);

  function instantIndicatorsInserter() {
    //observe players inserting in document to instantly insert indicators nodes
    var playersObserver = new MutationObserver(function(mutations) {
        mutations.map(function(mutation) {
            // console.log("class: "+mutation.target.className);
            if (mutation.target.classList && mutation.target.classList.contains('top_audio_layer')) {
              Indicators.SetDropdownIndicators();
              Indicators.SetAudioPageIndicators();
              console.log("[vk scrobbler] Indicators inserted in the new music pad.");
              return;
            }
        });
      }),
      options = {
        'childList': true,
        'subtree': true
      };
    playersObserver.observe(document.body, options);

    //If audio page is a landing page, then just attaching indicators
    Indicators.SetAudioPageIndicators();
    Indicators.SetHeaderIndicator();

    window.addEventListener('load', function() {
      Indicators.SetAudioPageIndicators();
      Indicators.SetHeaderIndicator();
    });
  }

  function instantIndicatorsInserterOld() {
    //observe players inserting in document to instantly insert indicators nodes

    // http://frontender.info/mutation-observers-tutorial

    var playersObserver = new MutationObserver(function(mutations) {
        mutations.map(function(mutation) {
          // console.log("id:"+mutation.target.id);
          if (mutation.target.id === 'pad_cont') {
            IndicatorsOld.SetAllPD();
            console.log("[vk scrobbler] Indicators inserted in the old music pad.");
          }
          if (mutation.target.id === 'gp') {
            IndicatorsOld.SetAllMini();
            console.log("[vk scrobbler] Indicators inserted in the old music left minipad.");
          }
          if (mutation.target.id === 'wrap3' && mutation.target.querySelector('#audio') !== null) {
            IndicatorsOld.SetAllAC();
            console.log("[vk scrobbler] Indicators inserted in the old music page topbar.");
          }
        });
      }),
      options = {
        'childList': true,
        'subtree': true
      };
    playersObserver.observe(document.body, options);

    //If audio page is a landing page, then just attaching indicators
    IndicatorsOld.SetAllAC();
    window.addEventListener("load", function() {
      IndicatorsOld.SetAllAC();
    });
  }

  var activate = function() {
    if (isOldUI) {
      instantIndicatorsInserterOld();
    } else {
      instantIndicatorsInserter();
    }

    scriptInjector.injectPatcher();

    window.addEventListener('message', function(e) {
      if (e.data.vkPlayerPatcherMessage) {
        var payload = e.data.message;

        playerHandlers[payload.message](payload.data);
      }
    }, false);
  };
  activate();
})();

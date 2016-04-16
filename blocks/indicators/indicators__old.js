(function(){
  'use strict';

  var EIndicateState = window.vkScrobbler.IdicatorsUtils.EIndicateState;
  var PATHS = window.vkScrobbler.IdicatorsUtils.PATHS;

  var byId = document.getElementById.bind(document);
  var qsa = document.querySelectorAll.bind(document);

  var ifExist = function (selector) {
    var element = document.querySelector(selector);
    return {
      run: function (callback) {
        element && callback(element);
      }
    };
  };
  
  var DURATION_MARGIN = '12px';

  var IndicatorsOld = {
    htmls: {
      indicate: EIndicateState.logotype,
      love: false,
      twitLink: '',

      miniIndicator: '<div id="nowIndicator" class="indicators__status_old-mini"><img class="indicators__icon_old" title="VK scrobbler: status" src=' + PATHS.PAUSE + '></div>',

      acIndicator: '<div id="nowIndAC" class="indicators__status_old"><img class="indicators__icon_old" title="VK scrobbler: status" src=' + PATHS.PAUSE + '></div>',

      pdIndicator: '<div id="nowIndPD" class="indicators__status_old"><img class="indicators__icon_old" title="VK scrobbler: status" src=' + PATHS.PAUSE + '></div>',

      twitAChtml: '<div id="twitterDivAC" class="indicators__twit_old">' +
      '<a id="twitLinkAC" target="_blank"><img class="indicators__icon_old" title="VK scrobbler: tweet button" src="' + PATHS.TWITTER + '"></a></div>',

      twitPDhtml: '<div id="twitterDivPD" class="indicators__twit_old">' +
      '<a id="twitLinkPD" target="_blank"><img class="indicators__icon_old" title="VK scrobbler: tweet button" src=' + PATHS.TWITTER + '></a></div>',

      loveAC: '<div id="loveDivAC" class="indicators__love_old"><img class="indicators__icon_old" title="VK scrobbler: love" src=' + PATHS.HEART_GRAY + '></div>',

      lovePD: '<div id="loveDivPD" class="indicators__love_old"><img class="indicators__icon_old" title="VK scrobbler: love" src=' + PATHS.HEART_GRAY + '></div>'
    },

    setListeners: function (listeners) {
      this.listeners = listeners;
    },

    SetAllMini: function () {
      IndicatorsOld.IncreaseMiniPlayerWidth();
      IndicatorsOld.SetMiniIndicator();
      IndicatorsOld.indicateStatus();
    },

    SetAllAC: function () {
      IndicatorsOld.SetAudioPageTimeMargin(); //смещаем таймер, чтобы не уплыл
      IndicatorsOld.SetAcIndicator();
      IndicatorsOld.SetLoveAC();
      IndicatorsOld.SetTwitterAC();
      IndicatorsOld.indicateStatus();
    },

    SetAllPD: function () {
      IndicatorsOld.SetFloatingPlayerTimeMargin();
      IndicatorsOld.SetPdIndicator();
      IndicatorsOld.SetLovePD();
      IndicatorsOld.SetTwitterPD();
      IndicatorsOld.indicateStatus();
    },

    /**
     * Обновляет текущий статус
     */
    indicateStatus: function () {
      switch (IndicatorsOld.indicate) {
        case EIndicateState.nowplaying:
          IndicatorsOld.indicatePlayNow();
          break;
        case EIndicateState.scrobbled:
          IndicatorsOld.indicateScrobbled();
          break;
        case EIndicateState.logotype:
          IndicatorsOld.indicateVKscrobbler();
          break;
        case EIndicateState.paused:
          IndicatorsOld.indicatePauseScrobbling();
          break;
      }

      IndicatorsOld.love ? IndicatorsOld.indicateLoved() : IndicatorsOld.indicateNotLove();
      this.twitLink && IndicatorsOld.setTwitButtonHref(this.twitLink);
    },

    setTwitButtonHref: function (link) {
      this.twitLink = link;
      [].forEach.call(qsa('#twitLinkAC, #twitLinkPD'), function(twitLink) {
        twitLink.href = link;
      });
    },

    /**
     * Increases mini player width to make place for equalizer icon
     */
    IncreaseMiniPlayerWidth: function () {
      ifExist('#gp').run(function (el) {
        el.style.minWidth = "175px";
      });
      ifExist('#gp_back').run(function (el) {
        el.style.minWidth = "175px";
      });
    },

    SetAudioPageTimeMargin: function () {
      ifExist('#ac_duration').run(function (el) {
        el.style.marginRight = DURATION_MARGIN;
      });
    },
    SetFloatingPlayerTimeMargin: function () {
      ifExist('#pd_duration').run(function (el) {
        el.style.marginRight = DURATION_MARGIN;
      });
    },

    SetMiniIndicator: function () {
      if (!byId("nowIndicator")) {
        ifExist('#gp_small').run(function (el) {
          el.insertAdjacentHTML('afterend', IndicatorsOld.htmls.miniIndicator);
          byId('nowIndicator').addEventListener('click', this.listeners.togglePauseScrobbling);
        }.bind(this));
      }
    },

    SetAcIndicator: function () {
      if (byId("ac") && !byId("nowIndAC")) {
        byId('ac_duration').insertAdjacentHTML('beforebegin', IndicatorsOld.htmls.acIndicator);
        byId('nowIndAC').addEventListener('click', this.listeners.togglePauseScrobbling);
      }
    },

    SetPdIndicator: function () {
      if (byId("pd") && !byId("nowIndPD")) {
        byId('pd_duration').insertAdjacentHTML('beforebegin', IndicatorsOld.htmls.pdIndicator);
        byId('nowIndPD').addEventListener('click', this.listeners.togglePauseScrobbling);
      }
    },

    SetTwitterAC: function () {
      if (byId("ac") && !byId("twitterDivAC")) {
        byId('ac_duration').insertAdjacentHTML('beforebegin', IndicatorsOld.htmls.twitAChtml);
      }
    },

    SetTwitterPD: function () {
      if (byId("pd") && !byId("twitterDivPD")) {
        byId('pd_duration').insertAdjacentHTML('beforebegin', IndicatorsOld.htmls.twitPDhtml);
      }
    },

    _loveClickListener: function (e) {
      var pulseClassName = 'indicators__love_pulse';
      if (e.target.classList.contains(pulseClassName)) {
        return;
      }
      e.target.classList.add(pulseClassName);

      this.listeners.toggleLove(IndicatorsOld.love).then(function () {
        e.target.classList.remove(pulseClassName);
      }, function () {
        e.target.classList.remove(pulseClassName);
      });
    },

    SetLoveAC: function () {
      if (byId("ac") && !byId("loveDivAC")) {
        byId('ac_duration').insertAdjacentHTML('beforebegin', IndicatorsOld.htmls.loveAC);
        byId('loveDivAC').addEventListener('click', this._loveClickListener.bind(this));
      }
    },

    SetLovePD: function () {
      if (byId("pd") && !byId("loveDivPD")) {
        byId('pd_duration').insertAdjacentHTML('beforebegin', IndicatorsOld.htmls.lovePD);
        byId('loveDivPD').addEventListener('click', this._loveClickListener.bind(this));
      }
    },

    updatePlayingIndicators: function (newImgSrc, newTitle) {
      [].forEach.call(qsa("#nowIndAC img, #nowIndPD img, #nowIndicator img"), function(image) {
        if (image.src !== newImgSrc) {
          image.src = newImgSrc;
        }
        image.title = newTitle;
      });
    },

    indicatePlayNow: function () {
      IndicatorsOld.indicate = EIndicateState.nowplaying;
      this.updatePlayingIndicators(PATHS.PLAYING, "VK scrobbler: now playing");
    },

    indicateVKscrobbler: function () {
      IndicatorsOld.indicate = EIndicateState.logotype;
      this.updatePlayingIndicators(PATHS.PAUSE, "VK scrobbler");
    },

    indicatePauseScrobbling: function () {
      IndicatorsOld.indicate = EIndicateState.paused;
      this.updatePlayingIndicators(PATHS.DISABLED, "VK scrobbler: paused");
    },

    indicateScrobbled: function () {
      IndicatorsOld.indicate = EIndicateState.scrobbled;
      this.updatePlayingIndicators(PATHS.SCROBBLED, "VK scrobbler: scrobbled");
    },

    indicateLoved: function () {
      IndicatorsOld.love = true;
      [].forEach.call(qsa("#loveDivAC img, #loveDivPD img"), function(image) {
        image.src = PATHS.HEART_BLUE;
        image.title = "VK scrobbler: Вы любите этот трэк. Кликните, чтобы разлюбить.";
      });

    },

    indicateNotLove: function () {
      IndicatorsOld.love = false;
      [].forEach.call(qsa("#loveDivAC img, #loveDivPD img"), function(image) {
        image.src = PATHS.HEART_GRAY;
        image.title = "VK scrobbler: Вы не любите этот трэк. Кликните, чтобы полюбить.";
      });
    }
  };

  /**
   * Export interface
   */

  window.vkScrobbler.IndicatorsOld = IndicatorsOld;
})();


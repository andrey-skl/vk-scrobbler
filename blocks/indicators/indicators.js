(function(){
  'use strict';

  var EIndicateState = IdicatorsUtils.EIndicateState;
  var PATHES = IdicatorsUtils.PATHES;

  var byId = document.getElementById.bind(document);
  var qs = document.querySelector.bind(document);
  var qsa = document.querySelectorAll.bind(document);

  var ifExist = IdicatorsUtils.ifExist;

  window.Indicators = {
    htmls: {
      indicate: EIndicateState.logotype,

      miniIndicator: '<div id="nowIndicator" class="indicators__now_mini"><img title="VK scrobbler" src=' + PATHES.PAUSE + '></div>',

      acIndicator: '<div id="nowIndAC" class="indicators__now"><img title="VK scrobbler" src=' + PATHES.PAUSE + '></div>',

      pdIndicator: '<div id="nowIndPD" class="indicators__now"><img title="VK scrobbler" src=' + PATHES.PAUSE + '></div>',

      twitAChtml: '<div id="twitterDivAC" class="indicators__twit">' +
      '<a id="twitLinkAC" target="_blank"><img title="VK scrobbler TWIT button" src="' + PATHES.TWITTER + '"></a></div>',

      twitPDhtml: '<div id="twitterDivPD" class="indicators__twit">' +
      '<a id="twitLinkPD" target="_blank"><img title="VK scrobbler TWIT button" src=' + PATHES.TWITTER + '></a></div>',

      loveAC: '<div id="loveDivAC" class="indicators__love"><img title="VK scrobbler LOVE button" src=' + PATHES.HEART_GRAY + '></div>',

      lovePD: '<div id="loveDivPD" class="indicators__love"><img title="VK scrobbler LOVE button" src=' + PATHES.HEART_GRAY + '></div>'
    },

    setListeners: function (listeners) {
      this.listeners = listeners;
    },

    addIndicatorsToPage: function () {
      Indicators.IncreaseMiniPlayerWidth();
      Indicators.SetMiniIndicator();
      //добавляем индикатор к верхней панели на странице аудиозаписей
      Indicators.SetAllAC();
      //Добавляем индикатор к всплывающему плееру
      Indicators.SetAllPD();
      Indicators.indicateStatus();
    },

    SetAllAC: function () {
      Indicators.SetAudioPageTimeMargin(); //смещаем таймер, чтобы не уплыл
      Indicators.SetAcIndicator();
      Indicators.SetLoveAC();
      Indicators.SetTwitterAC();
    },

    SetAllPD: function () {
      Indicators.SetFloatingPlayerTimeMargin();
      Indicators.SetPdIndicator();
      Indicators.SetLovePD();
      Indicators.SetTwitterPD();
    },

    /**
     * Обновляет текущий статус
     */
    indicateStatus: function () {
      switch (Indicators.indicate) {
        case EIndicateState.nowplaying:
          Indicators.indicatePlayNow();
          break;
        case EIndicateState.scrobbled:
          Indicators.indicateScrobbled();
          break;
        case EIndicateState.logotype:
          Indicators.indicateVKscrobbler();
          break;
        case EIndicateState.paused:
          Indicators.indicatePauseScrobbling();
          break;
      }
    },

    setTwitButtonHref: function (link) {
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
        el.style.marginRight = "13px";
      });
    },
    SetFloatingPlayerTimeMargin: function () {
      ifExist('#pd_duration').run(function (el) {
        el.style.marginRight = "13px";
      });
    },

    SetMiniIndicator: function () {
      if (!byId("nowIndicator")) {
        ifExist('#gp_small').run(function (el) {
          el.insertAdjacentHTML('afterend', Indicators.htmls.miniIndicator);
          byId('nowIndicator').addEventListener('click', this.listeners.togglePauseScrobbling);
        }.bind(this));
      }
    },

    SetAcIndicator: function () {
      if (byId("ac") && !byId("nowIndAC")) {
        byId('ac_duration').insertAdjacentHTML('beforebegin', Indicators.htmls.acIndicator);
        byId('nowIndAC').addEventListener('click', this.listeners.togglePauseScrobbling);
      }
    },

    SetPdIndicator: function () {
      if (byId("pd") && !byId("nowIndPD")) {
        byId('pd_duration').insertAdjacentHTML('beforebegin', Indicators.htmls.pdIndicator);
        byId('nowIndPD').addEventListener('click', this.listeners.togglePauseScrobbling);
      }
    },

    SetTwitterAC: function () {
      if (byId("ac") && !byId("twitterDivAC")) {
        byId('ac_duration').insertAdjacentHTML('beforebegin', Indicators.htmls.twitAChtml);
      }
    },

    SetTwitterPD: function () {
      if (byId("pd") && !byId("twitterDivPD")) {
        byId('pd_duration').insertAdjacentHTML('beforebegin', Indicators.htmls.twitPDhtml);
      }
    },

    SetLoveAC: function () {
      if (byId("ac") && !byId("loveDivAC")) {
        byId('ac_duration').insertAdjacentHTML('beforebegin', Indicators.htmls.loveAC);
        byId('loveDivAC').addEventListener('click', this.listeners.toggleLove);
      }
    },

    SetLovePD: function () {
      if (byId("pd") && !byId("loveDivPD")) {
        byId('pd_duration').insertAdjacentHTML('beforebegin', Indicators.htmls.lovePD);
        byId('loveDivPD').addEventListener('click', this.listeners.toggleLove);
      }
    },

    updatePlayingIndicators: function (newImgSrc, newTitle) {
      [].forEach.call(qsa("#nowIndAC img, #nowIndPD img, #nowIndicator img"), function(image) {
        image.src = newImgSrc;
        image.title = newTitle;
      });
    },

    indicatePlayNow: function () {
      Indicators.indicate = EIndicateState.nowplaying;
      this.updatePlayingIndicators(PATHES.PLAYING, "VK scrobbler now playing");
    },

    indicateVKscrobbler: function () {
      Indicators.indicate = EIndicateState.logotype;
      this.updatePlayingIndicators(PATHES.PAUSE, "VK scrobbler");
    },

    indicatePauseScrobbling: function () {
      Indicators.indicate = EIndicateState.paused;
      this.updatePlayingIndicators(PATHES.DISABLED, "VK scrobbler paused");
    },

    indicateScrobbled: function () {
      Indicators.indicate = EIndicateState.scrobbled;
      this.updatePlayingIndicators(PATHES.SCROBBLED, "VK scrobbler: scrobbled");
    },

    indicateLoved: function () {
      [].forEach.call(qsa("#loveDivAC img, #loveDivPD img"), function(image) {
        image.src = PATHES.HEART_BLUE;
        image.title = "VK scrobbler. Вы любите этот трэк. Кликните, чтобы изменить отношение.";
      });

    },

    indicateNotLove: function () {
      [].forEach.call(qsa("#loveDivAC img, #loveDivPD img"), function(image) {
        image.src = PATHES.HEART_GRAY;
        image.title = "VK scrobbler. Вы не любите этот трэк. Кликните, чтобы изменить отношение.";
      });
    }
  };
})();



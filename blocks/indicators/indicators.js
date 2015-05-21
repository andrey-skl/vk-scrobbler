(function(){
  var EIndicateState = {
    logotype: 0,
    nowplaying: 1,
    scrobbled: 2,
    paused: 3
  };

  var byId = document.getElementById.bind(document);
  var qs = document.querySelector.bind(document);
  var qsa = document.querySelectorAll.bind(document);

  var ifExist = function (selector) {
    var element = qs(selector);
    return {
      run: function (callback) {
        element && callback(element);
      }
    }
  };

  window.Indicators = {
    htmls: {
      indicate: EIndicateState.logotype,

      miniIndicator: '<div id="nowIndicator" class="indicators__now_mini"><img title="VK scrobbler" src=' +
      chrome.extension.getURL("img/icon_eq_pause.png") + '></div>',

      acIndicator: '<div id="nowIndAC" class="indicators__now"><img title="VK scrobbler" src=' +
      chrome.extension.getURL("img/icon_eq_pause.png") + '></div>',

      pdIndicator: '<div id="nowIndPD" class="indicators__now"><img title="VK scrobbler" src=' +
      chrome.extension.getURL('img/icon_eq_pause.png') + '></div>',

      twitAChtml: '<div id="twitterDivAC" class="indicators__twit">' +
      '<a id="twitLinkAC" target="_blank"><img title="VK scrobbler TWIT button" src="' + chrome.extension.getURL("img/twitter.png") +
      '"></a></div>',

      twitPDhtml: '<div id="twitterDivPD" class="indicators__twit">' +
      '<a id="twitLinkPD" target="_blank"><img title="VK scrobbler TWIT button" src=' + chrome.extension.getURL("img/twitter.png") + '></a></div>',

      loveAC: '<div id="loveDivAC" class="indicators__love">' +
      '<img title="VK scrobbler LOVE button" src=' + chrome.extension.getURL("img/heartBW.png") + '></div>',

      lovePD: '<div id="loveDivPD" class="indicators__love"><img title="VK scrobbler LOVE button" src=' + chrome.extension.getURL("img/heartBW.png") + '></div>'
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
        byId('loveDivAC').addEventListener('click', this.listeners.sendLoveRequest);
      }
    },

    SetLovePD: function () {
      if (byId("pd") && !byId("loveDivPD")) {
        byId('pd_duration').insertAdjacentHTML('beforebegin', Indicators.htmls.lovePD);
        byId('loveDivPD').addEventListener('click', this.listeners.sendLoveRequest);
      }
    },

    updatePlayingIndicators: function (newImgSrc, newTitle) {
      [].forEach.call(qsa("#nowIndAC img, #nowIndPD img, #nowIndicator img"), function(image) {
        image.src = newImgSrc;
        image.title = newTitle;
      });
    },

    indicatePlayNow: function () {
      if (Indicators.indicate != EIndicateState.nowplaying) {
        this.updatePlayingIndicators(chrome.extension.getURL('img/icon_eqB.gif'), "VK scrobbler now playing");
      }

      Indicators.indicate = EIndicateState.nowplaying;
    },

    indicateVKscrobbler: function () {
      if (Indicators.indicate != EIndicateState.logotype) {
        this.updatePlayingIndicators(chrome.extension.getURL('img/icon_eq_pause.png'), "VK scrobbler");
      }

      Indicators.indicate = EIndicateState.logotype;
    },

    indicatePauseScrobbling: function () {
      this.updatePlayingIndicators(chrome.extension.getURL('img/pause.png'), "VK scrobbler paused");

      Indicators.indicate = EIndicateState.paused;
    },

    indicateScrobbled: function () {
      this.updatePlayingIndicators(chrome.extension.getURL('img/checkB.png'), "VK scrobbler: scrobbled");


      Indicators.indicate = EIndicateState.scrobbled;
    },

    indicateLoved: function () {
      [].forEach.call(qsa("#loveDivAC img, #loveDivPD img"), function(image) {
        image.src = chrome.extension.getURL("img/heartB.png");
      });

    },

    indicateNotLove: function () {
      [].forEach.call(qsa("#loveDivAC img, #loveDivPD img"), function(image) {
        image.src = chrome.extension.getURL("img/heartBW.png");
      });
    }
  };
})();



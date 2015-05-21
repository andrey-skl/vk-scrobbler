(function(){
  var EIndicateState = {
    logotype: 0,
    nowplaying: 1,
    scrobbled: 2,
    paused: 3
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
      $("#twitLinkAC, #twitLinkPD").attr("href", link);
    },

    /**
     * Increases mini player width to make place for equalizer icon
     */
    IncreaseMiniPlayerWidth: function () {
      $("#gp").css("min-width", "175px");
      $("#gp_back").css("min-width", "175px");
    },

    SetAudioPageTimeMargin: function () {
      $("#ac_duration").css("margin-right", "13px");
    },
    SetFloatingPlayerTimeMargin: function () {
      $("#pd_duration").css("margin-right", "13px");
    },

    SetMiniIndicator: function () {
      if (!$("#nowIndicator").length) {
        $("#gp_small").append(Indicators.htmls.miniIndicator);

        $("#nowIndicator").click(this.listeners.togglePauseScrobbling);
      }
    },

    SetAcIndicator: function () {
      if ($("#ac").length && !$("#nowIndAC").length) {
        $("#ac_duration").before(Indicators.htmls.acIndicator);
        $("#nowIndAC").click(this.listeners.togglePauseScrobbling);
      }
    },

    SetPdIndicator: function () {
      if ($("#pd").length && !$("#nowIndPD").length) {
        $("#pd_duration").before(Indicators.htmls.pdIndicator);
        $("#nowIndPD").click(this.listeners.togglePauseScrobbling);
      }
    },

    SetTwitterAC: function () {

      if ($("#ac").length && !$("#twitterDivAC").length)
        $("#ac_duration").before(Indicators.htmls.twitAChtml);
    },

    SetTwitterPD: function () {

      if ($("#pd").length && !$("#twitterDivPD").length)
        $("#pd_duration").before(Indicators.htmls.twitPDhtml);
    },

    SetLoveAC: function () {
      if ($("#ac").length && !$("#loveDivAC").length) {
        $("#ac_duration").before(Indicators.htmls.loveAC);
        $("#loveDivAC").click(this.listeners.sendLoveRequest);
      }
    },

    SetLovePD: function () {
      if ($("#pd").length && !$("#loveDivPD").length) {
        $("#pd_duration").before(Indicators.htmls.lovePD);
        $("#loveDivPD").click(this.listeners.sendLoveRequest);
      }
    },

    updateIndicators: function (newImgSrc, newTitle) {
      var $sel = $("#nowIndAC img, #nowIndPD img, #nowIndicator img");
      $sel.attr("src", newImgSrc);
      $sel.attr("title", newTitle);
    },

    indicatePlayNow: function () {
      if (Indicators.indicate != EIndicateState.nowplaying)
        this.updateIndicators(chrome.extension.getURL('img/icon_eqB.gif'), "VK scrobbler now playing");

      Indicators.indicate = EIndicateState.nowplaying;
    },

    indicateVKscrobbler: function () {
      if (Indicators.indicate != EIndicateState.logotype)
        this.updateIndicators(chrome.extension.getURL('img/icon_eq_pause.png'), "VK scrobbler");

      Indicators.indicate = EIndicateState.logotype;
    },

    indicatePauseScrobbling: function () {
      this.updateIndicators(chrome.extension.getURL('img/pause.png'), "VK scrobbler paused");

      Indicators.indicate = EIndicateState.paused;
    },

    indicateScrobbled: function () {
      this.updateIndicators(chrome.extension.getURL('img/checkB.png'), "VK scrobbler: scrobbled");


      Indicators.indicate = EIndicateState.scrobbled;
    },

    indicateLoved: function () {
      $("#loveDivAC img, #loveDivPD img").attr("src", chrome.extension.getURL("img/heartB.png"));

    },

    indicateNotLove: function () {
      $("#loveDivAC img, #loveDivPD img").attr("src", chrome.extension.getURL("img/heartBW.png"));
    }

  };
})();



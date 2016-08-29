(function() {
  'use strict';

  var EIndicateState = window.vkScrobbler.IdicatorsUtils.EIndicateState;
  var PATHS = window.vkScrobbler.IdicatorsUtils.PATHS;
  var optionsHandlers = window.vkScrobbler.optionsHandlers;

  var byId = document.getElementById.bind(document);
  var qs = document.querySelector.bind(document);
  var qsa = document.querySelectorAll.bind(document);

  var Indicators = {
    htmls: {
      indicate: EIndicateState.logotype,
      love: false,
      twitLink: '',

      headerIndicator: `<div id="nowIndicator" class="indicators__status_mini">
          <img class="indicators__icon" title="VK scrobbler: status" src="${PATHS.PAUSE}">
        </div>`,

      acIndicator: `<div id="nowIndAC" class="indicators__status">
          <img class="indicators__icon" title="VK scrobbler: status" src="${PATHS.PAUSE}">
        </div>`,

      pdIndicator: `<div id="nowIndPD" class="indicators__status">
          <img class="indicators__icon" title="VK scrobbler: status" src="${PATHS.PAUSE}">
        </div>`,

      //inline styles is to avoid ADBlock cutting
      twitAChtml: `<div id="twitterDivAC" class="indicators__twit">
          <a id="twitLinkAC" target="_blank" style="display: inline!important;">
            <img class="indicators__icon" title="VK scrobbler: tweet button" src="${PATHS.TWITTER}">
          </a>
        </div>`,

      twitPDhtml: `<div id="twitterDivPD" class="indicators__twit">
          <a id="twitLinkPD" target="_blank" style="display: inline!important;">
            <img class="indicators__icon" title="VK scrobbler: tweet button" src="${PATHS.TWITTER}">
          </a>
        </div>`,

      loveAC: `<div id="loveDivAC" class="indicators__love"><img class="indicators__icon" title="VK scrobbler: love" src="${PATHS.HEART_GRAY}"></div>`,

      lovePD: `<div id="loveDivPD" class="indicators__love"><img class="indicators__icon" title="VK scrobbler: love" src="${PATHS.HEART_GRAY}"></div>`
    },

    setListeners: function(listeners) {
      this.listeners = listeners;
    },

    SetHeaderIndicator: function() {
      Indicators.SetMiniIndicator();
      Indicators.indicateStatus();
    },

    SetAudioPageIndicators: function() {
      Indicators.SetAcIndicator();
      Indicators.SetLoveAC();
      Indicators.SetTwitterAC();
      Indicators.indicateStatus();
    },

    SetDropdownIndicators: function() {
      Indicators.SetPdIndicator();
      Indicators.SetLovePD();
      Indicators.SetTwitterPD();
      Indicators.indicateStatus();
    },

    /**
     * Обновляет текущий статус
     */
    indicateStatus: function() {
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

      Indicators.love ? Indicators.indicateLoved() : Indicators.indicateNotLove();
      this.twitLink && Indicators.setTwitButtonHref(this.twitLink);
    },

    setTwitButtonHref: function(link) {
      this.twitLink = link;
      [].forEach.call(qsa('#twitLinkAC, #twitLinkPD'), function(twitLink) {
        twitLink.href = link;
      });
    },

    SetMiniIndicator: function() {
      optionsHandlers.storageGet(null, (res) => {
        if (res.eq.showTopbar && !byId('nowIndicator') && byId('top_audio')) {
          byId('top_audio').insertAdjacentHTML('beforebegin', Indicators.htmls.headerIndicator);
          byId('nowIndicator').addEventListener('click', this.listeners.togglePauseScrobbling);
        }
      });
    },

    SetAcIndicator: function() {
      if (qs(".page_block .audio_page_player") && !byId("nowIndAC")) {
        qs('.page_block .audio_page_player_volume_slider').insertAdjacentHTML('beforebegin', Indicators.htmls.acIndicator);
        byId('nowIndAC').addEventListener('click', this.listeners.togglePauseScrobbling);
      }
    },

    SetPdIndicator: function() {
      if (qs('.top_audio_layer') && !byId('nowIndPD')) {
        qs('.top_audio_layer .audio_page_player_volume_slider').insertAdjacentHTML('beforebegin', Indicators.htmls.pdIndicator);
        byId('nowIndPD').addEventListener('click', this.listeners.togglePauseScrobbling);
      }
    },

    SetTwitterAC: function() {
      optionsHandlers.storageGet(null, (res) => {
        if (res.twitter && qs(".page_block .audio_page_player") && !byId("twitterDivAC")) {
          qs('.page_block .audio_page_player_volume_slider').insertAdjacentHTML('beforebegin', Indicators.htmls.twitAChtml);
        }
      });
    },

    SetTwitterPD: function() {
      optionsHandlers.storageGet(null, (res) => {
        if (res.twitter && qs('.top_audio_layer') && !byId("twitterDivPD")) {
          qs('.top_audio_layer .audio_page_player_volume_slider').insertAdjacentHTML('beforebegin', Indicators.htmls.twitPDhtml);
        }
      });
    },

    _loveClickListener: function(e) {
      var pulseClassName = 'indicators__love_pulse';
      if (e.target.classList.contains(pulseClassName)) {
        return;
      }
      e.target.classList.add(pulseClassName);

      this.listeners.toggleLove(Indicators.love).then(function() {
        e.target.classList.remove(pulseClassName);
      }, function() {
        e.target.classList.remove(pulseClassName);
      });
    },

    SetLoveAC: function() {
      if (qs('.page_block .audio_page_player') && !byId('loveDivAC')) {
        qs('.page_block .audio_page_player_volume_slider').insertAdjacentHTML('beforebegin', Indicators.htmls.loveAC);
        byId('loveDivAC').addEventListener('click', this._loveClickListener.bind(this));
      }
    },

    SetLovePD: function() {
      if (qs('.top_audio_layer') && !byId('loveDivPD')) {
        qs('.top_audio_layer .audio_page_player_volume_slider').insertAdjacentHTML('beforebegin', Indicators.htmls.lovePD);
        byId('loveDivPD').addEventListener('click', this._loveClickListener.bind(this));
      }
    },

    updatePlayingIndicators: function(newImgSrc, newTitle) {
      [].forEach.call(qsa('#nowIndAC img, #nowIndPD img, #nowIndicator img'), function(image) {
        if (image.src !== newImgSrc) {
          image.src = newImgSrc;
        }
        image.title = newTitle;
      });
    },

    indicatePlayNow: function() {
      Indicators.indicate = EIndicateState.nowplaying;
      this.updatePlayingIndicators(PATHS.PLAYING, "VK scrobbler: now playing");
    },

    indicateVKscrobbler: function() {
      Indicators.indicate = EIndicateState.logotype;
      this.updatePlayingIndicators(PATHS.PAUSE, "VK scrobbler");
    },

    indicatePauseScrobbling: function() {
      Indicators.indicate = EIndicateState.paused;
      this.updatePlayingIndicators(PATHS.DISABLED, "VK scrobbler: paused");
    },

    indicateScrobbled: function() {
      Indicators.indicate = EIndicateState.scrobbled;
      this.updatePlayingIndicators(PATHS.SCROBBLED, "VK scrobbler: scrobbled");
    },

    indicateLoved: function() {
      Indicators.love = true;
      [].forEach.call(qsa("#loveDivAC img, #loveDivPD img"), function(image) {
        image.src = PATHS.HEART_BLUE;
        image.title = "VK scrobbler: Вы любите этот трэк. Кликните, чтобы разлюбить.";
      });

    },

    indicateNotLove: function() {
      Indicators.love = false;
      [].forEach.call(qsa("#loveDivAC img, #loveDivPD img"), function(image) {
        image.src = PATHS.HEART_GRAY;
        image.title = "VK scrobbler: Вы не любите этот трэк. Кликните, чтобы полюбить.";
      });
    }
  };

  /**
   * Export interface
   */

  window.vkScrobbler.Indicators = Indicators;
})();

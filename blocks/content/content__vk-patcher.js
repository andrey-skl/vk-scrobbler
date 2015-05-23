(function () {
  'use strict';

  var ARTIST_ID = "vkScrobblerArtist";
  var TITLE_ID = "vkScrobblerTrackTitle";
  var NEED_SCROBBLE_ID = "vkScrobblerNeedScrobble";
  var POSITION_ID = "vkScrobblerPos";
  var SAVE_ID = "saveCurrentHref";

  var HOLDER_HTML = "<span id=" + ARTIST_ID + ">vknone</span>" +
    " <span id=" + TITLE_ID + ">vknone</span>" +
    "<span id=" + NEED_SCROBBLE_ID + ">vknone</span>" +
    "<span id=" + POSITION_ID + ">vknone</span>" +
    "<span id='" + SAVE_ID + "'></span>";

  window.VkPatcher = {
    setUpTrackInfoHolder: function () {

      //div, в который будет помещаться информация из vk-inner для последующего принятия этим скриптом
      var trackInfoHolderElement = document.createElement("div");
      trackInfoHolderElement.id = "hidedDiv";
      trackInfoHolderElement.style.visibility = "hidden";

      trackInfoHolderElement.innerHTML = HOLDER_HTML;
      document.body.appendChild(trackInfoHolderElement);

      var byId = function (id) {
        return trackInfoHolderElement.querySelector('#' + id);
      };

      return {
        getArtist: function () {
          return byId(ARTIST_ID).textContent;
        },
        getTitle: function () {
          return byId(TITLE_ID).textContent;
        },
        getNeedScrobble: function () {
          return byId(NEED_SCROBBLE_ID).textContent;
        },
        setNeedScrobble: function (value) {
          byId(NEED_SCROBBLE_ID).textContent = value.toString();
        },
        getTrackPosition: function () {
          return byId(POSITION_ID).textContent;
        },
        getDownloadCurrentLink: function () {
          return byId(SAVE_ID).textContent;
        }
      }
    },
    patchPlayer: function () {
      //исполнить скрипт vk_inner в контексте vk.com
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = chrome.extension.getURL("blocks/vk-inner/vk-inner.js");
      document.body.appendChild(script);
    }
  };

})();

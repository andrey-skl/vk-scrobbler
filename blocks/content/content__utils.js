(function () {
  'use strict';

  window.vkScrobbler.ContentUils = {
    getTwitLink: function getTwitLink(artist, track) {
      if (artist == "vknone") return;
      return 'http://twitter.com/home?status='
        + encodeURIComponent("#nowplaying") + " "
        + encodeURIComponent(artist) + " - "
        + encodeURIComponent(track)
        + encodeURIComponent(" via #vkscrobbler")
        + " http://bit.ly/yQg0uN";
    }
  };
})();

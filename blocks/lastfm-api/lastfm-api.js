(function () {
  var lastfm = new LastFMClient(window.LastFmApiConfig);

  window.LastFmApi = {
    scrobble: function scrobble(artist, title, key) {
      var ts = Math.round(new Date().getTime() / 1000);

      lastfm.signedCall('POST', {
        method: 'track.scrobble',
        artist: artist,
        track: title,
        timestamp: ts,
        sk: key
      }).then(function (response) {
        console.info("Композиция " + artist + ": " + title + " заскробблена!", response);
      });
    },

    nowPlaying: function nowPlaying(artist, title, key) {
      lastfm.signedCall('POST', {
        method: 'track.updateNowPlaying',
        artist: artist,
        track: title,
        sk: key
      }).then(function (response) {
        console.info("Композиция " + artist + ": " + title + " отмечена как проигрываемая!");
      });
    },

    makeLoved: function makeLoved(artist, title, key) {
      lastfm.signedCall('POST', {
        method: 'track.love',
        artist: artist,
        track: title,
        sk: key
      }).then(function (response) {
        console.info("Композиция " + artist + ": " + title + " отмечена как любимая!");
      })
    }
  };
})();

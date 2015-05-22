(function () {
  var lastfm = new LastFMClient(window.LastFmApiConfig);

  window.LastFmApi = {
    scrobble: function scrobble(params) {
      var ts = Math.round(new Date().getTime() / 1000);

      return lastfm.signedCall('POST', {
        method: 'track.scrobble',
        artist: params.artist,
        track: params.title,
        timestamp: ts,
        sk: params.key
      }).then(function (response) {
        console.info("Композиция " + params.artist + ": " + params.title + " заскробблена!", response);
      });
    },

    nowPlaying: function nowPlaying(params) {
      return lastfm.signedCall('POST', {
        method: 'track.updateNowPlaying',
        artist: params.artist,
        track: params.title,
        sk: params.key
      }).then(function (response) {
        console.info("Композиция " + params.artist + ": " + params.title + " отмечена как проигрываемая!");
      });
    },

    makeLoved: function makeLoved(params) {
      return lastfm.signedCall('POST', {
        method: 'track.love',
        artist: params.artist,
        track: params.title,
        sk: params.key
      }).then(function (response) {
        console.info("Композиция " + params.artist + ": " + params.title + " отмечена как любимая!");
      });
    },

    getTrackInfo: function (params) {
      return lastfm.signedCall('POST', {
        method: 'track.getInfo',
        artist: params.artist,
        track: params.title,
        username: params.userName,
        sk: params.key
      }).then(function (response) {
        console.info("Информация о композиции: ", response);
        return response;
      });
    }
  };
})();

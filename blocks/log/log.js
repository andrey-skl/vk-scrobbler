// Colors in JavaScript console
// http://stackoverflow.com/a/13017382
(function() {
  const STYLE = {
    main: "color:#FFF;" +
      "padding:3px 5px;" +
      "border-radius: 3px;" +
      "margin-right: 3px;" +
      "line-height: 23px;",
    info: "background: #536DFE;",
    error: "background: #D32F2F;",
    play: "background: #E91E63;",
    scrobble: "background: #009688;"
  };

  var log = {
    // Information
    i: function i(msg) {
      console.info("%cvkScrobbler%c" + " " + msg, STYLE.main + STYLE.info, "");
    },
    // Error
    e: function e(msg) {
      console.info("%cvkScrobbler%c" + " " + msg, STYLE.main + STYLE.error, "");
    },
    // Scrobbled
    // Also checking the response for ignored tracks.
    s: function s(artist, track, response) {
      if (response.scrobbles['@attr'].ignored > 0) {
        console.error("%cvkScrobbler" + "%c✘%c" + artist + " — " + track, STYLE.main + STYLE.error, STYLE.main + STYLE.error, "");
      } else {
        console.info("%cvkScrobbler" + "%c✔%c" + artist + " — " + track, STYLE.main + STYLE.info, STYLE.main + STYLE.scrobble, "");
      }
    },
    // Currently playing
    p: function p(artist, track) {
      console.info("%cvkScrobbler" + "%c♫%c" + artist + " — " + track, STYLE.main + STYLE.info, STYLE.main + STYLE.play, "");
    },
    // Loved
    l: function l(artist, track) {
      console.info("%cvkScrobbler" + "%c❤%c" + artist + " — " + track, STYLE.main + STYLE.info, STYLE.main + STYLE.error, "");
    },
    // Unloved
    u: function u(artist, track) {
      console.info("%cvkScrobbler" + "%c💔%c" + artist + " — " + track, STYLE.main + STYLE.info, STYLE.main + STYLE.error, "");
    },
  };

  window.vkScrobbler.log = log;
})();

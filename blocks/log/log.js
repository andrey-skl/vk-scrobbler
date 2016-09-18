// Colors in JavaScript console
// http://stackoverflow.com/a/13017382
(function () {
  const optionsHandlers = window.vkScrobbler.optionsHandlers;
  const STYLE = {
    main: 'color:#FFF;' +
    'padding:3px 5px;' +
    'border-radius: 3px;' +
    'margin-right: 3px;' +
    'line-height: 23px;',
    info: 'background: #536DFE;',
    error: 'background: #D32F2F;',
    play: 'background: #E91E63;',
    scrobble: 'background: #009688;'
  };

  const consoleWrap = new Proxy(console, {
    get: (target, prop) => {
      let loggingEnabled = false;
      optionsHandlers.storageGet(null, (res) => {
        loggingEnabled = res.loggingEnabled;
      });
      return loggingEnabled ? target[prop] : () => {};
    }
  });

  const log = {
    // Information
    i: function i(msg) {
      consoleWrap.info(`%cvkScrobbler%c ${msg}`, `${STYLE.main}${STYLE.info}`, '');
    },
    // Error
    e: function e(msg) {
      consoleWrap.info(`%cvkScrobbler%c ${msg}`, STYLE.main + STYLE.error, '');
    },
    // Table
    t: function t() {
      consoleWrap.table.apply(this, arguments);
    },
    // Scrobbled
    // Also checking the response for ignored tracks.
    s: function s(artist, track, response) {
      if (response.scrobbles['@attr'].ignored > 0) {
        consoleWrap.error('%cvkScrobbler' + '%c✘%c' + artist + ' — ' + track, STYLE.main + STYLE.error, STYLE.main + STYLE.error, '');
      } else {
        consoleWrap.info('%cvkScrobbler' + '%c✔%c' + artist + ' — ' + track, STYLE.main + STYLE.info, STYLE.main + STYLE.scrobble, '');
      }
    },
    // Currently playing
    p: function p(artist, track) {
      consoleWrap.info('%cvkScrobbler' + '%c♫%c' + artist + ' — ' + track, STYLE.main + STYLE.info, STYLE.main + STYLE.play, '');
    },
    // Loved
    l: function l(artist, track) {
      consoleWrap.info('%cvkScrobbler' + '%c❤%c' + artist + ' — ' + track, STYLE.main + STYLE.info, STYLE.main + STYLE.error, '');
    },
    // Unloved
    u: function u(artist, track) {
      consoleWrap.info('%cvkScrobbler' + '%c💔%c' + artist + ' — ' + track, STYLE.main + STYLE.info, STYLE.main + STYLE.error, '');
    },
  };

  window.vkScrobbler.log = log;
  window.vkScrobbler.log.__style = STYLE;
})();

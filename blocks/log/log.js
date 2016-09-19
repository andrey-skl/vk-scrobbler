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
      const promise = new Promise((resolve) => {
        optionsHandlers.storageGet(null, (res) => {
          resolve(res.loggingEnabled ? target[prop] : () => {});
        });
      });
      return (...args) => {
        return promise.then((func) => { func.apply(null, args); });
      };
    },
  });

  const log = {
    // Information
    i: function i(msg) {
      return consoleWrap.info(`%cvkScrobbler%c ${msg}`, `${STYLE.main}${STYLE.info}`, '');
    },
    // Error
    e: function e(msg) {
      return consoleWrap.info(`%cvkScrobbler%c ${msg}`, STYLE.main + STYLE.error, '');
    },
    // Table
    t: function t() {
      return consoleWrap.table.apply(this, arguments);
    },
    // Scrobbled
    // Also checking the response for ignored tracks.
    s: function s(artist, track, response) {
      if (response.scrobbles['@attr'].ignored > 0) {
        return consoleWrap.error('%cvkScrobbler' + '%c✘%c' + artist + ' — ' + track, STYLE.main + STYLE.error, STYLE.main + STYLE.error, '');
      } else {
        return consoleWrap.info('%cvkScrobbler' + '%c✔%c' + artist + ' — ' + track, STYLE.main + STYLE.info, STYLE.main + STYLE.scrobble, '');
      }
    },
    // Currently playing
    p: function p(artist, track) {
      return consoleWrap.info('%cvkScrobbler' + '%c♫%c' + artist + ' — ' + track, STYLE.main + STYLE.info, STYLE.main + STYLE.play, '');
    },
    // Loved
    l: function l(artist, track) {
      return consoleWrap.info('%cvkScrobbler' + '%c❤%c' + artist + ' — ' + track, STYLE.main + STYLE.info, STYLE.main + STYLE.error, '');
    },
    // Unloved
    u: function u(artist, track) {
      return consoleWrap.info('%cvkScrobbler' + '%c💔%c' + artist + ' — ' + track, STYLE.main + STYLE.info, STYLE.main + STYLE.error, '');
    },
  };

  window.vkScrobbler.log = log;
  window.vkScrobbler.log.__style = STYLE;
})();

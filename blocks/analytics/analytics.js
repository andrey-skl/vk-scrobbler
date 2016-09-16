(function () {
  const log = window.vkScrobbler.log;
  const optionsHandlers = window.vkScrobbler.optionsHandlers;
  const GA_TRACKING_ID = 'UA-37330826-2';
  const GA_URL = 'https://www.google-analytics.com/collect';
  const sendToGA = function(type, ...args) {
    let message = `v=1&tid=${GA_TRACKING_ID}&aip=1&ds=add-on&t=${type}`;

    let argumentNames = type === 'event' ? ['ec', 'ea', 'el', 'ev'] : ['dp'];

    message = message + args
        .map((value, index) => `${argumentNames[index]}=${encodeURIComponent(value)}`)
        .join('&');

    return window.fetch(GA_URL, {
      method: 'POST',
      body: message
    })
      .catch((e) => {
        log.e('Error sending report to Google Analytics.\n' + e);
      });
  };
  window._ga = function() {
    const args = arguments;
    optionsHandlers.storageGet(null, (res) => {
      if (res.gaEnabled) {
        sendToGA.apply(this, args);
      }
    });
  };

  window._ga('pageview');
})();

window.onerror = function (msg, jsFileName, line) {
  const preventErrorAlert = true;
  window._ga('event', 'JS Error', msg, `${navigator.userAgent} -> ${jsFileName} : ${line}`, 0, true);
  return preventErrorAlert;
};

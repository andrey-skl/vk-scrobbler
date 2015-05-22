//ley loading (or getting)
var key = localStorage["skey"] || "";
if (localStorage["skey"]) {
  key = localStorage["skey"];
} else {
  chrome.tabs.create({
    "url": "http://www.lastfm.ru/api/auth/?api_key=da88971ad8342a0298e9a57e6b137dd3",
    "selected": true
  });

  function onAuth() {
    var succUrl = "https://vk.com/registervkscrobbler";

    chrome.tabs.getAllInWindow(null, function (tabs) {
      for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].url.indexOf(succUrl) == 0) {
          chrome.tabs.onUpdated.removeListener(onAuth);
          var arg = tabs[i].url.match(/\?token\=.*/);
          chrome.tabs.update(tabs[i].id, {url: "blocks/auth/auth.html" + arg, active: true}, null);
          return;
        }
      }
    });
  }

  chrome.tabs.onUpdated.addListener(onAuth);

}

var lastfm = new LastFMClient({
  apiKey: 'da88971ad8342a0298e9a57e6b137dd3',
  apiSecret: 'd6ab8020fb035272057220eba51d60b3',
  apiUrl: 'https://ws.audioscrobbler.com/2.0/'
});

function scrobble(artist, title) {
  var ts = Math.round(new Date().getTime() / 1000);

  lastfm.signedCall('POST', {
    method: 'track.scrobble',
    artist: artist,
    track: title,
    timestamp: ts,
    sk: key
  }, function (response) {
    console.info("Композиция " + artist + ": " + title + " заскробблена!", response);
  });
}


function nowPlaying(artist, title) {
  lastfm.signedCall('POST', {
    method: 'track.updateNowPlaying',
    artist: artist,
    track: title,
    sk: key
  }, function (response) {
    console.info("Композиция " + artist + ": " + title + " отмечена как проигрываемая!");
  })
}

function makeLoved(artist, title) {
  lastfm.signedCall('POST', {
    method: 'track.love',
    artist: artist,
    track: title,
    sk: key
  }, function (response) {
    console.info("Композиция " + artist + ": " + title + " отмечена как любимая!");
  })
}

//listener receive info from context script
chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
  tab = sender.tab;
  var artist = request.artist ? RegExp.escape(request.artist) : null;
  var title = request.title ? RegExp.escape(request.title) : null;
  if (request.message == "needScrobble") {
    //console.log(request);
    scrobble(artist, title);
    _gaq.push(['_trackPageview', '/scrobbling']);//трекаем как просмотр страницы
    _gaq.push(['_trackEvent', "scrobbled", artist + ":" + title]);
  }
  if (request.message == "nowPlaying") {
    //console.log(request);
    nowPlaying(artist, title);
    _gaq.push(['_trackEvent', "nowPlaying", artist + ":" + title]);
  }
  if (request.message == "needLove") {
    makeLoved(artist, title);
    _gaq.push(['_trackEvent', "loved", artist + ":" + title]);
  }
  if (request.message == "togglePauseScrobbling") {
    _gaq.push(['_trackEvent', "toggle pause scrobbling", "new status: " + request.paused, artist + ":" + title]);
  }

});

RegExp.escape = function (text) {
  return text.replace(/"/g, "'");
};

window.onerror = function (msg, url, line) {
  var preventErrorAlert = true;
  _gaq.push(['_trackEvent', 'JS Error', msg, navigator.userAgent + ' -> ' + url + " : " + line, 0, true]);
  return preventErrorAlert;
};

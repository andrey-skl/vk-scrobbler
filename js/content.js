var artist;
var track;
var pos;
var lastPos;
var needScrobble = false;
var scrobbleEnabled = true;
var period = 1100;
var periodsToNowPlay = 20;//число периодов, через которые посылается PlayNow  нотификация
var periodNum = 0;


parseinfo();

//div, в который будет помещаться информация из vk_inner для последующего принятия этим скриптом
var hidded = document.createElement("div");
hidded.id = "hidedDiv";
hidded.style.visibility = "hidden";
hidded.innerHTML = "<span id=vkScrobblerArtist>vknone</span> <span id=vkScrobblerTrackTitle>vknone</span>\
<span id=vkScrobblerNeedScrobble>vknone</span><span id=vkScrobblerPos>vknone</span><span id='saveCurrentHref'></span>";
document.body.appendChild(hidded);

//исполнить скрипт vk_inner в контексте vk.com
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = chrome.extension.getURL("js/vk_inner.js");

document.body.appendChild(script);

//вешаем событие на появление мини плеера, чтобы тут же вставить индикаторы
$("body").on("DOMNodeInserted", function (e) {
  if (e.target.id == 'pad_wrap') {
    setTimeout(addIndicators, 100);
  }
});

function parseinfo() {
  addIndicators();
  artist = $('#vkScrobblerArtist').text();
  artist = artist.replace("&amp;", "&");
  track = $('#vkScrobblerTrackTitle').text();
  track = track.replace("&amp;", "&");
  //console.info(artist," - ", track);

  if ($("#vkScrobblerPos").html() != "vknone")
    pos = parseFloat($("#vkScrobblerPos").html());
  else pos = 0;

  check();

  Indicators.setTwitButtonHref(getTwitLink(artist, track));

  setTimeout(parseinfo, period);
}

function check() {
  /*if (artist && artist!='vknone'){
   $("#vkSaveCurrentLinkAC, #vkSaveCurrentLinkPD").show();
   }*/
  if (scrobbleEnabled) {
    if ($("#vkScrobblerNeedScrobble").html() == 'true') {
      needScrobble = true;
      periodNum = periodsToNowPlay;
      $("#vkScrobblerNeedScrobble").html('false');
      //сменился трек
      trackChanged();
    }
    if (needScrobble)	//если ожидается скробблинг, то по достижении пол трека скробблим
    {
      if (pos != lastPos) {
        if (periodNum > periodsToNowPlay) {
          sendNowPlayingRequest();
          periodNum = 0;
        }
        Indicators.indicatePlayNow();
      } else Indicators.indicateVKscrobbler();

      lastPos = pos;
      periodNum++;

      //console.info("Len:"+len+"; pos:"+pos);
      if (pos >= 50) //отправим после того как половина трека проиграется
      {
        sendScrobleRequest();
        Indicators.indicateScrobbled();
        needScrobble = false;
      }
    }
  } else Indicators.indicatePauseScrobbling();
}

function trackChanged() {
  //сбрасываем индикатор любимой песни
  Indicators.indicateNotLove();
}

//add indicators if they not exist
function addIndicators() {
  Indicators.IncreaseMiniPlayerWidth();

  Indicators.SetMiniIndicator();

  //добавляем индикатор к верхней панели на странице аудиозаписей
  Indicators.SetAllAC();

  //Добавляем индикатор к всплывающему плееру
  Indicators.SetAllPD();

  Indicators.indicateStatus();
}

function togglePauseScrobbling() {
  scrobbleEnabled = !scrobbleEnabled;
  if (scrobbleEnabled) {
    if (pos > 50)
      Indicators.indicateScrobbled();
    else Indicators.indicateVKscrobbler();
  } else {
    Indicators.indicatePauseScrobbling();
  }
  sendPauseStatus(!scrobbleEnabled);
}
/*function saveCurrentTrack(e){
 if (!artist || artist=='vknone'){
 e.stopPropagation();
 return false;
 }
 var fileName = artist+" - "+track + ".mp3";
 var href = $('#saveCurrentHref').text();
 $(this).attr("href", href+"/"+fileName);
 $(this).attr("download", fileName);

 }*/

function getTwitLink(artist, track) {
  if (artist == "vknone") return;
  var twtLink = 'http://twitter.com/home?status=' + encodeURIComponent("#nowplaying") + " " +
    encodeURIComponent(artist) + " - " + encodeURIComponent(track) + encodeURIComponent(" via #vkscrobbler") + " http://bit.ly/yQg0uN";
  return twtLink;
}

function sendScrobleRequest() {
  if (artist != "vknone" && title != "vknone")
    chrome.extension.sendRequest({message: "needScrobble", artist: artist, title: track}, function (obj) {
    });
  else console.info("none artist detected");
}

function sendNowPlayingRequest() {
  if (artist != "vknone" && title != "vknone")
    chrome.extension.sendRequest({message: "nowPlaying", artist: artist, title: track}, function (obj) {
    });
  else console.info("none artist detected");
}

function sendLoveRequest() {
  chrome.extension.sendRequest({message: "needLove", artist: artist, title: track}, function (obj) {
  });
  Indicators.indicateLoved();
}

function sendPauseStatus(paused) {
  chrome.extension.sendRequest({
    message: "togglePauseScrobbling",
    paused: paused,
    artist: artist,
    title: track
  }, function (obj) {
  });
}

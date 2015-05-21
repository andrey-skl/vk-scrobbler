var timerTryer = setInterval(tryToAttachScrobblerListeners, 1000);


function tryToAttachScrobblerListeners() {
  if (typeof audioPlayer != 'undefined') {

    var ARTIST_NUM = 5;
    var TITLE_NUM = 6;
    var SAVE_LINK = 2;

    var playedTime = 0;

    //вызывается ли прямо сейчас метод audioPlayer.operate
    var IsPlayerOperating = false;

    var posElem = document.getElementById('vkScrobblerPos');
    var artistElem = document.getElementById('vkScrobblerArtist');
    var titleElem = document.getElementById('vkScrobblerTrackTitle');
    var needScrobbleElem = document.getElementById('vkScrobblerNeedScrobble');
    var saveCurrentLinkElem = document.getElementById('saveCurrentHref');

    //вешаем слушатель переключения песен
    audioPlayer.operate = Function.addCallListener(audioPlayer.operate, {
      before: function (props) {
        //console.log('before operate', props);
        IsPlayerOperating = true;
      },
      after: function (props) {
        IsPlayerOperating = false;
      }
    });

    //вешаем слушатель начала новой песни
    audioPlayer.loadGlobal = Function.addCallListener(audioPlayer.loadGlobal, {
      after: function (props) {
        //слушаем только те loadGlobal, которые вызываются метоом operate
        if (!IsPlayerOperating) return;
        IsPlayerOperating = false;

        playedTime = 0;

        var lastVkScrobblerPos = posElem.innerHTML;

        //ждём пока позиция изменится и только тогда говорим, что пора скробблить (чтобы не заскробблить текущую песню дважды)
        var timeout = setInterval(function () {
          if (posElem.innerHTML != lastVkScrobblerPos) {
            needScrobbleElem.innerHTML = 'true';
            clearInterval(timeout);
          }
        }, 1000);
        //console.log('after loadGlobal', props);
      }
    });

    //вешаем слушатель прогресса песни
    audioPlayer.onPlayProgress = Function.addCallListener(audioPlayer.onPlayProgress, {
      after: function (props) {
        //сохраняем исполнителя и песню
        artistElem.innerHTML = audioPlayer.lastSong[ARTIST_NUM];
        titleElem.innerHTML = audioPlayer.lastSong[TITLE_NUM];

        saveCurrentLinkElem.innerHTML = audioPlayer.lastSong[SAVE_LINK];

        if (needScrobbleElem.innerHTML == 'vknone')
          needScrobbleElem.innerHTML = 'true';

      }
    });

    var timeStamp = 0;

    setInterval(function () {
        if (playedTime == 0) {
          timeStamp = new Date(new Date() - 1000);
        }

        var timeDiff = new Date() - timeStamp;
        timeStamp = new Date();

        if (currentAudioId() && !audioPlayer.player.paused()) {

          //сохраняем проигранного времени в песне
          playedTime += timeDiff / 1000;

          playedPercent = playedTime / audioPlayer.duration * 100;
          if (playedPercent == Infinity) curPos = 0;
          posElem.innerHTML = playedPercent;

          /*console.log("log",{
           playedTime: playedTime,
           duration: audioPlayer.duration,
           playedPercent: playedPercent,
           timeDiff: timeDiff,
           timeStamp: timeStamp,
           });*/
        }
      }
      , 1000);

    //отключаем попытки навесить слушатели
    clearInterval(timerTryer);

  }
}

//добавляем прототип слушатель
Function.addCallListener = function (func, callbacks) {
  var successNumber = 0,
    errorNumber = 0,
    name = func.name;

  return function () {
    var args = [].slice.call(arguments);
    var result, error;

    var props = {
      args: args,
      self: this,
      name: name
    };


    callbacks.before && callbacks.before(props);

    try {
      result = func.apply(this, arguments);
      props.successNumber = ++successNumber;
      props.result = result;
      props.status = 'success';
      callbacks.success && callbacks.success(props);
    } catch (e) {
      props.errorNumber = ++errorNumber;
      props.error = e;
      props.status = 'error';
      callbacks.error && callbacks.error(props);
    }

    callbacks.after && callbacks.after(props);

    return result;
  }
};

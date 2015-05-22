(function () {
  var DEBUG = false;
  var ARTIST_NUM = 5;
  var TITLE_NUM = 6;
  var SAVE_LINK = 2;

  var playedTime = 0;

  //вызывается ли прямо сейчас метод audioPlayer.operate
  var IsPlayerOperating = false;

  var postitionElem = document.getElementById('vkScrobblerPos');
  var artistElem = document.getElementById('vkScrobblerArtist');
  var titleElem = document.getElementById('vkScrobblerTrackTitle');
  var needScrobbleElem = document.getElementById('vkScrobblerNeedScrobble');
  var saveCurrentLinkElem = document.getElementById('saveCurrentHref');

  var timerTryer = setInterval(tryToAttachScrobblerListeners, 1000);

  function tryToAttachScrobblerListeners() {
    if (typeof audioPlayer != 'undefined') {

      //вешаем слушатель переключения песен
      audioPlayer.operate = addCallListener(audioPlayer.operate, {
        before: function (props) {
          IsPlayerOperating = true;
        },
        after: function (props) {
          IsPlayerOperating = false;
        }
      });

      //вешаем слушатель начала новой песни
      audioPlayer.loadGlobal = addCallListener(audioPlayer.loadGlobal, {
        after: function (props) {
          //слушаем только те loadGlobal, которые вызываются метоом operate
          if (!IsPlayerOperating) {
            return;
          }
          IsPlayerOperating = false;

          playedTime = 0;

          var lastVkScrobblerPos = postitionElem.innerHTML;

          //ждём пока позиция изменится и только тогда говорим, что пора скробблить (чтобы не заскробблить текущую песню дважды)
          var timeout = setInterval(function () {
            if (postitionElem.innerHTML != lastVkScrobblerPos) {
              needScrobbleElem.innerHTML = 'true';
              clearInterval(timeout);
            }
          }, 1000);
        }
      });

      //вешаем слушатель прогресса песни
      audioPlayer.onPlayProgress = addCallListener(audioPlayer.onPlayProgress, {
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
            if (playedPercent == Infinity) {
              curPos = 0;
            }
            postitionElem.innerHTML = playedPercent;

            DEBUG && console.debug("vk scrobbler log", {
              playedTime: playedTime,
              duration: audioPlayer.duration,
              playedPercent: playedPercent,
              timeDiff: timeDiff,
              timeStamp: timeStamp
            });
          }
        }
        , 1000);

      //отключаем попытки навесить слушатели
      clearInterval(timerTryer);

    }
  }

  /**
   * Adds listener to function's calls by monkey patching
   * @param func - function to listen
   * @param callbacks
   * @returns {Function} - patched function
   */
  function addCallListener(func, callbacks) {
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
  }
})();

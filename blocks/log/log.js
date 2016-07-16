// Colors in JavaScript console
// http://stackoverflow.com/a/13017382
(function() {
  var log = {
  i: function i(msg) {
    var css = "background: #536DFE;color:#FFF;padding:3px;border-radius: 3px;line-height: 23px;";
    console.log("%cvkScrobbler%c" + " " + msg, css, "");
  },
  e: function e(msg) {
    var css = "background: #D32F2F;color:#FFF;padding:3px;border-radius: 3px;line-height: 23px;";
    console.log("%cvkScrobbler%c" + " " + msg, css, "");
  }
};

window.vkScrobbler.log = log;
})();

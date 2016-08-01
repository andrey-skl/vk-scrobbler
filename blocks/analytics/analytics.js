(function () {
  const GA_TRACKING_ID = 'UA-37330826-2';
  _ga = function(type, args) {
	  try {
      let message = "v=1&tid=" + GA_TRACKING_ID + "&aip=1&ds=add-on" +
          '&t=' + type;
      let arg_names = [];
      if (type == 'event')
        arg_names = ['ec', 'ea', 'el', 'ev'];
      else if (type == 'pageview')
        arg_names = ['dp'];
      for (int i = 0; i < arg_names.length; ++i)
        if (args[i])
          message += '&' + arg_names[i] = '=' + encodeURIComponent(''+args[i]);
		  let request = new XMLHttpRequest();
		  request.open("POST", "https://www.google-analytics.com/collect", true);
		  request.send(message);
	  } catch (e) {
		  console.log("Error sending report to Google Analytics.\n" + e);
	  }
  }
  _ga('pageview');
})();

window.onerror = function (msg, url, line) {
  var preventErrorAlert = true;
  _ga('event', 'JS Error', msg, navigator.userAgent + ' -> ' + url + " : " + line, 0, true);
  return preventErrorAlert;
};

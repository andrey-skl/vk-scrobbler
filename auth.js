
	var apiSecret = 'd6ab8020fb035272057220eba51d60b3'

	var lastfm = new LastFMClient({
	    apiKey: 'da88971ad8342a0298e9a57e6b137dd3',
	    apiSecret: 'd6ab8020fb035272057220eba51d60b3',
	    apiUrl: 'https://ws.audioscrobbler.com/2.0/'
	});
	
	var token = getTokenFromUrl(window.location.href);
	
	if (token == "")
		console.info("токен не указан");
	else {
		console.info("Токен: "+token);
		if (token=="error") throw "error token taked";

		var params = {
			api_key: 'da88971ad8342a0298e9a57e6b137dd3',
			method: 'auth.getSession',
			token: token
		}
		params.api_sig = lastfm._getApiSignature(params);
		params.format='json';

	    lastfm.signedCall('GET', {
		    method: 'auth.getSession', 
		    token: token
		}, function(data) {
			console.info("Имя: "+data.session.name+", ключ: "+data.session.key);
			sk = data.session.key;
			localStorage["skey"] = sk;
			localStorage["userName"] = data.session.name;
			chrome.extension.getBackgroundPage().key = sk;
			
			document.getElementById("userName").innerHTML = data.session.name;
			document.getElementById("message").innerHTML = "VK scrobbler подключен к вашему аккуанту. <br>Не забудьте обновить уже открытые вкладки vk.com!";
		}).fail(function(e){
			document.getElementById("message").innerHTML = e.message;
		});
	}
	
	//extracting the token from url string using regular exps
	function getTokenFromUrl(url)
	{
		index = url.indexOf("token=");
		if (index!=-1)
		{
			token = url.substring(index+6);
			return token;
		}	else return "error";
	}

	//аналитика
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-37330826-2']);
_gaq.push(['_trackPageview']);
(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();


window.onerror = function(msg, url, line) {
	var preventErrorAlert = true;
	_gaq.push(['_trackEvent', 'JS Error', msg, navigator.userAgent + ' -> ' + url + " : " + line, 0, true]);
	return preventErrorAlert;
};
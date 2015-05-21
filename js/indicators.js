var EIndicateState = {
	logotype: 0,
	nowplaying: 1,
	scrobbled: 2,
	paused: 3
}

var Indicators = {
	htmls: {
		indicate : 0, //:EIndicateState: 0 - лого, 1 - науплеинг, 2 - скробблед, 3 - paused

		miniIndicator : "<div id=nowIndicator style='float:left; padding: 3px;'><img title='VK scrobbler' src="+
			chrome.extension.getURL("img/icon_eq_pause.png")+"></div>",

		acIndicator : "<div id=nowIndAC style='float: right; padding-right: 3px; max-height: 14px; cursor: pointer;'><img title='VK scrobbler' src="+
			chrome.extension.getURL("img/icon_eq_pause.png")+"></div>",

		pdIndicator : "<div id=nowIndPD style='float: right; padding-right: 3px; max-height: 14px; cursor: pointer;'><img title='VK scrobbler' src="+
			chrome.extension.getURL("img/icon_eq_pause.png")+"></div>",

		twitAChtml: "<div id='twitterDivAC' style='float:right; padding-right:3px; max-height: 14px;'>\
		<a id=twitLinkAC target=_blank><img title='VK scrobbler TWIT button' src="+chrome.extension.getURL("img/twitter.png")+"></a>\
		</div>",

		twitPDhtml : "<div id='twitterDivPD' style='float:right; padding-right:3px; max-height: 14px;'>\
		<a id=twitLinkPD target=_blank><img title='VK scrobbler TWIT button' src="+chrome.extension.getURL("img/twitter.png")+"></a>\
		</div>",

		loveAC : "<div id='loveDivAC' style='float:right; padding-right:3px; max-height: 14px; cursor: pointer;'>\
		<img title='VK scrobbler LOVE button' src="+chrome.extension.getURL("img/heartBW.png")+"></div>",

		lovePD : "<div id='loveDivPD' style='float:right; padding-right:3px; max-height: 14px; cursor: pointer;'>\
		<img title='VK scrobbler LOVE button' src="+chrome.extension.getURL("img/heartBW.png")+"></div>",

		/*saveAC : "<a id='vkSaveCurrentLinkAC' onclick='event.cancelBubble=true;' style='display:none;'>\
		<img title='Сохранить трек' src="+chrome.extension.getURL("img/save.gif")+"></a>",

		savePD : "<a id='vkSaveCurrentLinkPD'  onclick='event.cancelBubble=true; style='display:none;'>\
		<img title='Сохранить трек' src="+chrome.extension.getURL("img/save.gif")+"></a>",*/
	},

	SetAllAC: function(){
	    Indicators.SetAudioPageTimeMargin(); //смещаем таймер, чтобы не уплыл
	    Indicators.SetAcIndicator();
	    Indicators.SetLoveAC();
		Indicators.SetTwitterAC();
	},

	SetAllPD: function(){
		Indicators.SetFloatingPlayerTimeMargin();
	   	Indicators.SetPdIndicator();
		Indicators.SetLovePD();
		Indicators.SetTwitterPD();
	},

	indicateStatus: function(){
		switch(Indicators.indicate){
			case EIndicateState.nowplaying:
				Indicators.indicatePlayNow(); 
			break;
			case EIndicateState.scrobbled:
				Indicators.indicateScrobbled(); 
			break;
			case EIndicateState.logotype:
				Indicators.indicateVKscrobbler();
			break;
			case EIndicateState.paused:
				Indicators.indicatePauseScrobbling();
			break;
		}
	},

	setTwitButtonHref: function(link)
	{
		$("#twitLinkAC, #twitLinkPD").attr("href", link );
	},

	IncreaseMiniPlayerWidth: function(){
		$("#gp").css("min-width", "175px");
		$("#gp_back").css("min-width", "175px");
	},

	SetAudioPageTimeMargin: function(){
		$("#ac_duration").css("margin-right", "13px");
	},
	SetFloatingPlayerTimeMargin: function(){
		$("#pd_duration").css("margin-right", "13px");
	},

	SetMiniIndicator: function(){
		if ( !$("#nowIndicator").length)
		{
			$("#gp_small").append( Indicators.htmls.miniIndicator );

			$("#nowIndicator").click(togglePauseScrobbling);
		}
	},

	SetAcIndicator: function(){
		if ( $("#ac").length && !$("#nowIndAC").length )
		{
			$("#ac_duration").before( Indicators.htmls.acIndicator );
			$("#nowIndAC").click(togglePauseScrobbling);
			//$("#ac_name").append(Indicators.htmls.saveAC);
			//$("#vkSaveCurrentLinkAC").click(saveCurrentTrack);
		}
	},

	SetPdIndicator: function(){
		if ( $("#pd").length && !$("#nowIndPD").length )
		{
			$("#pd_duration").before( Indicators.htmls.pdIndicator );
			//$("#pd_name").append(Indicators.htmls.savePD);
			$("#nowIndPD").click(togglePauseScrobbling);
			//$("#vkSaveCurrentLinkPD").click(saveCurrentTrack);
		}
	},

	SetTwitterAC: function(){

		if ( $("#ac").length && !$("#twitterDivAC").length )
			$("#ac_duration").before( Indicators.htmls.twitAChtml );
	},

	SetTwitterPD: function(){

		if ( $("#pd").length && !$("#twitterDivPD").length )
			$("#pd_duration").before( Indicators.htmls.twitPDhtml );
	},

	SetLoveAC: function(){
		if ( $("#ac").length && !$("#loveDivAC").length )
		{
			$("#ac_duration").before( Indicators.htmls.loveAC );
			$("#loveDivAC").click(sendLoveRequest);
		}
	},

	SetLovePD: function(){
		if ( $("#pd").length && !$("#loveDivPD").length )
		{
			$("#pd_duration").before( Indicators.htmls.lovePD );
			$("#loveDivPD").click(sendLoveRequest);
		}
	},

	updateIndicators: function(newImgSrc, newTitle){
		var $sel = $("#nowIndAC img, #nowIndPD img, #nowIndicator img");
		$sel.attr("src", newImgSrc);
		$sel.attr("title", newTitle);
	},

	indicatePlayNow: function(){
		if (Indicators.indicate!=EIndicateState.nowplaying)
			this.updateIndicators(chrome.extension.getURL('img/icon_eqB.gif'), "VK scrobbler now playing");

		Indicators.indicate = EIndicateState.nowplaying;
	},

	indicateVKscrobbler: function(){
		if (Indicators.indicate!=EIndicateState.logotype)
			this.updateIndicators(chrome.extension.getURL('img/icon_eq_pause.png'), "VK scrobbler");

		Indicators.indicate = EIndicateState.logotype;
	},

	indicatePauseScrobbling: function(){
		this.updateIndicators(chrome.extension.getURL('img/pause.png'), "VK scrobbler paused");

		Indicators.indicate = EIndicateState.paused;
	},

	indicateScrobbled: function(){
		this.updateIndicators(chrome.extension.getURL('img/checkB.png'), "VK scrobbler: scrobbled");


		Indicators.indicate = EIndicateState.scrobbled;
	},

	indicateLoved: function(){
		$("#loveDivAC img, #loveDivPD img").attr("src",	chrome.extension.getURL("img/heartB.png") );

	},

	indicateNotLove: function(){
		$("#loveDivAC img, #loveDivPD img").attr("src",	chrome.extension.getURL("img/heartBW.png") );
	},
	showSaveButton: function(){
		var $sel = $("#pd_name, #ac_name").append;	
	}

}
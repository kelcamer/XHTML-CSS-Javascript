/*
 		USA TODAY Modal Video Players
		
		Depends:
	 	- Flash
	 	- Javascript
	 	- jQuery Tools Overlay
	 	- Brightcove
 
*/

;(function($) {
	
	var section = usat.contentType || "news",
		 defaultParams = {
					"autoStart"				: "true",
					"width"					: "600",
					"isVid"					: "true",
					"dynamicStreaming"	: "true",
					"bgcolor"				: "#000000",
					"adServerURL"			: "http://gannett.gcion.com/addyn/3.0/5111.1/778078/0/0/header=yes;cc=2;alias=www.usatoday.com/video/" + section + "/immersive_PreRoll;cookie=info;key=42806346001;adct=204;grp=12345",
					"publisherID"			: "29906170001",
					"division"				: "usatoday",
					"omnitureAccountID" 	: "usatodayprod",
					"sstsCode"				: "news",
					"linkBaseURL"			: "http://www.usatoday.com/video/index.htm"
		},
		playerId = "modalVideoPlayer",
		playerTypes = {
					"video" : "86874850001",
					"playlist" : "85331262001"
		}
		;


	function AdBuilder(adXML) {
	
		var video, 
			 companion,
			 doc
			 ;

		function getCompanion(element) {

			var type = $(element).attr("type");

			if (typeof type !== 'undefined') {

				if (type === 'iframe') {
					return getIFrame(element.firstChild.nodeValue);						
				}
			}

			return undefined;
		}

		function getDefault(sstsValue){
			var url = "http://gannett.gcion.com/adiframe/3.0/5111.1/778078/0/0/header=yes;cc=2;alias=www.usatoday.com/video/"
					+ sstsValue
					+ "/immersive_Video_Banner_300;cookie=info;key=42806346001;adct=204;grp=12345";

			return getIFrame(url);		
		}

		function getIFrame(src) {
			return "<iframe src='"+src+"' width='300' height='250' marginheight='0' hspace='0' vspace='0' frameborder='0' scrolling='no'></iframe>";
		}
		

		if (typeof adXML === 'string') {
			adXML = adXML.replace(/&/gm, "%26");
		}
		
		doc = (function() {
	
			if (typeof adXML === 'string' && adXML.length > 0) {

				if (window.ActiveXObject) {

					var xml = new ActiveXObject("Microsoft.XMLDOM");
				  		 xml.async = false;
					 	 xml.loadXML(adXML);
				
					return xml;

				} else if (window.XMLHttpRequest) {
					return (new DOMParser()).parseFromString(adXML, "text/xml");
				}

			}

			return undefined;
							 
		})();
		
		if (doc) {
		
			var root = doc.firstChild;
			var nodes = root.children || root.childNodes;

			video = {};

			video.type = "videoAd";
			video.duration = $(root).attr("duration") || 15;
			video.trackPointTime = $(root).attr("trackPointTime") || 0;
			
			if (typeof $(root).attr("trackStartURLs") !== 'undefined') { video.trackStartURLs = root.getAttribute("trackStartURLs").split(","); }
			if (typeof $(root).attr("trackMidURLs") !== 'undefined')   { video.trackMidURLs = root.getAttribute("trackMidURLs").split(","); }
			if (typeof $(root).attr("trackEndURLs") !== 'undefined')   { video.trackEndURLs = root.getAttribute("trackEndURLs").split(","); }
			if (typeof $(root).attr("trackPointURLs")!== 'undefined') { video.trackPointURLs = root.getAttribute("trackPointURLs").split(","); }
			
			$(nodes).each(function(i, element){	
				switch (element.nodeName) {				
					case "videoURL":
				   	video.videoURL = element.firstChild.nodeValue;
						break;
					case "videoClickURL":
						video.videoClickURL = element.firstChild.nodeValue;
						break;
					case "expandedBannerURL":
						companion = getCompanion(element);
						break;
				}
			});	
		}

		if (typeof companion === "undefined") {
			companion = getDefault(section);
		}

		return {
		   companion: companion,
			video: video
		};

	}

	function Player() {}	 

	// initialize player
	Player.prototype.init = function($elements) {

		var me = this;

		$("body").append("<div id='video-overlay' class='overlay'><div id='player'></div><div id='companion' style='float:left; position:absolute; top:25px; right:20px;'></div></div>");		

		// load brightcove api scripts...
		$.getScript("http://admin.brightcove.com/js/BrightcoveExperiences_all.js", function() {
 	
				window.onTemplateLoaded = me.onTemplateLoaded;

				$elements
					.attr("rel", "#video-overlay")
					.overlay({			  
						onClose: function() {
							brightcove.removeExperience(playerId);
							$("#video-overlay #companion").html("");
						},
						onLoad: function(e) {

							var $t = this.getTrigger(),
								 params = {}
								 ;
						
							if ($t.attr("video")) {
							
								$.extend(params, defaultParams, {
									"@videoPlayer": $t.attr("video"),
									"playerID": playerTypes["video"],
									"isUI": "",
									"height": "384"									
								});

							} else if ($t.attr("playlist")) {
								
								$.extend(params, defaultParams, {
									"@videoList": $t.attr("playlist"),
									"playerID": playerTypes["playlist"],
									"isUI": "true",
									"height": "585"
								});

							}

							// params.adServerURL = params.adServerURL.replace("#section#", section); // TODO: Switch out to read from page somehow...

							me.load(this.getOverlay(), params);
						}
				});
		});

	}

	// load & show modal player...
	Player.prototype.load = function($overlay, params) {

		var embed = brightcove.createElement("object"),
			 parameter
			 ;

		embed.id = playerId;

		for (var i in params) {

			parameter = brightcove.createElement("param");
			parameter.name = i;
			parameter.value = params[i];

			embed.appendChild(parameter);
		}

		brightcove.createExperience(embed, $overlay.find("#player")[0], true);
	}	

	Player.prototype.show = function(paramOpts) {
		// TODO: Show from other sources like flash...
		//	var p = $.extend(defaultParams, paramOpts);
	}

	Player.prototype.onTemplateLoaded = function(id) {
	
		var experience = brightcove.getExperience(id);

		var advertising = experience.getModule(APIModules.ADVERTISING),
			 social		 = experience.getModule(APIModules.SOCIAL),
			 videoPlayer = experience.getModule(APIModules.VIDEO_PLAYER)
		    ;

		advertising.enableExternalAds();	

		advertising.addEventListener(BCAdvertisingEvent.AD_RECEIVED, function(response) {
							
			if (typeof response !== 'undefined' && response.hasOwnProperty("ad")) {
			
				if (response.ad.indexOf("<SynchedBanner300x250") === -1) {
				
					var ad = new AdBuilder("");

					$("#video-overlay #companion").html(ad.companion);
				}

			}
							 
		});

		advertising.addEventListener(BCAdvertisingEvent.EXTERNAL_AD, function(response) {

			if (typeof response !== 'undefined' && response.hasOwnProperty("ad")) {

				var ad = new AdBuilder(response.ad);

				if (ad.video !== 'undefined') {
					advertising.showAd(ad.video);
				} else {
					advertising.resumeAfterExternalAd();
				}

				if (ad.companion !== 'undefined') {
					$("#video-overlay #companion").html(ad.companion);
				}

			} else { advertising.resumeAfterExternalAd(); }

		});	

	}

	var player = new Player;

	window.usatVideo = player;	// TODO: change to something more unique?

	// ready...
	$(function() {

		var $el = $("*[video], *[playlist]");
		
		if ($el.length > 0) {

			player.init($el);
		}

	});
		
})(jQuery);
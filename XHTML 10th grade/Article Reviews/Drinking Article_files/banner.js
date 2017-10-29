if (typeof GEL == 'undefined' || !GEL ) GEL= { util: new Object() }; 
GEL.namespace("widget"); 
(function(){
function scrubKeyvalues(keyvalues){ 
	var _ret= {}; 
	if(typeof keyvalues === 'string')
		_ret= (function(){ 
			var _a= keyvalues.split(/[\s\&\,]+/),_ret= {};
			for(var i=0,l=_a.length,o=_a[i]; i < l; o=_a[++i]){
				o= o.split("="); 
				_ret[o[0]]= o[1]; 
			}
			return _ret; 
		})(); 
	else 
		_ret= GEL.objectUtil.copy(keyvalues); 
	for (var n in _ret){
		var v= _ret[n]; 
		delete _ret[n]; 
		n= n.replace(_KEY_RE, "_"); 
		v= v.replace(_KEY_RE, "_"); 
		_ret[n]= v; 
	}
	return _ret; 
}
function scrubWords(words){ 
	var _ret= [],_a; 
	if(typeof words == 'string')
		_a= words.split(/[\s,_\&]+/);
	else if(words instanceof Array)
		_a= words; 
	else
		return []; 
		
	for(var i=0,l=_a.length,w=_a[i]; i<l; w= _a[++i]) 
		if((w= scrubWord(w)))_ret.push(w); 
	return _ret;
}
function scrubWord(word){
	if(typeof word != 'string') return null; 
	word= word.replace(_KEY_RE, ""); 
	if(
		word 
		&& !word.match(/^-$/) 
		&& !(word.toLowerCase() in _IGNORE_KEYWORDS) 
	) 
		return word; 
	else 
		return ; 

}
var 
	_G= GEL, 
	_GC= _G.config, 
	_BANNER_IDX= 0, 
	_KEY_RE= new RegExp("(<[^>]+>)|[^A-Za-z0-9\-]", "g"),
	_COPYFN= _G.objectUtil.copy, 
	
	_IGNORE_KEYWORDS= _G.arrayUtil.toObject(
"a,about,above,an,and,beyond,for,how,her,him,his,i,in,no,of,of,on,or,she,that,that,that,the,the,these,this,those,to,were,what,when,where,you"
.split(",")
	),
	_TITLE= GEL.namespace("thepage.pageinfo").title || document.title, 
	_DEFAULT= { } 
;
_DEFAULT.keywords= (function(){
	var _words= null; 
	if (
		"KeyWords" in _GC 
		&& (typeof _GC.KeyWords=='string' || _GC.KeyWords instanceof Array)  
		&& _GC.KeyWords.length > 0 
	) 
			_words= scrubWords(_GC.KeyWords); 

		if(!_words || _words.length <= 0)  
			_words= scrubWords(_TITLE);
		return _words; 
})();
_DEFAULT.keyvalues= scrubKeyvalues(_GC.KeyValues);
if(!_DEFAULT.keyvalues.title) 
_DEFAULT.keyvalues.title= encodeURIComponent(
	_TITLE
		.replace(/\s+/g,"-")
		.replace(_KEY_RE,"")
);
_GC.KeyWords= _DEFAULT.keywords; 
_GC.KeyValues= _DEFAULT.keyvalues; 
GEL.widget.AdBanner= function(options){ 
	this.config= {}; 
	var  
		_superC= GEL.widget.AdBanner.superclass.constructor, 
		_contentDestination, 
		_fetcher
	; 
	if(_superC) 
		_superC.apply(this, arguments); 
	this.position= this.config.adPosition= options.position;
	if(!this.config.adPosition){ 
		throw new Error("Must supply a unique position");
	}
	this.state= 'preattach';
	this.marker= options.marker; 
	this.id= options.id || "__gelwidget_adbanner_" + _BANNER_IDX++;  
	this.config.KEYVALUE_LIMIT= 20; 
	this.config.warningImage= options.aggit || null; 
	this.config.rotate= 'rotate' in options ? options.rotate : true; 
	this.config.reload= 'refresh' in options ? options.refresh : true; 
	this.config.loadType= 'load' in options ? options.load : 'post'; 
	this.config.loadOnInit= 'loadoninit' in options ? options.loadoninit : true; 
	this.config.priority= 'priority' in options ? options.priority : 11; 
	this.config.size= 'size' in options ? options.size : false; 
	this.config.keywords= []; 
	if('keywords' in options)
		this.setKeywords(options.keywords); 
	else 
		this.config.keywords= GEL.arrayUtil.copy(_DEFAULT.keywords);
	;  
	this.config.keyvalues= {}; 
	if('keyvalues' in options) 
		this.setKeyvalues(options.keyvalues);
	else 
		this.config.keyvalues= GEL.objectUtil.copy(_DEFAULT.keyvalues)
	;
	this.loadcount= 0; 
	this.contentElement= 
		this.attachTo= options.attachTo || 
			createAttachElement(this.marker, this.id);
	this.loadBanner= this.attach= this.attach(); 
	function createAttachElement(marker,id){ 
		var 
			_el= GEL.ement("DIV", {id: "adcontainer_" + id}),
			_p= null 
		; 
		if(!marker){ 
			if(GEL.thepage.isready) return document.body;
			GEL.log('writing out element ' + _el.asHTML()); 
			_el.write(); 
			return el; 
		}else if(marker instanceof GEL.Element.Base) { 
			marker= marker.getElement(); 
		}
		_p= marker.parentNode
		_p.insertBefore(_el.getElement(), marker); 
		return _el; 
	}
}
GEL.extend(GEL.widget.AdBanner, GEL.event.Publisher,{ 
	getUrl: function(){ 
		if(this.config.url) return this.config.url; 
		return ""; 
	},
	insertBefore: function(dest){ 
		this.contentElement.insertBefore(dest); 
	},
	setKeywords: function(wordArray){
		this.config.keywords= []; 
		this.addKeywords(wordArray); 	
		return this; 
	},
	addKeywords: function(wordArray){
		wordArray= scrubWords(wordArray); 
		for(var i=0,l=wordArray.length,w=wordArray[i]; i<l; w=wordArray[++i]){
			if(w.indexOf("=")) 
				this.addKeyvalues(w)
			this.addKeyword(wordArray[i]);
		}
		return this;
	},
	addKeyword: function(word){
		word= scrubWord(word); 
		if(word) 
			this.config.keywords.push(word); 
		return this; 
	},
	setKeyvalues: function(kvObject){
		kvObject= scrubKeyvalues(kvObject); 
		if(kvObject) 
			this.config.keyvalues= kvObject; 
		return this; 
	},
	addKeyvalue: function(n,v){ 
		if(typeof n==='string' && n.indexOf("=") > 0) {
			n= n.split("="); 
			n= n[0]; v= n[1]; 
		}
		return this.addKeyvalues({ n: v }); 
	},
	addKeyvalues: function(n,v){
		if(typeof n == 'string' && typeof v =='string') 
			return this.addKeyvalues({ n: v }); 
		else if (typeof n != 'object')
			return this; 
		var o= scrubKeyvalues(n); 
		for(var n in o) 
			this.config.keyvalues[n]= o[n]; 
		return this; 
	},
	each: function(fn){ 
		return fn.apply(this); 
	},
	clear: function(){ 
		if(this.creativeEl) {
			this.creativeEl.clearElement(); 
		}
	},
	attach: function(){ 
		var 
			_gelContent= null,
			_self= this, 
			_HEAD= document.getElementsByTagName("HEAD")[0], 
			R_NS= GEL.namespace("GEL.remoting")
		; 
		return this.config.loadType == 'inline' ? 
			preLoad : 
			postLoad; 
		function preLoad(){ 
			var _script= GEL.ement("SCRIPT", { 
				src: this.getUrl()
			}); 
			_script.setAttacher('inline'); 
			_self.fire("beforeAttach", _self); 
			_script.on("ready", function(){ 
				_self.fire("ready", _self); 
			}); 
			_self.loadcount++; 
			_script.attach(); 
			_self.attach= postLoad; 
		}
		function postLoad(){ 
			var 
				_destGel= GEL.ement("DIV", {}),
				_provider= _destGel.setContentUrl(this.getUrl(), "script")
				_self= this
			; 
			/* 
			 * This is a Good Idea.  It will hide tracking  
			 * images that are not meant to and will not be displayed but 
			 * due to the fact that they set height and width to 1 
			 * they still create an offset which pushes down the 
			 * creative and resizes the DOM.  
			 * Like most Good Ideas, however, IE prevents this 
			 * due to the fact that we are unable to retrieve the height 
			 * and width properties when the element is in this state. 
				_provider.addFilter(BadImageFilter); 
			*/
			_destGel.addClassName("gel-hidden"), 
			_destGel.attachToElement= this.attachTo; 
			_destGel.attach(); 
			_self.creativeEl= _destGel; 
			_destGel.on("contentReady", function(){ 
				_self.loadcount++; 
				_self.fire("ready", _self); 
				if(_gelContent){_gelContent.removeElement()}
				_destGel.removeClassName("gel-hidden"); 
				_destGel.forceRender(); 
				_gelContent= _destGel; 
			});
			_destGel.contentProvider.fetcher.on("preattach", function(){
				this.unsubscribe(arguments[0],arguments.callee); 
				_self.fire("beforeAttach", _self); 
			}); 
			_destGel.updateRemoteContent(); 
		}
	}
});

})();
(function(){ 
var 
	_GROUP_ID= parseInt(Math.random(1000)* 100000, 10),
	_DEFAULT_CONFIG= { 
		adserver: "gannett.gcion.com", 
		sitepage: window.location.host + window.location.pathname, 
		placementid: 133600,
		networkid: 5111.1
	}, 
	_POS_REGEXP= RegExp(/(\d+)x(\d+)_(.*)/) 
;
GEL.widget.AdBanner.Helios= function(options){ 
	var _superC= GEL.widget.AdBanner.Helios.superclass.constructor; 
	_superC.apply(this, arguments); 
	this.config.server= 'adserver' in options ? 
		options.adserver :  GEL.config.AdServer; 
	if(!this.config.server)this.config.server= _DEFAULT_CONFIG.adserver;  
	this.config.sitePage = 'sitepage' in options ? 
		options.sitepage : 
		(function(){ 
			return 'AdPage' in GEL.config ? 
				GEL.config.AdPage :_DEFAULT_CONFIG.sitepage;
		})()
	; 
	this.config.networkId= 'networkid' in options ?
		options.networkId : (function(){ 
			return 'AdNetworkId' in GEL.config ? 
				GEL.config.AdNetworkId : 
				_DEFAULT_CONFIG.networkid; 
				;
		})(); 
	this.config.placementId= 
		'placementid' in options ? 
		options.placementid : (function(){ 
			return "PlacementId" in GEL.config  ?
				GEL.config.PlacementId : _DEFAULT_CONFIG.placementid; 
		})(); 
	;
	this.config.groupId=
		GEL.config.adgroupid || _GROUP_ID;

	this.config.cookieTarget= 'cookieTarget' in options ? 
		options.cookieTarget : 'info';

	this.getUrl= function() { 
		if(this.config.url) return this.config.url; 
		var 
			_pos= this.config.adPosition, 	
      			_size= "", 
      			_creativeSize= ""
			_keywords= "", 
			_keyvals= "", 
			_url= '', 
			_params= null
		;
		_params= {
			alias: this.config.sitePage + '_' + _pos, 
			cookie: this.config.cookieTarget, 
			loc: 100, 
			target: "_blank", 
			grp: this.config.groupId, 
			misc: new Date().getTime(), 
			noperf: 1
		};
		if(!this.config.sitePage) delete _params['alias'];

		if(this.config.size) { 
			_creativeSize= "-1"; 
			_size= this.config.size;
			_params.size= _size; 
      		}else if(_pos.match(_POS_REGEXP)){
        		_creativeSize= "-1";
        		_size= _pos.replace(/_\w$/, '');
				_params.size= _size; 
      		}else{
        		_creativeSize= "0";
      		}
      		if (this.config.keywords.length > 0) {
      			_keywords = 
				this.config.keywords.join("+"); 
			_params.key= _keywords; 
		}
		if(this.config.keyvalues){
			var _key= ''; 
			for(var kv in this.config.keyvalues) { 
				_key= kv; 
				if(_key.indexOf("kv") != 0) 
					_key= "kv" + _key; 	
				_params[_key]= this.config.keyvalues[kv]; 
			}
		}
		
		_url= [  
			window.location.protocol,'',  
			this.config.server , 'addyn/3.0', 
			this.config.networkId, 
			this.config.placementId, 
			'0',
			_creativeSize , 
			'ADTECH;'
		].join("/");
		; 
      		return _url + GEL.objectUtil.join(_params, '=', ';');  
  	}
}
GEL.extend (GEL.widget.AdBanner.Helios, GEL.widget.AdBanner); 
})(); 
(function(){ 
	var _DEFAULT_CONFIG= { 
		adserver: "content.pulse360.com", 
		format: "bare"
	}
GEL.widget.AdBanner.Pulse360= function(options){ 
	options= options || new Object(); 
	options.position=  'position' in options ? 
		options.position : "P360"; 
	var _superC= GEL.widget.AdBanner.Helios.superclass.constructor; 
	_superC.apply(this, arguments); 

	var _cfg= GEL.namespace("config.p360"); 
	this.config.id= 'p360id' in options ? 
		options.p360id : _cfg.id; 
	this.config.ganid= 'ganid' in options ? 
		options.ganid : _cfg.ganid; 
	this.config.gans= 'gans' in options ? 
		options.gans : _cfg.gans; 
	this.config.ganss= 'ganss' in options ? 
		options.ganss : _cfg.ganss; 
	this.config.format= 'format' in options ? 
		options.format : _cfg.format; 
	this.config.reload= 'refresh' in options ? 
		options.refresh : false; 
	this.config.rotate= 'rotate' in options ? 
		options.rotate : false; 
	if(!this.config.format)this.config.format= _DEFAULT_CONFIG.format; 

	this.config.server= 'adserver' in options ? 
		options.adserver : _cfg.adserver; 
	if(!this.config.server)this.config.server= _DEFAULT_CONFIG.server; 
	
	this.config.title= 1; 
	this.config.signup= 1; 
	this.getUrl= function(){ 
		if(this.config.url) return this.config.url; 
		var 
			_url= 	
				window.location.protocol +  '//' + 
				this.config.server + '/cgi-bin/context.cgi?', 
			_params={ 
				id: this.config.id, 
				ganid: this.config.ganid, 
				gans: this.config.gans, 
				ganss: this.config.ganss, 
				format: this.config.format, 
				ganst: '', 
				title: this.config.title, 
				signup: this.config.signup 
			};
		_url += GEL.objectUtil.join (_params, "=", "&"); 
		return _url; 
	}

}
GEL.extend(GEL.widget.AdBanner.Pulse360, GEL.widget.AdBanner); 
})(); 
(function(){ 
var 
	_BANNER_CACHE= {}, 
	_BANNER_IDX= 0, 
	_BANNER_MAP= { 
		helios: GEL.widget.AdBanner.Helios, 
		p360: GEL.widget.AdBanner.Pulse360, 
		plain: GEL.widget.AdBanner, 
		_default: GEL.widget.AdBanner.Helios
	}; 
GEL.widget.AdBanner.Locator= (function(){
var _O= null; 
return o; 
function o(options){ 
	if(_O) return _O; 
	else _O= this; 
	options= options || new Object(); 
	var 
		_bannerTag= options.tag || 'BANNER',
		_self= this, 
		_bannerList= {}
	;
this.attach= new Function(); 	
	this.banners= new GEL.MetaElement();
	this.banners.on("ready", function(){ 
		this.unsubscribe("ready", arguments.callee); 
		_self.banners= new GEL.MetaElement(); 
		_self.banners.on("ready", arguments.callee); 

	}); 
	this.bannerList= _bannerList; 
	this.findBanners= function(baseElement){ 
		baseElement= baseElement? 
			GEL.ement(baseElement): 
			GEL.thepage
		; 
		var _ret= []; 
		baseElement.$(_bannerTag, bannerMaker(_ret));  
		return _ret; 
	}
	this.getBannerList= function(filterFn){ 
		var _id= '', _b, _ret= []; 
		for (_id in _bannerList){ 
			_b= _bannerList[_id]; 
			_ret.push(_b); 
		}
		return _ret; 
	}
	this.loadBanners= function(filterFn,element,attach){ 
		attach= typeof attached == 'undefined' ? true : false; 
		var 
			_id= '',
			_b= null, 
			_timer= null, 
			_list=  element? 
				(function(l){ 
					var _a= l.findBanners(element), _o= {}; 
					for(var i=0;i<_a.length;i++)
						_o[_a[i].id]= _a[i]; 
					return _o; 
				})(this) : _bannerList, 
			filterFn= typeof filterFn == 'function' ? 
				filterFn : 
				function(){ return true; }
		; 
		for (_id in _list){ 
			_b= _list[_id]; 
			if(!filterFn.apply(_b))continue; 
			_timer= new GEL.util.benchmark.Timer(
				"ad ("+ _b.position +")"
			);
			_b.on("beforeAttach", _timer.getStart()); 
			_b.on("ready", _timer.getEnd());  
			this.banners.addElement(_b); 	
		}
		this.banners.on("ready", function(){ 
			this.unsubscribe('ready', arguments.callee); 
			_self.fire("bannerLoadComplete", _self); 
		}); 
		if(attach) 
			this.banners.attach(); 
		return this.banners; 
	}

	function bannerMaker(retList){ 
	return function(){ 
		var 
			_opts= {}, 
			_attr= null, 
			_name= '', 
			_type= '_default', 
			_val= '', 
			_banerId= null, 
			_bannerClass= _BANNER_MAP['_default']
		; 
		for (var i=0;i<this.attributes.length;i++) { 
			_attr= this.attributes[i]; 
			_name= _attr.nodeName.toLowerCase(); 
			_val= _attr.value; 
			if(_val === 'false' || _val === "0") _val= false; 
			else if (_val === 'true') _val= true; 
			_opts[_name]= _val; 
		}
		_opts.id= _opts.id || "__gelement_adbanner_" + _BANNER_IDX++;
		this.setAttribute("id", _opts.id); 	
                if(_opts.id in _BANNER_CACHE){
			retList.push(_BANNER_CACHE[_opts.id]); 
			if(!(_opts.id in _bannerList))_bannerList[_opts.id]= _BANNER_CACHE[_opts.id];
			return; 
		}
                _opts.marker= this;
                _bannerClass= ('bannertype' in _opts && _opts.bannertype in _BANNER_MAP ) ?
                        _BANNER_MAP[_opts.bannertype] : _bannerClass;
                _BANNER_CACHE[_opts.id]= 
			_bannerList[_opts.id]= 
				new _bannerClass(_opts);
		retList.push(_BANNER_CACHE[_opts.id]); 
	}
	}
}
})(); 
GEL.extend(GEL.widget.AdBanner.Locator, GEL.event.Publisher); 
GEL.thepage.bannerLocator= new GEL.widget.AdBanner.Locator(); 
})(); 
GEL.thepage.bannerRotator= (function(){ 
	var 
		_self= {},
		_rotateTimer= 0,
		_rotating= false, 
		_lastRotationComplete= null,
		_interval= 300 /* Seconds */
	;

	_self.startRotation= function(interval){ 
		_interval= interval || _interval; 
		_rotating= true; 
		clearTimeout(_rotateTimer); 
		_rotateTimer= setTimeout(loadBanners, _interval * 1000);
	}
	_self.stopRotation= function(){ 
		clearTimeout(_rotateTimer); 
		_rotating= false; 
	}

	function loadBanners(){ 
		var _l= getLocator(); 
		_l.on("bannerLoadComplete", function(e){
			_lastRotationComplete= new Date();
			this.unsubscribe(e,arguments.callee); 
			if(_rotating) 
				_self.startRotation();
		});
		_l.loadBanners(function(){ return this.config.rotate; } ); 
	}
	function getLocator(){ 
		return GEL.thepage.bannerLoader || 
			new GEL.widget.AdBanner.Locator(); 
	}
	return _self; 
})(); 

(function(){ 
var 
	_GROUP_ID= parseInt(Math.random(1000)* 100000, 10),
	_DEFAULT_CONFIG= { 
		adserver: "gannett.gcion.com", 
		sitepage: window.location.host + window.location.pathname, 
		networkid: 5111.1
	}, 
	_POS_REGEXP= RegExp(/(\d+)x(\d+)_(.*)/) 
;

GEL.widget.AdBanner.Video = function (pXML, pOptions) {
	this.buildAd = function(){
		var ad = {};
	
		if (pXML.ad.indexOf("<a ") !== -1) {
			ad.type="error";
			return ad;
		}else if (pXML.ad.indexOf("document.write") !== -1) {
			ad.type="error";
			return ad;
		}

		try{		
			if (window.ActiveXObject) {
				var adXML = new ActiveXObject("Microsoft.XMLDOM");
				adXML.async = false;
				adXML.loadXML(pXML.ad);
			}
			else if (window.XMLHttpRequest) {
				var adXML = (new DOMParser()).parseFromString(pXML.ad, "text/xml");
			}
			
			ad.type = "videoAd";
			var nodeItems = adXML.firstChild.childNodes.length;
			var currentNode = adXML.firstChild.firstChild;
			ad.duration = (adXML.firstChild.getAttribute("duration") !== "") ? Number(adXML.firstChild.getAttribute("duration")) : 15;
			if (adXML.firstChild.getAttribute("trackStartURLs") !== ""){
				ad.trackStartURLs = adXML.firstChild.getAttribute("trackStartURLs").split(",");
			}
			if (adXML.firstChild.getAttribute("trackMidURLs") !== ""){
				ad.trackMidURLs = adXML.firstChild.getAttribute("trackMidURLs").split(",");
			}
			if (adXML.firstChild.getAttribute("trackEndURLs") !== ""){
				ad.trackEndURLs = adXML.firstChild.getAttribute("trackEndURLs").split(",");
			}
			if (adXML.firstChild.getAttribute("trackPointURLs") && (adXML.firstChild.getAttribute("trackPointURLs") !== "")){
				ad.trackPointURLs = adXML.firstChild.getAttribute("trackPointURLs").split(",");
			}
			ad.trackPointTime = (adXML.firstChild.getAttribute("trackPointTime") && (adXML.firstChild.getAttribute("trackPointTime") !== "")) ? Number(adXML.firstChild.getAttribute("trackPointTime")) : 0;

			for (var i = 0; i < nodeItems; i++) {
				if (currentNode.nodeName == "videoURL" && currentNode.firstChild){
					ad.videoURL = currentNode.firstChild.nodeValue;
				}
				if (currentNode.nodeName == "videoClickURL" && currentNode.firstChild){
					ad.videoClickURL = currentNode.firstChild.nodeValue;
				}
				if (currentNode.nodeName == "expandedBannerURL" && currentNode.firstChild) {
					ad.expandedBannerURL = currentNode.firstChild.nodeValue;
					ad.expandedBannerType = currentNode.getAttribute("type");
				}
				if (currentNode.nodeName == "expandedBannerClickURL" && currentNode.firstChild){
					ad.expandedBannerClickURL = currentNode.firstChild.nodeValue;
				}	
				if (currentNode.nodeName == "collapsedBannerURL" && currentNode.firstChild) {
					ad.collapsedBannerURL = currentNode.firstChild.nodeValue;
					ad.collapsedBannerType = currentNode.getAttribute("type");
				}
				if (currentNode.nodeName == "collapsedBannerClickURL" && currentNode.firstChild){
					ad.collapsedBannerClickURL = currentNode.firstChild.nodeValue;
				}
				
				currentNode = currentNode.nextSibling;
			}
			return ad;
		}catch(e){
			ad.type="error";
			return ad;
		}
	};

	this.createSwf = function (pURL, pClickThrough, pId) {
		var _o = {
			classid: "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000",
			codebase: "http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0",
			width: "300",
			height: "250",
			id: [pId, "obj"].join(""),
			align: "middle"
		},
		_p = {
			allowScriptAccess: "always",
			movie: pURL,
			quality: "high",
			bgcolor: "#ffffff",
			wmode: "transparent",
			FlashVars: ["clickTag=", pClickThrough].join("")
		},
		_e = {
			src: pURL,
			allowScriptAccess: "always",
			quality: "high",
			bgcolor: "#ffffff",
			wmode: "transparent",
			FlashVars: ["clickTag=", pClickThrough].join(""),
			type: "application/x-shockwave-flash",
			name: "expandedBanner",
			align: "middle",
			pluginspage: "http://www.macromedia.com/go/getflashplayer",
			width: "300",
			height: "250"
		};
		var _t = GEL.util.flashUtil.AC_Generateobj(_o, _p, _e),
			_swf = {
				adtype: "swf",
				swf: _t
			};

		return _swf;
	};

	this.createImage = function (pURL, pClickThrough, pId) {
		if (document.getElementById(pId)) {
			var _id = document.getElementById(pId),
			_t = document.createElement('a'),
			_i = document.createElement('img');
;
			_t.setAttribute("href", pClickThrough);
			_t.setAttribute("target", "_blank");
			_i.setAttribute("src", pURL);
			
			var _img= {
				adtype: "image",
				anchor: _t,
				image: _i
			}
			;

		}
		
		return _img;
	};

	this.createIframe = function (src, iframeid) {
		var _i = ['<iframe id="', iframeid, '" width="300" height="250" frameborder="no" scrolling="no" vspace="0" hspace="0" marginheight="0" marginwidth="0" src="', src,'"></iframe>'].join(""),
			_iframe= {
				adtype: "iframe",
				iframe: _i
			};
		
		return _iframe;
	};

	this.createBanner = function (pAd, _adInfo) {
		var banner;
		var type;
		if (!pAd.expandedBannerType) pAd.expandedBannerType = "default";
		if (!pAd.collapsedBannerType) pAd.collapsedBannerType = "default";
		
		if (typeof pAd.collapsedBannerURL == "string" && typeof pAd.expandedBannerURL == "undefined") {
			type = "collapsedBanner";
		}
		else if (typeof pAd.collapsedBannerURL == "string" && typeof pAd.expandedBannerURL == "string") {
			type = "expandedBanner";
		}
		else {
			type = "expandedBanner";
		}
		
		if (type == "expandedBanner" && pAd.expandedBannerURL) {
			banner = {
				clickURL: pAd.expandedBannerClickURL,
				srcURL: pAd.expandedBannerURL,
				id: _adInfo.expandedId,
				type: type,
				codeType: pAd.expandedBannerType
			};
		}
		else if ("collapsedBanner" && pAd.collapsedBannerURL) {
			banner = {
				clickURL: pAd.collapsedBannerClickURL,
				srcURL: pAd.collapsedBannerURL,
				id: _adInfo.collapsedId,
				type: type,
				codeType: pAd.collapsedBannerType
			};
		}
		return banner;
	};
}
   
GEL.extend (GEL.widget.AdBanner.Video, GEL.widget.AdBanner); 
})();  


/* interstitial */
Interstitial= GEL.widget.AdBanner.Interstitial= (function(){ 
return function(options){ 
this.attach= this.show= function(){  
	this.show= this.attach= new Function(); 
	var 
		_W= window, 
		_D= document, 
		_G= GEL, 
		_R= _G.remoting,
		_height= options.height || _D.body.scrollHeight, 
		_width= options.width || _D.body.scrollWidth, 
		_self= this, 
		_mainDiv= GEL.ement("DIV", {"classname": "interstitial gel-hidden"}),
		_htmlBlock="<center> \
					<center> \
					<div class=\"header\"> \
					<div class=\"logo\"></div> \
					<a href=\"#\" class=\"gel-hidden skip\">Skip this ad &raquo;</a> \
					</div> \
					</center> \
					<div class=\"aggit\"> \
						Advertisement \
					</div> \
					<div class=\"ad\">" + options.creative.html + " \
					</div> \
					<p class=\"redirect\"> \
						You will be redirected to the page you want to view in <span id=\"ad_countdown\"></span> seconds. \
					</p> \
					</div>",
		_anchor
	;
	if(!options.width) _width= _width - (_width * .02); 
	_mainDiv.css({ 
		height: _height +"px", 
		width: _width + "px"
	});
	
	_mainDiv.appendHTML(_htmlBlock);	
	if (typeof options.anchor=="undefined" || options.anchor=="") 
		_anchor = GEL.thepage.get("BODY > DIV")[0];
	else 
		_anchor = options.anchor;

	GEL.log(_anchor);
	GEL.log(_mainDiv);
	
	_mainDiv.insertBefore(_anchor);
	//_mainDiv.insertBefore(_anchor.parentNode);
	_mainDiv.show();
	_D.body.style.overflow= "hidden"; 
	
	var 
		redirect_in_seconds = options.maxDuration,
		showSkipTime= options.minDuration || 0,
		time_left= redirect_in_seconds, 
		countdownEl= _mainDiv.get("#ad_countdown")[0],
		countdown= setInterval(ad_countdown, 1000)
	;

	_mainDiv.foreach(".skip", function(){ 
		var _g= GEL.ement(this); 
		_g.on("click", function(t,e){ 
			e.preventDefault(); 
			closeModal(); 
		}); 
		setTimeout(function(){
			_g.show()				
		}, showSkipTime * 1000); 
	});
	function ad_countdown() {
		countdownEl.innerHTML= time_left;
		time_left--;
		if(time_left == 0)
			clearInterval(countdown);
	}
	function closeModal(){ 
		clearInterval(countdown); 
		_D.body.style.overflow= "auto"; 
		_anchor.style.display= ''; 
		GEL.thepage.off("ready", _scroll); 
		_mainDiv.removeElement(); 
		_self.fire('ready', _self); 
	}
	var _scroll= function(){ 
		setTimeout(function(){ 
			_W.scrollTo(0,0); 
		}, 10); 
	}
	GEL.thepage.on("ready", _scroll); 
	setTimeout(closeModal, redirect_in_seconds*1000);
	ad_countdown();
	_anchor.style.display= 'none';
	return _mainDiv; 
}
}
})(); 
GEL.extend(Interstitial, GEL.event.Publisher); 
/*
 * File: remoting.js
 */


(function(){ 
if(typeof GEL.remoting != 'undefined') { 
	GEL.log("It appears as if the GEL.remoting namespace has all ready loaded"); 
	return; 
}
var 
	_R= GEL.namespace("remoting"),
	_H= document.getElementsByTagName("HEAD")[0], 
	_GEL_PROTO= GEL.Element.Base.prototype; 

_GEL_PROTO.contentCacheTime= 0; 
_GEL_PROTO.contentLastUpdate= null; 
_GEL_PROTO.setContentProvider= function(provider){ 
	this.contentProvider= provider; 
	this.contentProvider
		.on("dataReady", (function(_self){ 
			return function(){ 
				_self.contentReadyHandler(this); 
			}
		})(this))
		.on("ready", (function(_self){ 
			return function(){ 
				_self.isfetching= false; 
				_self.fire('contentReady', _self); 
				_self.forceRender(); 
			}
		})(this))
	;
	return this; 
}
_GEL_PROTO.setContentUrl= (function(){ 
	return function(url,type){ 
		var 
			type= type || '',
			_provider= null
		;
		_provider= 
			(url.endsWith(".js") || type.toLowerCase() == 'script') ?  
			createJS(this, url) : 
			createAjax(url)
		;  
		this.setContentProvider(_provider); 
		return _provider; 
	}

	function createAjax(url){ 
		var 
			_dFetcher= new _R.Fetcher.Ajax({url: url}), 
			_cProvider= new _R.Provider.DOM(_dFetcher)
		; 
		_cProvider.filter= new _R.Provider.DOM.DOMFilter.TagExtractor(
			_cProvider.filter, { "SCRIPT": _H , "STYLE": _H } 
		); _cProvider.filter= new _R.Provider.DOM.DOMFilter.BannerFinder(
			_cProvider.filter 
		); 
		return _cProvider; 
	}
	function createJS(attachEl,url){ 
		var 
			_tagXtractOptions= { LINK: _H }, 
			_dFetcher= new _R.Fetcher.DocumentOverwriter(
				{url: url, attachTo: attachEl}
			), 
			_cProvider= new _R.Provider.DOM(_dFetcher)
		; 
		_cProvider.filter= new _R.Provider.DOM.DOMFilter.TagStripper(
			_cProvider.filter, ['SCRIPT']
		); 
		_cProvider.filter= new _R.Provider.DOM.DOMFilter.TagExtractor(
			_cProvider.filter, { "STYLE" : _H } 
		); 
		return _cProvider; 
	}
})(); 
_GEL_PROTO.updateRemoteContent= function(){ 
	if(
		typeof this.contentProvider=='undefined' || 
		!this.contentProvider || 
		this.isfetching 
	) return; 
	var _lastUpdate= 0; 
	if(
		this.contentCacheTime <= 0 && 
		this.contentLastUpdate
	){ return false; } 
	if(this.contentLastUpdate) { 
		_lastUpdate=  (new Date()).getTime() - this.contentLastUpdate.getTime();
	} 
	if ( _lastUpdate > 0 && _lastUpdate / 1000 < this.contentCacheTime)   { return ; } 
	this.fire("preContentUpdate", this); 
	this.contentProvider.fetcher.attach(); 	
	this.isfetching= true; 
	return true; 
}
_GEL_PROTO.contentReadyHandler= function(provider){ 
	var _dFrag= provider.getData(); 
	this.appendChild(_dFrag); 
	this.contentLastUpdate= new Date(); 
	this.fire("contentUpdated", this); 
}


/*
 * Class: GEL.remoting.Provider
 * Takes data from a Fetcher and format it (e.g. eval()'ing json).
 * Typically GEL.remoting.Provider will be assigned to a GEL.util.ContentProvider 
 * for creation of content 
 */

GEL.remoting.Provider= function(dataFetcher){ 
	var _superC= GEL.remoting.Provider.superclass.constructor; 
	_superC.apply(this, arguments); 
	this.setDataHandlers(this); 
	if(typeof dataFetcher != 'undefined' && dataFetcher) 
		this.setFetcher(dataFetcher); 
	this.data= null; 
}; 
GEL.extend(GEL.remoting.Provider, GEL.event.Publisher, { 
	getFetcher: function(){ return this.fetcher; }, 
	setFetcher: function(fetcher){ 
	/*
		if(!(fetcher instanceof GEL.remoting.Fetcher) ){ 
			throw new TypeError ("GEL.remoting.Provider.setFetcher(GEL.remoting.Fetcher)"); 
		}
	*/
		this.fetcher= fetcher; 
		this.addContentHandlers(); 
	},
	addContentHandlers: function(){ 
		this.fetcher.on("dataAvailable", this.onDataAvailable); 
		this.fetcher.on("ready", this.onDataComplete); 
	},
	onDataAvailable: function(){
		this.fire("dataReady", this); 
	}, 
	onDataComplete: function(){ 
		this.fire("ready", this); 
	},
	getData: function(){ return this.data },
	setData: function(data){ this.data = data; return this.data; }

}); 

GEL.remoting.Provider.Json= function(){ 
	var 
		_superC= GEL.remoting.Provider.Json.superclass.constructor, 
		_superObj= GEL.remoting.Provider.Json.superclass
	; 
	_superC.apply(this, arguments); 
	this.data= new Object(); 
	this._superObj= _superObj; 
}
GEL.extend(GEL.remoting.Provider.Json, GEL.remoting.Provider, { 
	setDataHandlers: function(_self){ 
		this.onDataAvailable= function(){ 
			var _data= this.getContent(); 
			if(typeof _data == 'undefined' || !_data) { return ;}
			try { _self.data= eval (_data) }
			catch(e){ 
				throw new Error("Error interpreting data \"" + _data + '" as JSON: \"' + e.message +'"'); 
			}
		} 
		this.onDataComplete= function(){ 
			return _self.onDataAvailable.apply(this,arguments); 
		}
	}
}); 
//(function(){ 
GEL.remoting.Provider.DOM= function(){ 
	var 
		_superC= GEL.remoting.Provider.DOM.superclass.constructor,
		_superObj= GEL.remoting.Provider.DOM.superclass
	; 
	_superC.apply(this, arguments); 
	this._superObj= _superObj; 
	this.data= document.createDocumentFragment(); 
	this.filter= new GEL.remoting.Provider.DOM.DOMFilter(); 
}

GEL.extend(GEL.remoting.Provider.DOM, GEL.remoting.Provider, { 
	setDataHandlers: function(_self){ 
		this.onDataAvailable= function(){ 
			var 
				_content= this.getData(), 
				_frag= document.createDocumentFragment(),  
				_div= document.createElement("DIV")
			;
			_content= _self.filter.filterHTML(_content); 
			if(GEL.env.ua.ie){ 
				_div.style.display= 'none'; 
				_div.style.visibility= "hidden"; 
				document.body.appendChild(_div); 
			}
			_div.innerHTML= _content; 
			_self.filter.filterDOM(_div); 
			while(_div.childNodes.length > 0) 
				_frag.appendChild(_div.childNodes[0]); 

			_self.setData(_frag); 
			if(_div.parentNode){ 
				_div.parentNode.removeChild(_div); 
			}
			_div= null; 
			_self.fire("dataReady", _self); 
			_self.filter.filterPostAttach(_frag); 
		}
		this.onDataComplete= function(){ 
			this.off(arguments[0],arguments.callee); 
			_self.fire("ready", _self); 
			return _self; 
		}
	},
	addFilter: function(filterClass){ 
		this.filter= new filterClass(this.filter); 
	}
}); 
GEL.remoting.Provider.DOM.DOMFilter= function(){ 
	this.filterHTML = function(htmlString){ 
		return htmlString; 
	}
	this.filterDOM= function(domElement){ 
		return domElement; 
	}
	this.filterPostAttach= function(domElement){ 
		return domElement 
	}
};
})(); 
(function(){
var 	
	_TAG_RE_LIST= {}, 
	_TAG_RE_FN= function(tagName){ 
		if(!(tagName in _TAG_RE_LIST)){
			_TAG_RE_LIST[tagName]= new RegExp("<(\/?)\s*" + tagName, "ig"); 
		}
		return _TAG_RE_LIST[tagName]; 
	}
GEL.remoting.Provider.DOM.DOMFilter.TagStripper= function(filter, stripTagList){ 
	this.decorating= filter;
	var _tags= {}; 
	for (var i=0;i<stripTagList.length;i++) { 
		_tags[stripTagList[i]]= true;  
	}
	this.addTag= function(tagName){ 
		_tags[tagName]= true;  
	}
	this.removeTag= function(tagName){ 
		delete _tags[tagName]; 
	}
	this.filterPostAttach= function(domElement){ 
		return this.decorating.filterPostAttach(domElement); 
	}
	this.filterHTML = (function(){ 
		if(!GEL.env.ua.ie) { 
			return function(htmlString){ 
				return this.decorating.filterHTML(htmlString); 	
			}
		}
		return function(htmlString){ 
			var _ret= htmlString, _tag, _regex; 
			for(var _tag in _tags){ 
				_regex= _TAG_RE_FN(_tag);  
				_ret= _ret.replace(_regex, "<$1COMMENT"); 
			}
			return this.decorating.filterHTML(_ret); 
		}
	})(); 
	this.filterDOM= function(domElement){ 
		var _tNodes= null, _tag= '', _n;
		for(_tag in _tags){ 
			_tag= GEL.env.ua.ie ? "COMMENT" : _tag; 
			_tNodes= domElement.getElementsByTagName(_tag); 
			while(_tNodes.length > 0) { 
				_n= _tNodes[0]; 
				if(_n.parentNode){
					_n.parentNode.removeChild(_n); 
				}else if ('removeChild' in domElement){ 
					domElement.removeChild(_n); 
				}
			}
		}
		return this.decorating.filterDOM(domElement); 
	}
}
})(); 

GEL.remoting.Provider.DOM.DOMFilter.BannerFinder= function(filter){ 
	var 
		_bannerList= [],
		_bl= GEL.thepage.bannerLocator || getLoader()
	;
	this.decorating= filter; 
	this.filterHTML= function(s){ return this.decorating.filterHTML(s); } 
	this.filterDOM= function(domElement){ 
		var 
			_b, _list; 
		_list= _bl.findBanners(domElement); 
		domElement= this.decorating.filterDOM(domElement); 
		for(var i=0;i<_list.length;i++) { 
			_bannerList.push(_list[i]); 
		}
		return domElement; 
	}
	this.filterPostAttach= function(domFragment){ 
		var _b; 
		while((_b= _bannerList.shift())){ 
			_b.loadBanner(); 
		}
	}
	function getLoader(){ 
		GEL.use("widget.AdBanner", function(){ 
			_bl= GEL.thepage.bannerLocator; 
		}); 
		return { 
			findBanners:function(){ return [] }
		}; 
	}

};

GEL.remoting.Provider.DOM.DOMFilter.TagExtractor= function(filter, tagListObj){ 
	this.decorating= filter;
	this.filterHTML= (function(){ 
		if(!GEL.env.ua.ie) { 
			return function(){ 
				return this.decorating.filterHTML.apply(this.decorating, arguments); 
			}  
		}
		/* 
		* Script hack is required for IE.  Otherwise, it ignores the first element 
		* if it is a style, script or link tag 
		*/
		var _IE_SCRIPT_HACK= '<span style="display:none">p</span>';
		return function(htmlString){ 
			htmlString= _IE_SCRIPT_HACK + htmlString; 
			return this.decorating.filterHTML.apply(this.decorating, arguments); 
		}
	})();
	this.filterDOM= function(domElement){ 
		var _dest, _tag, _el; 
		// Remove the script hack  we added in filterHTML
		if(GEL.env.ua.ie){ 
			domElement.removeChild(domElement.childNodes[0]); 
		}
		var i=0; 
		for (_tag in tagListObj) {
			_dest= tagListObj[_tag]; 
			extractandreplace(domElement, _tag, _dest); 
		}
		return this.decorating.filterDOM(domElement); 
	}
	this.filterPostAttach= function(el){ 
		return this.decorating.filterPostAttach(el); 
	}
	function extractandreplace(el,tag,dest){ 
		var 
			_tList= el.getElementsByTagName(tag), 
			_count= 0, 
			_iecopy= null, 
			_node= null
		;
		while(_tList.length > 0) { 
			_node= _tList[0]; 
			_node.parentNode.removeChild(_node); 
			if(!GEL.env.ua.gecko && tag.toUpperCase() == 'SCRIPT'){
				_newNode= _node.cloneNode(false);
				_newNode.text= _node.innerHTML; 
				_node= _newNode; 
			}
			dest.appendChild(_node); 
			_count++; 
		}
		return _count; 
	}
};
//})(); 

/*
 * Class: GEL.remoting.Fetcher
 * Retrieve strings from remote sources.  
 */
(function(){ 
if (typeof GEL.remoting.Fetcher != 'undefined' && GEL.remoting.Fetcher) return; 
GEL.remoting.Fetcher= function(el,options){ 
	var _superC= GEL.remoting.Fetcher.superclass.constructor,
		_self= this,
		_o= options || new Object(); 
	_superC.apply(this,arguments); 
	parseOpts(); 
	function parseOpts(){ 
		var _key, _value; 
		for (_key in _o){
			_value= _o[_key]; 
			switch(_key) {
				case "onComplete": 
					_self.on("ready", _value); 
					break; 
				case "onError": 
					_self.on("error", _value); 
					break; 
				case "url": 
					_self.setUrl(_value); 
					break; 
				default: 
					// This is a little harsh 
					//throw new Error("Undefined option " + _key); 
					break; 
			}
		}
	}
	this._content=''; 
}
GEL.extend(GEL.remoting.Fetcher, GEL.Element.Base, { 
	setUrl: function(u){ 
		this._url= u; 
	},
	getUrl: function(){ 
		var _t= typeof this._url; 
		if(_t=='string') return this._url; 
		else if (_t == 'function') return this._url(); 
		else if(_t=='object' && this._url.getUrl) return this._url.getUrl(); 
	},
	getContent: function(){ 
		return this._content; 
	},
	getData: function(){ return this.getContent(); }, 
	setData: function(){ return this.setContent.apply(this, arguments) }, 
	setContent: function(content){ 
		this._content= content; return content 
	}, 
	appendContent: function(content){ 
		this._content+=content; 
		return this._content; 
	}
}); 

})();

(function(){

var 
	_GELTYPE= "XHR",
	_XHRTYPES= ['MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'], 
	_XHRPOOL= new Array(5);  
; 
GEL.remoting.Fetcher.Ajax= function(options){ 
	var 
		_superC= GEL.remoting.Fetcher.Ajax.superclass.constructor,
		_senddata= "",
		_el= null
	;
	this.config= {}; 
	this.transitionMapOverrides= {
		attach: GEL.Element.StateManager.Attached.XHR,
		preattach: GEL.Element.StateManager.PreAttach.Null
	}; 
	_superC.call(this,null,options); 
	this.on("ready", (function(_self){ 
		return function(){ 
			_self.fire("dataAvailable", _self); 
		}
	})(this)); 
	this.attacher= new GEL.Element.XHRAttacher(); 
	this.config.method= options.method || "POST"; 
	this.config.async= 'async' in options ? 
		options.async : true; 
	this.getSendData= function(){ 
		return _senddata;
	} 
	this.setSendData= function(data){ 
		if(typeof data == 'string') { 
			_senddata= data; 
		}else if (data instanceof Array) {
			_senddata= data.join("\r\n"); 
		}else if (typeof data == 'object'){ 
			_senddata= GEL.objectUtil.join(data, "=", "\r\n")
		}
		return this; 
	}
}
GEL.extend(GEL.remoting.Fetcher.Ajax, GEL.remoting.Fetcher, { 
	setAttacher: function(){ return; },
	isLocal: function(){ return false; } ,
	makeElement: function(){ 
		if(typeof window['XMLHttpRequest'] != 'undefined' ){ 
			_el= new XMLHttpRequest(); 	
		}else { 
			for(var i=0;i<_XHRTYPES.length;i++) { 
				try{ _el= new ActiveXObject(_XHRTYPES[i]);break; }
				catch(e){}
			}
			if(!_el) throw new Error("Unable to create XML HTTP Request"); 
		}
		return _el; 
	}
}); 
GEL.Element.register(_GELTYPE, GEL.remoting.Fetcher.Ajax); 
GEL.Element.StateManager.Attached.XHR= function(){ 
	var _superC= GEL.Element.StateManager.Attached.XHR.superclass.constructor,
		_super= GEL.Element.StateManager.Attached.XHR.superclass; 
	_superC.apply(this, arguments); 
}
GEL.extend(GEL.Element.StateManager.Attached.XHR, GEL.Element.StateManager.Attached, {
	installTransitionDetector: function(){ 
		var 
			_self= this, 
			_gel= this.gelement,
			_el= _gel.getElement()
		; 
		_el.onreadystatechange= 
			function(e){ 
				if(this.readyState<4) return; 
				_self.stateTransitionHandler(_el); 
			}; 
	},
	stateTransitionHandler: function(el){ 
		this.isattach= true; 
		this.isready= true; 

		this.gelement.setContent(el.responseText); 
		el.onreadystatechange= null; 
		this.fire("loadstatetransition", this, { 
			oldstate: 'attach', 
			newstate: 'ready', 
			element: el, 
			gelement: this.gelement
		}); 
		this.gelement.setStateManager(new GEL.Element.StateManager.Ready(this.gelement)); 
	}
}); 
	
GEL.Element.XHRAttacher=function(){
	var _superC= GEL.Element.XHRAttacher.superclass.constructor; 
	_superC.apply(this, arguments); 
}

GEL.extend(GEL.Element.XHRAttacher, GEL.Element.Attacher, { 
	attachNodeToDOM: function(gelement){ 
		var _xhr= 
			gelement.getElement(); 
		if(!(gelement instanceof GEL.remoting.Fetcher.Ajax)) 
			throw new Error("give me a good gelement"); 
		_xhr.open(
			gelement.config.method, 
			gelement.getUrl(), 
			gelement.config.async
		); 
		_xhr.send(gelement.getSendData()); 
		if(!gelement.config.async)
			while(!gelement.isready) 
				gelement.stateManager.stateTransitionHandler(_xhr); 
		return _xhr; 
	}
}); 
})(); 

(function(){
GEL.remoting.Fetcher.IFrame= function(options){ 
	var _superC= GEL.remoting.Fetcher.IFrame.superclass.constructor,
		_el= null;
	_el= document.createElement("IFRAME"); 
	_superC.call(this,_el,options); 
	this.on('ready', function(){ 
		var _h= '', _el= this.getElement(); 
		if(_el.contentDocument) 
			_h= _el.contentDocument.body.innerHTML; 
		else if (_el.contentWindow) 
			_h= _el.contentWindow.document.body.innerHTML; 
		this.setContent(_h); 
	}); 
	this.setStateManager(new GEL.Element.StateManager.Attached(this)); 
	this.hide(); 
}
GEL.extend(GEL.remoting.Fetcher.IFrame, GEL.remoting.Fetcher, { 
	isLocal: function(){ return false; } 
}); 
})(); 

(function(){ 
if(typeof GEL.remoting.Fetcher.DocumentOverwriter == 'function') return; 
var 
	_D= document
	,_H= _D.getElementsByTagName("HEAD")[0]
; 
window['Overwriter']= Overwriter; 

/* 
*	Class: Overwriter
*		Pre-document-load emulation of document.write() in a 
*		Post-document-load context.  This class can be used as a 
*		data provider to allow running scripts that perform 
*		document.write() calls __after__ the document has loaded!
*
*	Parameters:  none
*/

function Overwriter(){
	var _superC= Overwriter.superclass.constructor; 
	_superC.call(this); 
	var 
		_cfg= GEL.namespace("config.overwriter")
		,_buff= [] 
		,_dw= null 
		,_dwl= null
		,_parser= null
		,_self= this
	; 
	this.begin= function(){ 
		_dw= _D.write; 
		_dwl= _D.writeln; 
		_parser= 
			new TagParser()
		_D.write= function(str){ 
			var 
				_strTok= str instanceof Array ? 
					str : str.split(""),
				_bl= _strTok.length,
				_el= 0,
				_buffer= null
			; 
			_buffer= 
				_parser.findTags(_strTok);
			if(_buffer.length > 0) {
				_buff[_buff.length]=  _buffer; 
			}
			if(_parser.tags.length > 0){
				_self.fire(
					"tagFound", 
					_self, 
					{tags: _parser.tags}
				);
				_parser.tags= []; 
			}
			if(_strTok.length > 0) {
				_D.write(_strTok); 
			}
		}
		_D.writeln= function(str){ 
			return _D.write(str + "\n"); 
		}
	}
	this.finish= function(){
		_D.write= _dw; 
		_D.writeln= _dwl; 
		_parser= null; 
		_self= null; 
	}
	this.read= function(){ 
		return (function(a){ 
			var 
				_l= a.length,
				_ret= [],
				_t
			; 
			for(var i=0;i<_l;i++){
				_t= a[i]; 
				_ret[_ret.length]= _t instanceof Array ?
					arguments.callee(_t): _t;
			}
			return _ret.join(""); 
		})(_buff); 
	}
	this.flush= function(){ 
		var ret= (function(a){ 
			var 
				_l= a.length,
				_ret= [],
				_t
			; 
			for(var i=0;i<_l;i++){
				_t= a[i]; 
				_ret[_ret.length]= _t instanceof Array ?
					arguments.callee(_t): _t;
			}
			return _ret.join(""); 
		})(_buff); 
		_buff= [];  
		return ret; 
	}
}
GEL.extend(Overwriter, GEL.event.Publisher); 
window['TagParser']= TagParser; 
function TagParser(tagList){ 
	var 
		_cfg= GEL.namespace("config.overwriter")
		,_C
		,_currTag=null
		,_loop= 0
		,_f= this.finder= new TagParser.tagfinder()
		,_self= this
		,_CHAR_RE= new RegExp("[A-Z]", "i")
		,_SELF_CLOSED_TAGS=(function(){ 
			var _t="img,area,base,basefont,br,hr,input,img,link,meta".split(",")
				,_l= _t.length, i=0,_ret= {}
			;for(;i<_l;i++)_ret[_t[i].toUpperCase()]= true; 
			return _ret; 
		})()

	;
	this.tags= []; 
	this.findTags= function(str){ 
		var 
			_buffer= [],
			_return= []
		; 

		if(_currTag)
			_currTag.body+=str.join(""); 
		do{ 
			_buffer= _f.find(str); 
			_return[_return.length]= _buffer;
			if(
			   _f.tag.complete  && 
			   checkTag(str)
			){ 
if(_cfg.debug){ 
var _t= this.tags[0]; 
GEL.log("Found complete tag " + 
GEL.objectUtil.join(_t, "= ", "\n\t") + 
GEL.objectUtil.join(_t.tagAttributeObj, " -=-= ", "\n\t\t")
); 
}
								_f.reset(); 
				return _return;
			}else if(_f.tag.complete){
				_f.reset();
			}
		}while(str.length > 0); 
		return _return;
	}
	function checkTag(str){
		var 
			_t= _f.tag,
			_tName= _t.tagName.toUpperCase() ,
			_removeIdx= 0,
			_bodyLen= 0
		; 
		if(
			_f.tag.close 
			&& _currTag
			&& _tName === _currTag.tagName
		){ 
		/*
		* The "3" here is kludgy, 
		* meant to account for the <,/, and > characters
		*/
			_removeIdx= str.length + 3 + _f.tag.tagName.length;
			_bodyLen= _currTag.body.length;
			_currTag.body= 
				_currTag.body.substr(0,_bodyLen - _removeIdx);
			var _ta= _currTag.tagAttributeObj= 
				TagParser.parseAttributes(_currTag.tagAttributes);
			if(
				'src' in _ta && 
				(
				!_ta['src']  || 
				!_ta['src'].match(_CHAR_RE)
				)
			){ 
				_currTag= null; 
				return false;
			}
			_self.tags.push(_currTag); 
			_currTag= null; 
			return true; 
		}else if (!_currTag && !_f.tag.close) {
			_currTag= GEL.objectUtil.copy(_f.tag); 
			_currTag.body= str.join(""); 
			return false; 
		}
	}
}
TagParser.tagfinder= window['tagfinder']= (function(){ 
var 
	_CHECK_TAGS= { "SCRIPT": true, "IFRAME": true }
	,_OPEN_RE= new RegExp("<(\/?)([A-Za-z]*)(\\s*)([^>]*)(>)?", "mg")
	,_CHAR_RE= new RegExp("[A-Z]", "i")
;
return O; 
function O(){ 
	var 
		_cfg= GEL.namespace("config.overwriter"),
		_intag= false, 
		_indexCount= -1,
		_buffer="", 
		_c= 0,
		_ptok= ''
	;
	this.reset= reset; 
	this.reset(); 
	this.find= function(tokens){ 
		var 
			_t= '',
			_match = null, 
			str= tokens,
			_str= _buffer,
			_tagName= '', 
			_tagNameComplete= false,
			_tagComplete= false, 
			_bodyClose= false, 
			_tagClose= false,
			_attributes= "",
			_matchLen= 0, 
			_bufferLen= _buffer.length,
			_cutIndex= 0,
			_idx= 0

		; 
		_str+=tokens.join("");
		_OPEN_RE.lastIndex= 0; 
		while( (_match= _OPEN_RE.exec(_str)) ){ 
			_idx= _match.index; 
			_bodyClose= _match[1];
			_tagName= _match[2].toUpperCase(); 
			_attributes= _match[4];
			_tagClose= _match[5]; 
			_tagComplete= _match[5]; 
			_tagNameComplete= _match[3] || _match[5];

			if (
				!_tagNameComplete || 
				( _tagNameComplete.match(_CHAR_RE) && !_tagComplete)
			)	
			{
				if(_match[0].length == _match[4].length + 1){ 
					return tokens.splice(0, _match.index + _match.length);
				}
				_buffer= 
					_str.substr(
						_match.index,
						_match[0].length
					);
				_intag= true; 
				return tokens.splice(0,tokens.length);
			}else if(_tagClose && _tagName ){ //&& _tagName.charAt(0) != " "){ 
				_buffer= ""; 
				_intag= false;   
				_matchLen= _match[0].length; 
				_cutIndex= _match.index + _matchLen - _bufferLen; 
				if(!(_tagName in _CHECK_TAGS)){continue;}
				if(_bodyClose){ 
					this.tag.tagName= _tagName; 
					this.tag.close= true; 
					this.tag.complete= true; 
				}else{
					this.tag.tagName= _tagName; 
					this.tag.tagAttributes= _attributes; 
					this.tag.complete= true; 
				}
				return tokens.splice(0,_cutIndex); 
			}else if(_match[0].length > 2 && !_tagName){
				return tokens.splice(0,_match.index + 1); 
			}else if(_tagName){
				_intag= true; 
			}
		}
	
		if(_intag) _buffer= _str; 
		return tokens.splice(0,tokens.length);
	}
	function reset(){ 
		this.tag= { 
			tagName: '', 
			tagAttributes: '', 
			started: false, 
			tagComplete: false,
			close: false, 
			complete: false
		};	 
		_intag= false; 
	}


}
})(); 
TagParser.parseAttributes= (function(){ 
var 
	_ATTR_RE= /([^=\s]+)(\s*=\s*((\"([^\"]*)\")|(\'([^\']*)\')|[^>\s]+))?/gm
;
return function(attributeString){ 
	var 
		_match, 
		_name= '', 
		_value= '',
		_return= {}
	; 
	_ATTR_RE.lastIndex= 0; 
	while( (_match= _ATTR_RE.exec(attributeString)) ){ 
		_name= _match[1].toLowerCase(); 
		_value= _match[7] || _match[6] || _match[5] || _match[4] || _match[3]; 
		_return[ _name ]= _value; 
	}
	return _return; 
}
})(); 
function _DocumentOverwriter(options){
	var 
		_superC= _DocumentOverwriter.superclass.constructor
		,_cfg= GEL.namespace("config.overwriter")
		,_gelement= options.element || GEL.ement("SCRIPT", {})
		,_attachFn= GEL.elementUtil.attachEventListener
		,_autoAttachChildren= 
			'autoAttachChildren' in options ? 
				options.autoAttachChildren : 
				("autoAttach" in _cfg ? _cfg.autoAttach : true )
 		,_remoteScripts= new GEL.MetaElement() 
		,_attachToEl= options.attachTo || _H
		,_fetching= false
		,_self= this
		,_ow= null
	; 
	this.transitionMapOverrides= {
		preattach: GEL.Element.StateManager.PreAttach.Null
	}; 
	_gelement.attachToElement= _attachToEl; 
	this.gelScript= _gelement; 
	_superC.call(this); /* , _gelement.getElement(), options);*/
	if("url" in options) 
		this.setUrl(options.url); 
	_remoteScripts.setAttacher("sync");
	_remoteScripts.on("ready", finishHandler); 
	var _contentArray= []; 
	function finishHandler(){ 
		_fetching= false; 
		_self.fire("ready", _self); 
		cleanup(); 
	}
	function scriptCompleteHandler(e){ 
		this.off("ready", arguments.callee); 
		this.off("error", arguments.callee); 
		document.getElementById= document._getElById;
		_ow.finish(); 
		if(e!=='ready'){ 
			GEL.log(_self+ " <-- Script ( " + this + " ) finished in shameful " + e ); 
			_self.fire("error", _self); 
			return false; 
		}else{ 
			flushBuffer(); 
			if(_autoAttachChildren) { 
				_remoteScripts.attach();
			}
		}
	} 
	this.loadScripts= function(){ 
		_remoteScripts.attach(); 
	}
	function cleanup(){
		_remoteScripts.off("ready", finishHandler); 
		_gelement= _remoteScripts= _ow= _self= null; 
	}
	function flushBuffer(){
		var _content= _ow.flush();
		_self.setContent(_content); 
		return _self.fire("dataAvailable", _self); 
	}
	function tagFoundHandler(e, obj){ 
		var 
			tagList= obj.tags
			,_script= null
			,_gel= null
			,_prov= null
		; 
		while(_script= tagList.shift()){
			if(_script.tagName.toLowerCase() !== 'script') continue;
			_gel= GEL.ement("SCRIPT", _script.tagAttributeObj);
			_gel.attachToElement= _attachToEl; 

			if (_gel.getElement().defer){ 
				_attachFn(window, "load", (function(gelement){ 
					return function(){ 
						GEL.log("attaching defered script"); 
						gelement.attach(); 
					}
				})(_gel)
				); 
			}else if(_gel.isLocal()){ 	
				_gel.setScriptText(_script.body); 
				_gel.executeScript(); 
			}else{ 
				_prov= new _DocumentOverwriter({ 
					element: _gel, 
					attachTo: _attachToEl
				}).on(
					"dataAvailable", 
					childDataAvailableHandler
				); 
				_remoteScripts.addElement(_prov); 
			}
		}
		_gel= _script= _prov= null; 
	}
	function childDataAvailableHandler(){ 
		_self.fire("dataAvailable", this); 
	}
	this.fetch= function(){ 
		if(_fetching) return true; 
		_fetching= true; 
		_ow= new Overwriter();
		if(this.getUrl()) { 
			_gelement.isLocal(false); 
			_gelement.setSource(this.getUrl());
		}
		document._getElById= document.getElementById; 
		document.getElementById= function(id){
			var _returnEl= document._getElById(id); 
			if(_returnEl) { return _returnEl; }
			flushBuffer(); 
			return document._getElById(id); 
		}
		_ow.on("tagFound", tagFoundHandler);  
		_ow.name= 'Overwriter:' + this.toString(); 
		this.fire("preattach", this); 
		_ow.begin(); 
		_gelement.on("ready", scriptCompleteHandler); 
		_gelement.on("error", scriptCompleteHandler); 
		_gelement.executeScript(); 
	}

	this.toString= function(){ 
		return _gelement.toString()
	} 

}
GEL.extend(_DocumentOverwriter, GEL.event.Publisher,{ 
	attach: function(){ 
		return this.fetch(); 
	},
	setUrl: function(u){ 
		this._url= u; 
	},
	getUrl: function(){ 
		var _t= typeof this._url; 
		if(_t=='string') return this._url; 
		else if (_t == 'function') return this._url(); 
		else if(_t=='object' && this._url.getUrl) return this._url.getUrl(); 
	},
	getContent: function(){ 
		return this._content; 
	},
	getData: function(){ return this.getContent(); }, 
	setData: function(){ return this.setContent.apply(this, arguments) }, 
	setContent: function(content){ 
		this._content= content; return content 
	}, 
	appendContent: function(content){ 
		this._content+=content; 
		return this._content; 
	}


}); 
(function(){ 
	var	
		_RUN= false,
		_Q= [],
		_P= GEL.thepage
	; 
function run(){ 
	if(_RUN)return; 
	var _e= _Q.shift(); 
	if(!_e) { 
		_P.fireLoadHandlers(); 
		_P.setLoadHandlerQueueing(false); 
		return; 
	}
	_RUN= true; 
	_e.on("ready", function(){ 
		this.off(arguments[0],arguments.callee); 
		_RUN= false; 
		setTimeout(run,10); 
	}); 
	_P.setLoadHandlerQueueing(true); 
	_e.attach(); 
}
GEL.remoting.Fetcher.DocumentOverwriter= function(){ 
 	
	var 
		_superC= GEL.remoting.Fetcher.DocumentOverwriter.superclass.constructor, 
		_superO= GEL.remoting.Fetcher.DocumentOverwriter.superclass
	; 
	_superC.apply(this, arguments); 
	this.attach= function(){ 
		this.attach= _superO.attach; 
		_Q.push(this); 
		if(!_RUN)run(); 
	}
} 
GEL.extend(GEL.remoting.Fetcher.DocumentOverwriter, _DocumentOverwriter); 
})(); 

})(); 



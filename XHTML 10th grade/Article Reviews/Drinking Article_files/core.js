/*
File: core.js *** GEL Version: 0912.396
*/
/* About: Copyright 2009 Gannett Media Technologies */ 
if (typeof GEL == 'undefined' || !GEL)  var GEL= {}; 
/*document.watch("cookie", function(n,oldVal,newVal) {
GEL.log("setting cookie " + n + " from " + oldVal + " to " + newVal); 
return newVal; 
});*/
GEL.log= function(msg){	
	if (typeof YAHOO == 'object' && typeof YAHOO.log == 'function') YAHOO.log (msg); 
	if( typeof console != 'undefined' && typeof console.log != 'undefined' ) console.log(msg); 
};
GEL.logEx= GEL.logException= function(e){ 
	GEL.log([
		"Exception Details:" , 
		"\tType: \"" + e.name , 
		"\tMessage: \"" + e.message, 
		"\tFile: \"" + e.fileName, 
		"\t\tLine: \"" + e.lineNumber
		].join("\n")
	); 
}
String.prototype.endsWith=function(txt) { 
	var rgx; 
	rgx= new RegExp(txt+'$', 'i'); 
	return this.match(rgx) != null; 
}

/*
 * Function: GEL.extend
 * Creates a subclass/superclass relationship.
 * 
 * Parameters:
 * 		subc - The subclass.
 * 		superc - The superclass.
 * 		overrides - A list of overrides.
 */
GEL.extend= function(subc, superc, overrides) {
        if (!superc||!subc) {
		var _msg= 
            		"extend failed, missing definition of ";
		_msg += 
			(!superc) ? " super class " :  " subclass ";
		_msg += 
			"please check that " +
                            "all dependencies are included.";
		throw new Error(_msg); 
        }
        var F = function() {};
        F.prototype=superc.prototype;
        subc.prototype=new F();
        subc.prototype.constructor=subc;
        subc.superclass=superc.prototype;
        if (superc.prototype.constructor == Object.prototype.constructor) {
            superc.prototype.constructor=superc;
        }
        if (overrides) 
            for (var i in overrides) 
                  subc.prototype[i]=overrides[i];
};
GEL.namespace = function(){
    var a=arguments, o=null, i, j, d,m;
    for (i=0; i<a.length; i=i+1){
        d=a[i].split(".");
        o=GEL;
        for (j=(d[0] == "GEL") ? 1 : 0; j<d.length; j=j+1) {
            o[d[j]]=o[d[j]] || {};
            o=o[d[j]];
        }
    }
    return o;
}
GEL.namespace('env', 'util', 'config', 'widget'); 
GEL.arrayUtil= {
		/* 
		 * Function: copy
		 * Copies an array.
		 * 
		 * Parameters:
		 * 		ary - The array to copy.
		 * 		filter - A filter function to apply to the array elements.
		 */
	copy: function(ary,filter){
		if(this.length)
			ary= this;
		if(typeof ary == 'undefined' || !ary || !ary.length){
			return new Array(); 
		}
		var i=0, _ret= new Array(); 
		for (;i<ary.length;i++) {
			if(
				typeof filter == 'function' && 
				!filter.call(ary[i])
			) continue; 
			_ret.push(ary[i]); 
		}
		return _ret;
	},
	toObject: function(ary, value){ 
		var obj= {}; 
		value= typeof value == 'undefined' ? true: value; 
		for(var i=0,l=ary.length,o=ary[i];i<l;o=ary[++i]) 
			obj[o]= value; 
		return obj; 
	}
}
GEL.objectUtil={
		/*
		 * Function: keys
		 */
	keys: function(o){
		var a=[], i;
		for (i in o) 
			a.push(i)
		return a;
	},
	values: function(o){ 
		var a= [],i;
		for (i in o)
			a.push(o[i]); 
		return a; 
	},
	copy: function(o){ 
		var _return= {}
		for(var a in o) {
			_return[a]= o[a]; 	
		}
		return _return; 
	}, 
	join: function(o,keydelim,paramdelim){ 
		var _return= "", _value= "", _key= "",i=0,_a;
		for (_key in o){ 
			_a= [ _key, keydelim, o[_key] ]; 	
			if(i++>0) _a.unshift(paramdelim);
			//_return += [ paramdelim + _key + keydelim + o[_key]].join(""); 
			_return += _a.join(""); 
		}
		return _return; 
	},
	isEqual: function(a,b){ 
		if(a===b) return true; 
		var k, v; 
		for(k in a){ 
			v= b[k]; 
			if(v!=a[k]) return false; 
		}
		return true; 
	},
	toArray: function(o){
		var _ret= []; 
		for(var a in o)
			_ret.push(a, o[a]); 
		return _ret; 
	}
};
(function(){ 
	if(typeof GELConfig == 'undefined') return; 
	var 
		_c= GEL.namespace("config"),
	    	_c2= GELConfig 
	; 
	for(var a in _c2){
		if(a in _c)
			continue; 
		GEL.config[a]= GELConfig[a]; 
	}
})(); 
(function(){ 
var 
	_o= {_default: true, timers: false}, 
	_d= GEL.namespace("config.init"),
	_cfg= '', _inc, _attr, 
	_args= window.location.search.split("&")
;
for(var i=0;i<_args.length;i++){ 
	if(_args[i].indexOf("GEL.config.init=") < 0 )continue; 
	_cfg= _args[i].split("="); 
	_cfg= _cfg[1]; 
	_cfg= _cfg.split(";"); 
	for(var j=0;j<_cfg.length;j++) {
		_inc= _cfg[j].substr(0,1); 
		_attr= _cfg[j].substr(1,_cfg[j].length); 
		if(_attr in _d) continue; 
		if(_attr=='*') _attr= "_default"; 
		_d[_attr]=_inc == "+" ? true : false; 
	}
}
if(!('_default' in _d)) _d["_default"]= true; 
if(!('timers' in _d)) _d["timers"]= false;
return _o; 
})(); 


/*
 * Section: GEL.elementUtil
 */
GEL.elementUtil= (function(){ 
	var 
		_W= window, 
		_D= document,
	_S= { 
	get: function(element){ 
		var _t= typeof element; 
		switch(_t){
			case "string": 
				return _D.getElementById(element); 
			case "object": 
			case "function": 
				return element; 
			default: 
				return null; 
		}
	},
	/*
	 * Function: hasClassName
	 * Checks to see whether or not the element's class name contains a specific string.
	 * 
	 * Parameters:
	 * 		className - The name to check against.
	 * 
	 * Returns:
	 * 		Boolean Value.
	 */
	hasClassName: function(el,className) { 
		el= _S.get(el); 
		if(!el || !el.className) return false; 
		var a= el.className.split(/\s+/); 
		for (var i=0;i<a.length;i++) 
			if (a[i] == className) return true; 
		return false;
	},
	/*
	 * Function: addClassName
	 * Adds to the element's class name.
	 * 
	 * Parameters:
	 * 		className - The name to add to the element's class name.
	 */
	addClassName: function(el,className){ 
		el= _S.get(el); 
		if(!el) return; 
		if ( GEL.elementUtil.hasClassName(className) )
			return; 
		else 
			el.className += ' ' + className; 
	},
	/*
	 * Function: removeClassName
	 * Removes a specific class name from the element.
	 * 
	 * Parameters:
	 * 		className - The name to remove from the elements class name.
	 */
	removeClassName: function(el,className){ 
		el= _S.get(el); 
		if(!el) return; 
		if(! (GEL.elementUtil.hasClassName(el,className)) ) return; 
		var classes, i=0, c; 
		className= className.toLowerCase(); 
		classes= el.className.split(' ');
		for (;i<classes.length; i++ ) { 
			c= classes[i];
			if ( c.toLowerCase() == className ) 
				classes.splice(i, 1); 
		}
		el.className= classes.join (" "); 
	},
	attachEventListener: (function(){
		function attachEvent(el,event,handler){ 
			el= _S.get(el); 
			if(!('attachEvent' in el)) 
				return expandoEvent(el,event,handler); 
			if(!event || typeof event != 'string') return; 
			event= event.toLowerCase();
			if(event.indexOf("on") != 0)
				event='on'+event;
			el.attachEvent(event, handler);
		}
		function addEvent(el,event,handler){ 
			el= _S.get(el); 
			if(!event || typeof event != 'string') return; 
			if(typeof el=='undefined'||!el)return null; 
			el.addEventListener(event, handler, false);
		}
		function expandoEvent(el,event,handler){ 
			el= _S.get(el); 
			if(!event || typeof event != 'string') return; 
			event= event.toLowerCase();
			if(typeof el=='undefined'||!el)return null; 
			event= 'on'+ event; 
			el[event]= handler; 
		}


		if(_W.attachEvent) return attachEvent; 
		else if(_W.addEventListener)return addEvent; 
		else return expandoEvent; 
	})(),
	detachEventListener: (function(){ 
		function detach(el,event,handler){ 
			el= _S.get(el); 
			if(!el.detachEvent) return dexpando(el,event,handler); 
			if(event.indexOf("on") != 0) event= "on"+event; 
			try  { return el.detachEvent(event, handler, false); }
			catch(e){ GEL.logException(e); } 
		}
		function remove(el,event,handler){ 
			el= _S.get(el); 
			try { return el.removeEventListener(event,handler,false); }
			catch(e){ GEL.logException(e); } 
		}
		function dexpando(el,event){ 
			el= _S.get(el); 
			if(event.indexOf("on") != 0) event= "on"+event; 
			try { 
				el[event]= null; 
				delete el[event];
			}
			catch(e) { el[event]= new Function(); }  
			return ;
		}
		if(_W.detachEvent)return detach; 
		if(_W.removeEventListener)return remove; 
		else return dexpando; 
	})(),
	purge: function(element){
		if(!GEL.env.ua.ie) return;
		element= _S.get(element); 
		if(!element) return null; 
		var 
			_a= element.attributes,
			_l= _a ? _a.length : 0,
			id= element.id, 
			_n= '',
			_t= ''
		; 
		for(var i=0; i < _a.length; i++){
			_n= _a[i].name; 
			try{ _t= typeof element[_n]; }
			catch(e) { } 
			if(_t=='function'){ 
				element[_n]= null;
			}
		}
		return element; 
	},
	remove: function(element){
		element= _S.get(element); 
		if(!element) return null; 
		var 
			_p= element.parentNode, 
			_cs= element.childNodes, 
			_c= null,
			_pFn= GEL.elementUtil.purge
		;
		if(_cs && _cs.length > 0) 
			removeChildren(element); 
		if(element.nodeType == 1){
			try { _pFn(element); } 
			catch (e) { }
		}
		if(_p) 
			_p.removeChild(element); 
		return null; 
		function removeChildren(el){ 
			var 
				_cs= el.childNodes,
				_child= null,
				_last= _cs.length, 
				_gel= null,
				_leave= 0
			; 
			while(_cs.length > _leave){
				_child= _cs[_leave]; 
				if(
					_child.id && 
					(_gel= GEL.cachemgr.get(_child.id))
				) {
					_gel.removeElement(); 
				}else 
					_S.remove(_child); 
			}
		}
	},
	getFragmentFromHTML: function(html){
		var 
			_f= _D.createDocumentFragment(), 
			_div= _D.createElement("DIV"),
			_children= []
		; 
		if(GEL.env.ua.ie){
			_div.style.display= 'none'; 
			_div.style.visibility= 'hidden'; 
			document.body.insertBefore(
				_div,
				document.body.firstChild
			); 
		}
		_div.innerHTML= html;
		for(var i=0,l= _div.childNodes.length;i<l;i++) 
			_children[i]= _div.childNodes[i]; 
		for(var i=0,l=_children.length;i<l;i++) 
			_f.appendChild(_children[i]); 
		if(_div.parentNode) // IE insertion-order leak 
			_div.parentNode.removeChild(_div); 
		_div= _children= null; 
		return _f; 
	}

	}
			
	return _S;
})(); 
GEL.env.ua= function() {
var 
	o={ 
        	ie:0,
		opera:0,
        	gecko:0,
		webkit:0,
		mobile:null, 
		air:0
	}, 
	ua= navigator.userAgent,
	m
; 
    if ((/KHTML/).test(ua)) {
        o.webkit=1;
    }
    // Modern WebKit browsers are at least X-Grade
    m=ua.match(/AppleWebKit\/([^\s]*)/);
    if (m&&m[1]) {
        o.webkit=parseFloat(m[1]);

        // Mobile browser check
        if (/ Mobile\//.test(ua)) {
            o.mobile = "Apple"; // iPhone or iPod Touch
        } else {
            m=ua.match(/NokiaN[^\/]*/);
            if (m) {
                o.mobile = m[0]; // Nokia N-series, ex: NokiaN95
            }
        }
        m=ua.match(/AdobeAIR\/([^\s]*)/);
        if (m)o.air = m[0]; 
    }
    if (!o.webkit) { 
        m=ua.match(/Opera[\s\/]([^\s]*)/);
        if (m&&m[1]) {
            o.opera=parseFloat(m[1]);
            m=ua.match(/Opera Mini[^;]*/);
            if (m) {
                o.mobile = m[0]; // ex: Opera Mini/2.0.4509/1316
            }
        } else { 
            m=ua.match(/MSIE\s([^;]*)/);
            if (m&&m[1]) {
                o.ie=parseFloat(m[1]);
            } else { 
                m=ua.match(/Gecko\/([^\s]*)/);
                if (m) {
                    o.gecko=1; 
                    m=ua.match(/rv:([^\s\)]*)/);
                    if (m&&m[1]) {
                        o.gecko=parseFloat(m[1]);
                    }
                }
            }
        }
    }
    return o;
}();
if(GEL.env.ua.ie && typeof document.execCommand == 'function')
	document.execCommand("BackgroundImageCache", false, true); 
GEL.env.os= (function() { 
	var 
		ua=  navigator.platform.toLowerCase(), 
		o= {win: false,mac: false,unix:false,linux:false,unknown:true}
	; 
	if(ua.indexOf("win")>=0){o.unknown=false; o.win=true} 
	else if(ua.indexOf("mac")>=0){o.unknown=false; o.mac=true} 
	else if(ua.indexOf("linux")>=0){o.unknown=false; o.linux=true} 
	else if(ua.indexOf("x11")>=0){o.unknown=false; o.unix=true} 
	return o; 
})(); 

GEL.tracker= (function() {
	var _tracking= new Object(), 
		_MAX_TRIES= 25, 
		_self= new Object(), 
		_nextIndex= 0, 
		_keys= GEL.objectUtil.keys, 
		_interval= 100,
		_timer= 0,_d=document; 
	_self.add= addTrackItem; 
	_self.remove= remove; 
	_self.tracking= _tracking;
	return _self; 
	function addTrackItem(finderFn, onSuccessFn, force){ 
		force= typeof force != 'undefined' ? force : false; 
		if(typeof onSuccessFn != 'function' || typeof finderFn!='function') 
			throw new Error ("GEL.tracker.add(finderFn, foundFn): ") ;
		var idx= 'idx_' + _nextIndex++; 
		_tracking[idx]= [finderFn, onSuccessFn,0, force]; 
		track(); 
		return idx; 
	}
	function runFinder(fn){ 
		var _return; 
		try { _return= fn() }
		catch(error){ 
			throw new Error (
				"GEL.tracker: Your function, " + 
				fn.toString() + 
				',  generated an error'
			); 
			GEL.logEx(error); 
		}
		return _return; 
	}
	function track(){ 
		var _ret= false, 
			a= null, _toRemove= new Array(),
			_finder= null, _found= null; 
		clearTimeout(_timer); 
		for (var id in _tracking) { 
			a= _tracking[id]; 
			_ret= runFinder(a[0]); 
			if(_ret) {
				remove(id); 
				a[1](_ret); 
			}else
				a[2]++; 
			if(a[2] > _MAX_TRIES && !a[3]) remove(id); 
		}
		if ( (_keys(_tracking)).length > 0) 
			_timer= setTimeout(track, _interval);  
	}

	function remove(id){ 
		delete _tracking[id];
	}
} )();

/*
 * Namespace: GEL.event
 */
GEL.namespace('event'); 
/* 
 * Function: GEL.event.DOMEvent
 */
GEL.event.DOMEvent= function(e) { 
	var tgt= null; 
	this.getTarget= getTarget; 
	this.preventDefault= preventDefault; 
	this.stopPropagation= stopPropagation; 
	this.domevent= e; 
	function getTarget(){ 
		if(tgt) return tgt; 
		if(e.target) return tgt= e.target;
		else if(e.srcElement) tgt= e.srcElement; 
		return tgt; 
	}
	function preventDefault(){ 
		if(e.preventDefault)return e.preventDefault(); 
		else e.returnValue= false;  
	}
	function stopPropagation(){ 
		if(e.stopPropagation) e.stopPropagation(); 
		else e.cancelBubble= true;  
	}
}

/* 
 * Function: GEL.event.Publisher
 */
GEL.event.Publisher= function(){
	this._subscribers= new Object()
	this.subscribe= function(){ 
		return this.on.apply(this, arguments); 
	}
	this.off= function(){ 
		return this.unsubscribe.apply(this,arguments);
	}
};
GEL.event.Publisher.prototype= { 
	/*
	* Function: subscribe
	* Subscribes a function to an event.
	* 
	* Parameters:
	* 		evt - The event.
	* 		fn - The function to subscribe.
	*/
	on: function(evt, fn) { 
		if(!this._subscribers) 
			this._subscribers= new Object();
		evt= evt.toLowerCase(); 
		if(typeof fn != 'function') {
			throw new Error("Must pass function, not " + typeof fn);  
		}
		if(!(evt in this._subscribers)) 
			this._subscribers[evt]= new Array(); 
		this._subscribers[evt].push(fn); 
		return this; 
	},
	/*
	 * Function: unsubscribe
	 * Unsubscribes a function to an event.
	 * 
	 * Parameters:
	 * 		evt - The event.
	 * 		fn - The function to unsubscribe.
	 */
	unsubscribe: function(evt,fn){
		evt= evt.toLowerCase(); 
		var 
			_found= false
			,_s= this._subscribers
			,_l= _s[evt]
			,_c= null
		; 
		if(!_l){
			return null; 
		}
		for(var i=0;i<_l.length;i++) {
			_c= _l[i];
			if(_c==fn) {
				_f=true; 
				break; 
			}
		}
		if(_f)
			return _l.splice(i,1);	
	},
	/*
	 * Function: fire
	 * Calls the subscribed functions.
	 * 
	 * Parameters:
	 * 		evt - The event.
	 * 		tgt - The target.
	 */
	fire: function(evt,tgt) {
		if(!this._subscribers) this._subscribers= new Object();
		evt= evt.toLowerCase(); 
		if (!(evt in this._subscribers)) return null;
		var _fn,
		    _fns= GEL.arrayUtil.copy.call
			( this._subscribers[evt] ), 
		    _args= GEL.arrayUtil.copy.call(arguments);
		_args.shift(); _args.shift(); 
		_args.unshift(evt); 
		if(!tgt) tgt= this; 
		for(var i=0;i<_fns.length;i++){
			try { _fns[i].apply(tgt, _args); }
			catch(e){ 
				GEL.log("Firing event " + evt + " and function, " + 
					_fns[i].toString() + " failed. Details follow:\n"
				); 
				GEL.logEx(e); 
				if(e.name == 'RangeError') debugger;
			}
		}
		return true;
	},
	/*
	 * Function: getsubscribers
	 * Gets the subscribers to an event.
	 * 
	 * Parameters:
	 * 		evt - The event
	 * 		fn - A specific function to look for in the subscribers.
	 * 
	 * Returns:
	 * 		The subscriber or subscribers to this event.
	 */
	getsubscribers: function(evt,fn){ 
		if(!this._subscribers) this._subscribers= new Object(); 
		if(!(evt in this._subscribers)) return null; 
		var _subs= this._subscribers[evt], 
			i=0; 
		if(typeof fn != 'function') 
			return _subs;  
		for (i=0;i<_subs.length; i++)
			if(fn == _subs[i]) return _subs[i]; 
	}
}; 
/* GEL.ement */ 


/* GEL.ement */ 

/*
 * Section: GEL.ement
 */
(function(){ 	
var 	_NIDX= 0, 
	_D= document, 
	_W= window, 
	_C= {  }; // This is where we will keep our overrides 

/* 
 * Function: createElement
 * 
 * Parameters:
 * 		tagName - A string that specifies the type of element to be created.
 * 		attributes - Listing of the GELement's attributes.
 * 
 * Returns:
 * 		A GELement with the given type and attributes.
 */
function createElement(tagName, attributes) { 
	var _el= null, _attr, _value; 
	try {_el= _D.createElement(tagName) }
	catch(error){ throw error; }
	for (_attr in attributes) { 
		if(!_attr) continue; 
		_value= attributes[_attr]; 
		if(typeof _value != 'string') _value= new String(_value); 
		try { _el.setAttribute(_attr, _value); }
		catch(e){ GEL.log ("Failed to set attribute \"" + _attr + "\" to " + _value ); }
	}
	return _el;
}

/*
 * Function: createGELement
 * 
 * Parameters: 
 * 		el - The object.
 * 		options - GELement options.
 */
function createGELement(el, options){ 
	var _tag;
	if(typeof el ==='object') 
		_tag= el.nodeName; 
	else 
		_tag= el; 

	if(typeof _tag == 'undefined' || !_tag) 
		return new GEL.Element.Base(el); 
	_tag= _tag.toUpperCase(); 
	options= options ||new Object(); 
	if(_tag in _C) return new _C[_tag](el,options); 
	else return new GEL.Element.Base(el,options); 
}
/*
 * Constructor: GEL.Element
 * Creates a GELement.
 * 
 * Paramters:
 * 		el - The GELement name.
 * 		attributes - Listing of GELement's attributes.
 * 
 * Returns:
 * 		The new GELement.
 */
GEL.Element= GEL.ement= function(el, attributes){ 
	var ret= null; 
// If we are given a gelement, return it back to the caller
	if(el instanceof GEL.Element.Base) { 
		ret= el; 
	}else if ( (ret= GEL.cachemgr.get(el)) ) { 
// If its in our local cache, return that 
		return ret; 
	}else if(typeof el=='string' && typeof attributes =='object'){ 
// we need to create a new object here, first arg is the type, second are the attributes
		if(!('id' in attributes))
			attributes.id= '__gelement_' + _NIDX++; 
		ret= createGELement(el, { 
			attributes: attributes, 
			transitionMapOverrides: {
				'preattach':  
					GEL.Element.StateManager.PreAttach.Null
			} 
		}); 
	}else if (typeof el == 'string') { 
// If we are given just a string, we assume this is for an element by id 
// I am not sure what to do about this 
// We need to create an anonymous element, 
// but at this point we do not know what kind it is 
		ret= createGELement({ id: el }); 
	}else if (typeof el == 'object'){ // They are feeding us the object , 
					// which we can assume is either all ready in the 
					// DOM or something we will attach ourselves 
		ret= createGELement(el, { 
			transitionMapOverrides: { 
				preattach: GEL.Element.StateManager.PreAttach.ImmediateTransition
			}
		}); 
	}
	return ret; 
}; 

/*
 * Function: GEL.Element.register
 * 
 * Parameters:
 * 		tag - -
 * 		fn - String or function
 */
GEL.Element.register= GEL.registerElement= function(tag,fn) { 
	tag= tag.toUpperCase(); 
	if(typeof fn == 'string' || typeof fn=='function') 
		_C[tag]= fn; 
	else
		throw new Error("Invalid type map constructor " + fn ); 
}

/*
 * Class: GEL.Element.Base
 */
/*
 * Constructor: GEL.Element.Base
 * 
 * Parameters:
 * 		el - The object.
 * 		_options - GELement options.
 */
GEL.Element.Base= function(el, _options){
	var 
		_superC= GEL.Element.Base.superclass.constructor,
		_d= document,
		_options= _options || new Object(), 
		_domEventListeners= new Object(),
		_attrs, 
		_self= this
	;  
	_superC.call(this); 
	if(typeof el == 'string' || !el) {
		_attrs= _options.attributes || {}; 
		var v= ''; 
		for (var k in _attrs){
			v= _attrs[k]; 
			delete _attrs[k]; 
			_attrs[k.toLowerCase()]= v; 
		}
			
		el= this.makeElement(el,_attrs); 
	}
	this.id= el.id; 
	this.domEvents= _domEventListeners; 
	this.setAttacher('dom'); 
	this.getElement= function(){ return this.element } 
	this.onTransition= onTransition; 
	this.unregisterDOMEvents= unregisterDOMEvents; 
	this.setElement= setElement; 
	if(GEL.config.logtransitions){ 
		this.on("loadstatetransition", logTransition); 
	}
	this.on("ready", installDOMEventListeners);  
	if('stateFactory' in _options) { 
		this.stateFactoryClass= _options.stateFactory;  
	}
	if('transitionMapOverrides' in _options) 
		this.transitionMapOverrides= _options.transitionMapOverrides; 
	if(el) this.setElement(el); 
	this.getStateFactory(); 
	this.setAnimator(); 
	GEL.addGELement(this); 
	return this; 
	/*  End Constructor */


	function installDOMEventListeners(){ 
		var _l= _domEventListeners; 
		for (var evt in _l) {
			delete _l[evt];  
			_self.registerDOMEvent(evt); 	
		}
	}

	/*
	 * Function: unregisterDOMEvents
	 * Unregisters all DOM Events.
	 * 
	 * See Also:
	 * 		<unregisterDOMEvent>
	 */
	function unregisterDOMEvents(){ 
		for (var evt in _domEventListeners) {
			_self.unregisterDOMEvent(evt); 
			/* delete _domEventListeners[evt];*/
		}
	}

	/*
	 * Function: onTransition
	 * Records a transition event.
	 */
	function onTransition(type, event) { 
		var 
			_sf= _self.getStateFactory(), 
			_sm= _sf.createStateManager(event.newstate),
			_currState= _self.getStateManager().type.toLowerCase(),
			_newState= _sm.type.toLowerCase()
		;
		_self['is'+_newState]= true; 
		_self.fire(type, _self, event); 
		_self.fire(event.newstate, _self, event); 
		_self.setStateManager(_sm); 
	}

	/*
	 * Function: setElement
	 * Sets the element to a passed value.
	 * 
	 * Parameters:
	 * 		el - The new element object to set to.
	 */
	function setElement(el){ 
		if(this.element && this.element !== el) 
			unregisterDOMEvents(); 
		if(!el) throw new Error("You cannot set an element without passing one ") ; 
		var _id= '';
		if(!el.id) {
			 _id= '__gelement_' + _NIDX++; 
			try { el.setAttribute('id', _id); } 
			catch (e) {}
			this.id= _id; 
		}
			else this.id= el.id; 
		this.element= el; 
	}
	function logTransition(type, event) {
		var str= [(new Date()).getTime() , ': ' , '(' , 
			this.id , '/' , this.tagName(), 
			') moved from "' , event.oldstate , 
			'" to new state "' , event.newstate , '"' 
		];
		var el= this.getElement(); 
		if(el.readyState) 
			str.push("; readyState= '", el.readyState, "'", 
			"  and is ready= ", this.isready); 

		GEL.log(str.join("")); 
	}


}
})();
(function(){ 
	var _DOMEVENTS= (function(){ 
		var events= "blur,focus,resize,scroll,click,dblclick," +
		"mousedown,mouseup,mousemove,mouseover,mouseout,mouseenter,mouseleave," +
		"change,select,submit,keydown,keypress,keyup";
		var _a= events.split(','),
			_o= new Object();
		for(var i=0;i<_a.length;i++) 
			_o[_a[i]]= true; 
		return _o; 
	})(), 
	_D= document,
	_H= document.getElementsByTagName('head')[0];
	

GEL.extend(GEL.Element.Base, GEL.event.Publisher, { 
	/*
	 * Function: on
	 * Creates an on event.
	 * 
	 * Parameters:
	 * 		evt - The event type.
	 * 		fn - 
	 */
	on: function(evt, fn){ 
		evt= evt.toLowerCase(); 
		if('attached'==evt)evt= 'attach'; // this is adapting a mistake
		var _cb= this.getsubscribers(evt), 
			_self= this; 
		GEL.event.Publisher.prototype.on.apply(this,arguments);
		if(evt in _DOMEVENTS && (!_cb || _cb.length==0) ){ 
			this.registerDOMEvent(evt); 
			return this;  
		}else {  
			if(this['is'+evt])
				fn.call(this, evt); 	
			return this; 
		}
	},
	attachToElement: document.getElementsByTagName("head")[0],
	stateFactoryClass: 'GEL.Element.StateManagerFactory', 
	insertBefore: function(destination){
		destination= destination || this.attachToElement; 
		this.attachToElement= destination; 
		this.setAttacher(
			new GEL.Element.Attacher.DOM.InsertBefore()
		); 
		if(this.isattach) this.attacher.attach(this); 
		else  this.attach(); 
		return this; 
	},
	insertAfter: function(destination){ 
		destination= destination || this.attachToElement; 
		this.attachToElement= destination; 
		this.setAttacher(new GEL.Element.Attacher.DOM.InsertAfter() ); 
		if(this.isattach) this.attacher.attach(this); 
		else this.attach(); 
		return this; 
	},
	/*
	 * Function: getStateFactory
	 * 
	 * Returns:
	 * 		_sf - the State Factory Manager
	 */
	getStateFactory: function(){ 

		if(typeof this.stateFactory!='undefined' && this.stateFactory)
			return this.stateFactory; 
		var 
			_c= this.stateFactoryClass, 
			_class=null,
			_str='', 
			_sf=null
		; 
		try { _class= eval(_c); } 
		catch(e){ throw new Error("Error: Invalid stateFactoryClass defined: \""+_c+"\"") } 
		var _sf= this.stateFactory= new _class(this); 
		for(var map in this.transitionMapOverrides) {
			_sf.transitionMap[map]= this.transitionMapOverrides[map]; 
		}
		_sf.makeManagers(); 
		this.setStateManager(_sf.createStateManager('preattach')); 
		return _sf;  
	},
	each: function(fn){ 
		fn.call(this); 
	},
	setTransitionMap: function(){ 
		var _sf= this.getStateFactory(); 
		for(var map in this.transitionMapOverrides) 
			_sf.transitionMap[map]= this.transitionMapOverrides[map]; 
	},
	/*
	 * Function: getDOMEventHandler
	 * Gets a DOM Event handler.
	 * 
	 * Returns:
	 * 		function(e) - A new GEL event handler.
	 */
	getDOMEventHandler: function(type){ 
		var _gel= this; 
		return function(e){ 
			var _domEvt= new GEL.event.DOMEvent(e); 
			_gel.fire(type, _gel, _domEvt);
		}
	},
	
	/*
	 * Function: setAnimator
	 * Sets the animator to a passed value.
	 * 
	 * Parameters:
	 * 		animator - The new value for the animator.
	 */
	setAnimator: function(animator){ 
		if(!animator) {
			animator= new GEL.anim.SimpleAnimator(this); 
		}
		if(!this.animator){ 
			this.animator= animator; 
			return this.animator; 
		}
		this.animator= animator; 
		return this.animator; 
	},
	
	/*
	 * Function: getAnimator
	 * Gets the animator.
	 * 
	 *  Returns: 
	 *  	animator - The animator.
	 */
	getAnimator: function(){ 
		return this.animator; 
	},


	/*
	 * Function: tagName
	 * Gets the tagName.
	 * 
	 * Returns:
	 * 		tagName - The GELement's type.
	 */
	tagName: function(){
		var _el= this.getElement(); 
		if(_el && _el.nodeName) 
			return _el.nodeName; 
		else if (_el && _el.tagName) {
			if(typeof _el.tagName == 'function') 
				return _el.tagName(); 
			else 
				return _el.tagName; 
		}else return 'unknown'; 
	},

	/*
	 * Function: attachEventListener
	 * Attaches an event listener to the GELement.
	 *   The anonymous function should determine early what 
	 *   we need to use here which is faster than checking 
	 *   each time we're called 
	 * 
	 * Parameters: 
	 * 		event - The event type.
	 * 		handler - The event handler.
	 */
	attachEventListener: (function(){ 
		var _AEFN= GEL.elementUtil.attachEventListener; 
	return function(event,handler){
		return _AEFN(this.getElement(), event,handler); 
		
	}})(),
	/*
	 * Function: detachEventListener
	 * Detaches an event handler from its event.
	 * 
	 * Parameters:
	 * 		event - The event to detach the handler from.
	 * 		handler - The handler to detach from the event.
	 */
	detachEventListener: (function(){ 
		var _DEFN= GEL.elementUtil.detachEventListener;
	return function(event,handler){ 
		_DEFN(this.getElement(),event,handler); 
	}})(),
	
	/*
	 * Function: unregisterDOMEvent
	 * Unregisters a DOM Event by type.
	 * 
	 * Parameters:
	 * 		type - The type of DOM Event.
	 * 
	 * See Also:
	 * 		<unregisterDOMEvents>
	 */
	unregisterDOMEvent: function(type){ 
		return this.stateManager.unregisterDOMEvent(type);
	},
	
	/*
	 * Function: registerDOMEvent
	 * Registers a DOM Event.
	 * 
	 * Parameters:
	 *		type - The type of DOM Event.
	 */

	registerDOMEvent: function(type){ 
		this.stateManager.registerDOMEvent(type); 
	},


	getStateManager: function(){ 
		return this.stateManager; 
	},
	/*
	 * Function: setStateManager
	 * Sets the state manager to a passed value.
	 * 
	 * Parameters:
	 * 		stateManager - The new state manager.
	 */
	setStateManager: function(stateManager){ 
		if(! (stateManager instanceof GEL.Element.StateManager) ) 
			throw new TypeError 
				("GEL.Element.Base.setStateManager(GEL.Element.StateManager)"); 
		if(this.stateManager) 
			this.stateManager.unsubscribe(
				"loadstatetransition", this.onTransition
			); 
		this.stateManager= stateManager; 
		this.stateManager.on("loadstatetransition", this.onTransition); 
		this.stateManager.begin();
	},
	/*
	 * Function: setAttacher
	 * Sets the attacher to a passed value.
	 * 
	 * Parameters:
	 * 		attacher - The new attacher or attacher name.
	 */
	setAttacher: function(attacher){ 
		
		if(attacher instanceof GEL.Element.Attacher) {
			this.attacher= attacher; 
			return this; 
		}else if (typeof attacher=='string')
			attacher= attacher.toLowerCase();
		else 
			attacher= ''; 
		this.attacher= GEL.Element.Attacher.get(attacher,this); 
		return this; 
	},
	/*
	 * Function: attach
	 * Attaches HTML to the element.
	 * 
	 * Parameters:
	 * 		HTMLElement - HTML to attach to the element.
	 */
	attach: function(HTMLElement) {
		this.attachToElement= 
			HTMLElement||this.attachToElement; 
		this.fire("beforeAttach", this); 
		return this.stateManager.attach();
	},
	/*
	 * Function: write
	 */
	write: function(){ 
		var inlineAttacher= new GEL.Element.Attacher.Writer(); 
		inlineAttacher.attach(this); 
	},
	/*
	 * Function: asHTML
	 * Processes the element as HTML.
	 * 
	 * Returns: 
	 * 		The element as HTML.
	 */
	asHTML: function(){ 
		var 
			el= this.getElement(); 
		if(!el) return new String(); 
		if(el.outerHTML) 
			return el.outerHTML; 
		else 
			return (function(){ 
				var d= _D.createElement('div'); 
				d.appendChild(el); 
				return d.innerHTML; 
			})(); 
	},
	/*
	 * Function: setHTML
	 * Sets the element HTML to a passed value.
	 * 
	 * Parameters:
	 * 		html - The new HTML.
	 */
	setHTML: function(html){ 
		this.clearElement(); 
		this.appendHTML(html); 
		return this; 
	},
	/*
	 * Function: removeElement
	 * Removes the GELement and all children.
	 */
	removeElement: function(){ 
		this.unregisterDOMEvents(); 
		GEL.elementUtil.remove(this.getElement()); 
		GEL.rmGELement(this); 
		this.setElement({id: this.id}); 
		return this; 
	},
	purgeElement: function(){ 
		GEL.elementUtil.purge(this.getElement()); 
	},
	
	/*
	 * Function: clearElement
	 * Removes all child GELements of this element.
	 */
	clearElement: function(){

	// This can probably use some work.  If we have a gelement as a 
	// child of our element, we will remove it without cleaning up 
	// its event handlers, which will leak memory in IE

		var 
			_p= this.getElement(), 
			_c, 
			_gel,
			_rFn= GEL.elementUtil.remove
		; 
		try { 
			if(!('childNodes' in _p) ) { return this; } 
		}
		catch(e){ } 
		while(_p.childNodes.length > 0) { 
			_c= _p.childNodes[0]; 
			if(_c.id && (_gel= GEL.cachemanager.get(_c.id)) ) { 
				_gel.removeElement(); 
			}else { 
				_rFn(_c); 
			}
		}
		return this; 
	}, 
	/*
	 * Function: appendChild
	 * Adds a child to the GELement.
	 */
	appendChild: function(el){ 
		if(typeof el=='undefined' || !el) return; 
		if(el instanceof GEL.Element.Base) {	
			el.attachToElement= this.getElement(); 
			el.attach(); 
		}else { 
			var _me= this.getElement(); 
			if(!_me) debugger;
			_me.appendChild(el); 
		}
		return this; 
	},
	/*
	 * Function: appendHTML
	 * Appends HTML to the element.
	 * 
	 * Parameters:
	 * 		html - HTML code to append.
	 * 
	 * Returns:
	 * 		this - the GELement.
	 */
	appendHTML: function(html){
		var 
			_f= _D.createDocumentFragment(), 
			_div= _D.createElement("DIV")
		; 
		if(GEL.env.ua.ie){// Prevent DOM insertion-order leak 
			_div.style.display= 'none'; 
			_div.style.visibility= 'hidden'; 
			document.body.appendChild(_div); 
		}
		_div.innerHTML= html;
		while(_div.childNodes.length > 0)
			_f.appendChild(_div.childNodes[0]);
		this.getElement().appendChild(_f);
	
		if(_div.parentNode) // IE insertion-order leak 
			_div.parentNode.removeChild(_div); 
		return this; 
	},
	/*
	 * Function: hasClassName
	 * Checks to see whether or not the element's class name contains a specific string.
	 * 
	 * Parameters:
	 * 		className - The name to check against.
	 * 
	 * Returns:
	 * 		Boolean Value.
	 */
	hasClassName: function(className) { 
		var el= this.getElement(); 
		if(!el || !el.className) return false; 
		var a= el.className.split(/\s+/); 
		for (var i=0;i<a.length;i++) 
			if (a[i] == className) return true; 
		return false;
	},
	/*
	 * Function: addClassName
	 * Adds to the element's class name.
	 * 
	 * Parameters:
	 * 		className - The name to add to the element's class name.
	 */
	addClassName: function(className){ 
		var el= this.getElement(); 
		if(!el) return; 
		if ( this.hasClassName(className) )
			return; 
		else 
			el.className += ' ' + className; 
	},
	/*
	 * Function: removeClassName
	 * Removes a specific class name from the element.
	 * 
	 * Parameters:
	 * 		className - The name to remove from the elements class name.
	 */
	removeClassName: function(className){ 
		if(! (this.hasClassName(className)) ) return; 
		var el= this.getElement(), 
			classes, i=0, c; 
		if(!el) return; 
		className= className.toLowerCase(); 
		classes= el.className.split(' ');
		for (;i<classes.length; i++ ) { 
			c= classes[i];
			if ( c.toLowerCase() == className ) 
				classes.splice(i, 1); 
		}
		el.className= classes.join (" "); 
	},
	// This is primarily for script elements to see if they define a local or remote script
	/*
	 * Function: isLocal
	 * Checks to see if a script element defines a local or remote script.
	 * 
	 * Returns:
	 * 		Boolean value.
	 */
	isLocal: function(force){ 
		if(typeof force != 'undefined' || this.islocal)  { 
			this.islocal= force; 
			return this.islocal; 
		}
		var _el= this.getElement(),
			_src= 'getSource' in this ? 
				this.getSource(): _el.src
		;

		if(
			typeof _src != 'undefined' &&  
			_src &&
			!_el.getAttribute("DEFER")
		)
			return false; 
		else if (
			typeof _el.nodeName == 'string' && 
			_el.nodeName.toUpperCase() == 'LINK'
		)
			return false; 
		else return true; 
	},
	/*
	 * Function: width
	 * Gets the elements width.
	 * 
	 * Returns:
	 * 		clientWidth - the element's width.
	 * 
	 */
	width: function(){ 
		return this.getElement().clientWidth; 
	},
	/*
	 * Function: height
	 * Gets the elements height.
	 * 
	 * Returns:
	 * 		clientWidth - the element's height.
	 * 
	 */
	height: function(){ 
		return this.getElement().clientHeight; 
	},
	/*
	 * Function:offset 
	 * Gets the elements height.
	 * 
	 * Returns:
	 * 	Object 
	 *		left - the element's left offsetwindow .
	 * 		top  - the elements top offset from window
	 */
	 offset: 
	 function(){
	 	var 
			_el= 'getElement' in this ? 
				this.getElement() : this,
			_left= 0, 
			_top= 0
		; 
		do{
			_left += _el.offsetLeft || 0; 
			_top += _el.offsetTop ||0; 
		}while(_el= _el.offsetParent)
		return { left: _left, top: _top }; 	
	 },


	makeElement: function(tagName, attributes) { 
		var _el= null, _attr, _value, _classes, _addClass= GEL.elementUtil.addClassName; 
		try {_el= _D.createElement(tagName) }
		catch(error){ throw error; }
		
		if("classname" in attributes) {
			_classes= attributes.classname.split(/\s+/); 	
			for(var i=0,l=_classes.length;i<l;i++) 
				_addClass(_el, _classes[i]); 
			delete attributes.classname;
		}
		if("class" in attributes && GEL.env.ua.ie < 8){
			_classes= attributes["class"].split(/\s+/); 	
			for(var i=0,l=_classes.length;i<l;i++) 
				_addClass(_el, _classes[i]); 
			delete attributes["class"];
		}
			
		for (_attr in attributes) { 
			_value= attributes[_attr]; 
			if(typeof _value == 'number') _value= String(_value); 
			else if(typeof _value != 'string') continue; 
			try { _el.setAttribute(_attr, _value); }
			catch(e){ 
				GEL.log ("Failed to set attribute " + _attr + " to " + _value ); 
				_el[_attr]= _value; 
			}
		}
		return _el;
	},
	getStyle: (function(){ var _W= window; return function(styleAttribute){ 
		if(this._computedStyle) 
			return this._computedStyle[styleAttribute]; 
		if(_W.getComputedStyle) {
			this._computedStyle= 
				_W.getComputedStyle(this.getElement(), null); 
			return this._computedStyle[styleAttribute]; 
		}else { 
			return this.getElement().style[styleAttribute]; 
		}
	}})(),

	css: function(o){ 
		if(typeof o != 'object') return; 
		var _e= this.getElement(),_s; 
		if(!_e) return; 
		try { 
		for(var k in o){ 
			_e.style[k]= o[k]; 	
		}
		}
		catch(e){ }  
		return this; 
	},
	/*
	 * Function: toString
	 * Generates a string from the element.
	 */
	toString: function(){ 
		return this.id + '/' + this.tagName(); 
	},
	/*
	* Function: forceRender 
	*  Flushes the element to the DOM forcing a redraw
	* Returns: GEL.ement
	*/
	forceRender:(function(){ 
		var _D= document; 
	return function(){ 
		var 
			_el= this.getElement(), 
			_n= null
		; 
		if(!_el.nodeType) return; 
		try{ 
			_n= _D.createTextNode(' ');
			_el.appendChild(_n); 
			_el.removeChild(_n); 
		}catch(e){}
		var _h= _el.clientHeight; 
		return this; 
	}})()
});

GEL.Element.Base.prototype.clear= 
	GEL.Element.Base.prototype.clearElement; 
})();
(function(){ 
	/*
	 * Variable: ANIMATION_DELEGATES
	 * Holds animation types.
	 */
var ANIMATION_DELEGATES= 
[ 
	'moveTo','moveBy','show', 'hide', 'toggle', 'slideIn', 'slideOut', 
	'isVisible','fadeOut', 'fadeIn'
];
for ( var i=0;i<ANIMATION_DELEGATES.length; i++){
	var _m= ANIMATION_DELEGATES[i]; 
	GEL.Element.Base.prototype[_m]= (function(){ 
		var _method= _m;
		return function(){ 
			return this.animator[_method].apply(this.animator, arguments); 
		}
	})();
}

})(); 
GEL.Element.Script= function(element, attributes){ 
	var 
		_superC= GEL.Element.Script.superclass.constructor,
		_source= null
	; 
	this._url= ''; 
	_superC.apply(this,arguments); 
}
GEL.extend(GEL.Element.Script, GEL.Element.Base,{
	stateFactoryClass: 'GEL.Element.StateManagerFactory.Remote',
	toString: function(){ 
		var _super= GEL.Element.Script.superclass; 
		var _str= _super.toString.call(this); 	
		if(this.isLocal()){ return _str; } 
		_str += '/' + this.getElement().src;  
		return _str; 
	},
	setScriptText: function(txt){ 
		var _el= this.getElement(); 
		_el.text= txt; 
		return this; 
	},
	getScriptText: function(){ 
		return this.getElement().text; 
	},
	attach: function(){ 
		var 
			_super= GEL.Element.Script.superclass.attach,
			_ret
		; 

		/* 
			UGGGH! 
			IE wants this set prior to DOM insertion 
			otherwise, it will immediately set the 
			readyState to completed and fire the readystatechange
			event which will trick us into believing the 
			script is finished 
		*/
		if(!('setSource' in this)) 
			return _super.apply(this,arguments); 
		this.setSource(); 
		_ret= _super.apply(this,arguments); 
		/* 
			HOWEVER; 
			WebKit cannot deal with having the src attribute 
			set prior to DOM insertion.  Essentially, if 
			the object is all ready cached, it will 
			never fire the onload event.  
			
			Gecko seems to not really care either way
		*/
		this.setSource(); 
		return _ret; 
	},
	getSource: function(){ return this._url ; }, 
	setSource: function(source, force){ 
		if(source)  
			this._url= source; 
		if(!this.element) return; 
		var 
			_u= this._url, 
			_s= this.getElement().src
		; 
		if(_u === _s) return this;
		if(force || !GEL.env.ua.webkit || this.isattach) {
			if(!('setAttribute' in this.getElement()))return this;
			this.getElement().setAttribute("src", _u); 
			this._url= this.getElement().src;
		}
		return this; 
	},
	makeElement: function(tagName, attributes){ 
		var _super= GEL.Element.Script.superclass.makeElement; 
		if('src' in attributes && GEL.env.ua.webkit){
			this.setSource(attributes.src); 
			delete attributes.src; 
		}else { 
			this.setSource(attributes.src); 
		}
		var _el= _super.call(this, tagName, attributes); 
		return _el;
	},
	executeScript: function(){ 
		if(!(this.isLocal())) { 
			return this.attach(); 
		}
// Other browsers execute local scripts attached to the DOM immediately. 
// Gecko also does not provide the onload event for local scripts
		if(GEL.env.ua.gecko||GEL.env.ua.opera){ 
			var 
				_el= this.getElement(), 
				_text= this.getScriptText()
			;
			if(
			   (_el.language && _el.language.toLowerCase() != 'javascript') ||
			   (_el.type && _el.type.toLowerCase().indexOf("javascript") < 0) 
			) 
				return this.attach(); 
			try{ window.eval(_text) } 
			catch(e){ 
				var _msg= [
					"FAiled to execute local script: \"",
					"\nScript Body: \"", _text ,'"'
				].join("");
				GEL.log(_msg); 
				GEL.logEx(e); 
			}
			this.setScriptText(""); 
		}
		this.attach(); 
		if(!GEL.env.ua.ie){
			this.stateManager.stateTransitionHandler(); 
		}
	},
	attachToElement: document.getElementsByTagName("HEAD")[0]
});
GEL.Element.register("SCRIPT", GEL.Element.Script);
GEL.Element.Document= (function(){ 
	var _THEPAGE= null; 
	return function(){ 
	if(_THEPAGE) return _THEPAGE; 
	_THEPAGE= this; 
	var 
		_superC= GEL.Element.Document.superclass.constructor,
		_W= window, 
		_D= document,
		_G= GEL, 
		_aeFn= _G.elementUtil.attachEventListener, 
		_deFn= _G.elementUtil.detachEventListener, 
		_queueLoadHandlers= false, 
		_self= this

	; 
	this.element= document; 
	this.element.id= "D";
	_superC.apply(this,arguments); 
	_aeFn(_W, "onunload", function(){ 
		_self.fire("unload", _self); 	
		_deFn(_W,"onunload", arguments.callee); 
		if('CollectGarbage' in _W) { 
			_W.CollectGarbage(); 
		}
	}); 
	GEL.Element.Document= function(){ return _self; } 
	this.fireLoadHandlers= new Function(); 
	this.setLoadHandlerQueueing= function(queue){ 
		if(typeof queue != 'boolean') return; 
		_queueLoadHandlers= queue; 	
		return this; 
	}
	this.overrideLoadHandlers= (function(){ 
		var 
			_isIE= GEL.env.ua.ie, 
			_callbackQueue= _self.loadHandlers= [], 
			_owFn= _isIE ? 'attachEvent' : 'addEventListener', 
			_owDOM= [window, document], 
			_owHandler= function(domObject){ 
				var 
					_events= _self.loadEvents
				; 
				return function(type,cb){
					if(type in _events && this in _events[type]){ 
						if(_queueLoadHandlers){ 
							_callbackQueue.push([ cb, this, _events[type][this]])
						}else { 
							cb.call(this,_events[type][this]); 
						}
					}else { 
						if(arguments.length > 2)
							return this['_' + _owFn](type,cb,arguments[2]); 
						else 
							return this['_' + _owFn](type,cb); 
					}
					return  this; 
				}
			}
		;
		return function(){ 
			for (var i=0,l=_owDOM.length,o=_owDOM[i]; i<l;o=_owDOM[++i]){ 
				o['_' + _owFn]= o[_owFn]; 
				o[_owFn]= _owHandler(o); 
			}
			this.overrideLoadHandlers= new Function(); 
			this.fireLoadHandlers= function(){ 
				GEL.log("firing load handler callback for " + _callbackQueue.length + " functions"); 
				var a= null; 
				while((a= _callbackQueue.shift())){
					a[0].call(a[1],a[2]); 
				}
			}
		}		
	})();

}
})(); 
GEL.extend(GEL.Element.Document, GEL.Element.Base,{
	loadEvents: (function(){ 
		var _D= document, _W= window, _isIE= GEL.env.ua.ie; 
		return { 
		DOMContentLoaded: _isIE ? false : [ _D, _W ],
		readystatechange: _isIE ? [ _D ] : false,
		load:  [ _W ]
		}
	})(), 
	stateFactoryClass: 'GEL.Element.StateManagerFactory.Document',
	tagName:function(){return "#DOCUMENT"}, 
	element: document, 
	purgeElement: new Function(), 
	setElement: new Function(), 
	attachToElement: null 
});
GEL.Element.register("#DOCUMENT", GEL.Element.Document);
GEL.Element.register("BODY", GEL.Element.Document);
GEL.MetaElement= GEL.Element.Meta= GEL.Element.MetaElement=
(function(){ 
	var _NIDX= 0;
 	return function(elementArray){ 
		var 
			_superC= GEL.MetaElement.superclass.constructor,
			_superOn
		;
		_superC.apply(this, arguments); 
		this.superon= this.on; 
		var _a= elementArray, i=0;
		this.id= "__metagelement_" + _NIDX++; 
		this.gelements= new Array();
		this.setAttacher();
		if(_a instanceof Array){
			for(;i<_a.length;i++){
				this.addElement(_a[i]); 
			}
		}
	}
})()
/*
 * Class: GEL.MetaElement
 */
GEL.extend(GEL.MetaElement, GEL.event.Publisher, { 
	on: function(type,fn){ 
		type= type.toLowerCase(); 
		if(this['is'+type]){ 
			return fn.call(this, type);
		}
		return GEL.event.Publisher.prototype.on.apply(this,arguments);
	},

	/*
	 * Function: get
	 * Gets the GELement at the specified index in the meta element.
	 * 
	 * Parameters:
	 * 		i - The index of the GELement to retrieve.
	 * 
	 * Returns:
	 * 		The GELement at index i.
	 */
	get: function(i){ 
		if(typeof i != 'number') return null; 	
		else if (i<0 || i>= this.gelements.length) return null;
		else return this.gelements[i]; 
	},
	/*
	 * Function: get
	 * Gets the GELement at the specified index in the meta element.
	 * 
	 * Parameters:
	 * 		mapFn - callback function executed with each element set to this
	 * 
	 * Returns:
	 * 		true	
	 */

	each: function(mapFn){ 
		if(typeof mapFn != 'function') return false; 
		var _gel= null; 
		for(var i=0;i<this.gelements.length;i++) {
			_gel= this.gelements[i]; 
			//mapFn.call(_gel); 
			_gel.each(mapFn); 
		}
		return true; 
	},
	/*
	 * Function: addElement
	 * Adds an element to the meta element. Will not add if element has been added already.
	 * 
	 * Parameters:
	 * 		gel - The new GELement.
	 * 
	 * See Also:
	 * 		<addElements>
	 */
	addElement: function(gel){ 
		if(
			!(gel instanceof GEL.Element.Base) 
			&& !(gel instanceof GEL.MetaElement) 
			&& !('attach' in gel) 
		) gel= GEL.ement(gel); 
		var _idx= this.elementExists(gel); 
		if(_idx >= 0) return _idx; 
		_idx= this.gelements.push(gel); 
		_idx--; 
		this.fire("elementAdded", this, 
			new GEL.event.MetaElement.elementAdded(this, gel, _idx)
		); 
		this.attacher.addElement(gel);
		return _idx; 
	},
	/*
	 * Function: addElements
	 * Adds an array of elements to the meta element.
	 * 
	 * Parameters:
	 * 		a - An array of GELements to add.
	 * 
	 * See Also:
	 * 		<addElement>
	 */
	addElements: function(a){ 
		if(!(a instanceof Array))return; 
		for(var i=0;i<a.length;i++)
			this.addElement(a[i]); 
		return this.gelements.length-1; 
	},
	/*
	 * Function: elementExists
	 * Checks to see if an element is already contained in the meta element.
	 * 
	 * Parameters:
	 * 		gel - The element to check
	 * 
	 * Returns:
	 * 		Boolean value.
	 */
	elementExists: function(gel){ 
	// If it is not a GELement, and it is a DOM object 
		if( 
			!(gel instanceof GEL.Element.Base)
			&& !(gel instanceof GEL.MetaElement)
			&& gel.nodeName 
		){ gel= GEL.ement(gel); } 
		var i=0,_a=this.gelements; 
		for(;i<_a.length;i++) 
			if(_a[i]==gel) return i; 
		return -1; 
	},
	/*
	 * Function: removeElement
	 * Removes an element from the meta element.
	 * 
	 * Parameters:
	 * 		gel - The GELement to be removed.
	 */
	removeElement: function(gel){ 
		var i=0,_a=this.gelements; 
		for (;i<_a.length;i++) {
			if(_a[i]==gel) {
				_a.splice(i,1)
				this.fire("elementRemoved", this, 
					new GEL.event.MetaElement.elementRemoved(
						this, gel, i
					)
				); 
				break; 
			}
		}
		return; 
	},
	/*
	 * Function: getElement
	 * Gets an element either by index or object reference.
	 * 
	 * Parameters:
	 * 		gel - Either the object index or the object itself.
	 * 
	 * Returns:
	 * 		The corresponding object in the meta element.
	 */
	getElement: function(gel){ 
		var _t= typeof gel, 
			_return; 	
		switch(_t){ 

			case "number":
				if(gel < this.gelements.length && gel >= 0) 
					_return= this.gelements[gel];
				else 	
					_return= null; 
				break; 
			case "object": 
				_return= this.getElement(
					this.elementExists(gel)
				); 
				break; 
			case "default": 
				_return= this.elements[0]; 
		}
		return _return; 
	},
	
	/*
	 * Function: setAnimator
	 * Sets an animator for all elements in the meta element.
	 * 
	 * Parameters:
	 * 		animator - The animator to set.
	 */
	setAnimator: function(animator){ 
		var 
			i=0, 
			_a= 	this.gelements,
			_g;
		if(typeof animator!='function') 
			animator= animator.constructor; 	
		for(;i<_a.length;i++) { 
			_g=_a[i];
			_g.setAnimator( 
				new animator(_g)
			); 
		}
	},
	
	/*
	 * Function: setAttacher
	 * Sets an attacher for the meta element.
	 * 
	 * Parameters:
	 * 		type - 'sync' for a synchronized attacher
	 */
	setAttacher: function(type){
		if (typeof type == 'object'){
			this.attacher= type; 
			return this; 
		}
		if(typeof type == 'string') type= type.toLowerCase(); 
		if(type=='sync') 
			this.attacher= new GEL.Element.Attacher.MetaAttacher.Synchronized(); 
		else if (type == 'inline') 
			this.attacher= new GEL.Element.Attacher.MetaAttacher.Inline(); 
		else 
			this.attacher= new GEL.Element.Attacher.MetaAttacher(); 
		this.each((function(_self){ 
			return function () { 
				_self.attacher.addElement(this);
			}
		})(this)); 
	},
	write: function(){ 
		this.each( function(){ this.write() ; } ); 
		return this; 
	},
	/*
	 * Function: size
	 * Returns the number of GELements in the meta element.
	 * 
	 * Returns:
	 * 		gelements.length - The number of GELements in the meta element array.
	 */
	size: function() { return this.gelements.length; }, 
	/*
	 * Function: attach
	 * Attaches each GELement in the meta element.
	 */
	attach: function(){ 
		var 
			_self=this; 
		this.attacher.on("ready", 
			function(t){
				this.unsubscribe(t, arguments.callee); 
				_self.isready= true;
				_self.fire("ready", _self)
			}
		); 
		this.fire("beforeAttach",this);
		this.attacher.attach(); 
	},
	childIndex: function(gel){ 
		
	}
});
GEL.event.MetaElement= {}; 
GEL.event.MetaElement.elementAdded= function(meta, gelement, idx){ 
	this.meta= meta; 
	this.newGelement= gelement; 
	this.newIndex= idx; 
	this.newSize= this.meta.size(); 
	return this; 
}
GEL.event.MetaElement.elementRemoved= function(meta, gelement, idx){ 
	this.meta= meta; 
	this.removedGelement= gelement; 
	this.removedIndex= idx; 
	this.newSize= this.meta.size(); 
	return this; 
}



GEL.Element.Attacher= function(){ 
	var _superC= GEL.Element.Attacher.superclass.constructor; 
	_superC.call(this); 
}
/* 
 * Class: GEL.Element.Attacher
 */
GEL.extend(GEL.Element.Attacher, GEL.event.Publisher, { 
	/*
	 * Function: attach
	 * Attaches a GELement to the DOM.
	 * 
	 * Parameters:
	 * 		gelement - The GELement to attach.
	 * 
	 * Returns:
	 * 		The attached element.
	 */
	attach: function(gelement) { 
		return this.attachNodeToDOM(gelement, gelement.attachToElement); 
	},
	attachNodeToDOM: function(){ 
		throw new Error("I am an abstract method and must be implemented by subclasses"); 
	},
	/*
	 * Function: addElement
	 */
	addElement: function(el){ 
		this.gelement= el; 
	}
}); 
/*
 * Class: GEL.Element.Attacher.Writer
 */
GEL.Element.Attacher.Writer= function(){ 
	var _superC= GEL.Element.Attacher.Writer.superclass.constructor;
	_superC.apply(this,arguments); 
}
GEL.extend(GEL.Element.Attacher.Writer, GEL.Element.Attacher, {
	/*
	 * Function: attachNodeToDOM
	 * Attaches a GELement to the DOM.
	 * 
	 * Parameters:
	 * 		gelement - The GELement to attach.
	 */
	attachNodeToDOM: function(gelement){ 
	/* 
		This is to deal with delayed src insertion which breaks
	   onload event triggering in WebKit.  We are not really 
	   concerned with onload events when we use a Writer to attach, 
	   primarily because we do not get them in Gecko. 

	   If we need to, we can take advantage of Gecko's insertion order
	   execution preservation and have the onload event trigger
	   via attaching another script immediately after this one. 
	*/
		if(gelement.isattach){
			return gelement.element; 
		}
		if('setSource' in gelement ){
			gelement.setSource(null,true);
		}
		var 
			_html= gelement.asHTML()
		; 
		document.writeln(_html); 
		/* Reset our attacher back to its default; this is a one-shot deal */
		gelement.setAttacher(); 
		return document.getElementById(gelement.id); 
	}
}); 
/*
 * Class: GEL.Element.Attacher.DOM
 */
GEL.Element.Attacher.DOM=  function(){ 
	var _superC= GEL.Element.Attacher.DOM.superclass.constructor;
	_superC.apply(this,arguments); 
}
GEL.extend(GEL.Element.Attacher.DOM, GEL.Element.Attacher, { 
	/*
	 * Function: attachNodeToDOM
	 */
	attachNodeToDOM: (function(){ 
		var _h= document.getElementsByTagName("HEAD")[0]; 
		return function(gelement, parentNode){ 
			var parentNode= parentNode || _h,
				_el= gelement.getElement(); 
			parentNode.appendChild(_el); 
			parentNode.appendChild(document.createTextNode("\n")); 
			return _el; 
		}
	})()
});
GEL.Element.Attacher.DOM.InsertBefore= function(){ 
	var _superC= GEL.Element.Attacher.DOM.InsertBefore.superclass.constructor; 
	_superC.apply(this,arguments); 
}
GEL.extend(GEL.Element.Attacher.DOM.InsertBefore, GEL.Element.Attacher, { 
	attachNodeToDOM: function(g,p){ 
		var _parent= null,  
			_e= g.getElement(),
			_p= p instanceof GEL.Element.Base ? 
				p.getElement() : p
		;
		_parent= _p.parentNode; 
		_parent.insertBefore(_e, _p); 
		return _e; 
	}
}); 
GEL.Element.Attacher.DOM.InsertAfter= function(){ 
	var _superC= GEL.Element.Attacher.DOM.InsertAfter.superclass.constructor; 
	_superC.apply(this,arguments); 
}
GEL.extend(GEL.Element.Attacher.DOM.InsertAfter, GEL.Element.Attacher, { 
	attachNodeToDOM: function(g,p){ 
		var 
			_e= g.getElement(),
			_p= p instanceof GEL.Element.Base ? 
				p.getElement() : p, 
			_tNode= document.createTextNode("")
		;
		/* We need to append a text node so we can transition to our ready state */
		if(_p.nextSibling) {
			_p.parentNode.insertBefore(_e, _p.nextSibling); 
			_p.parentNode.insertBefore(_tNode, _e); 
		}else {
			_p.parentNode.appendChild(_e); 
			_p.parentNode.appendChild(_tNode); 
		}
		return _e; 
	}
});
(function(){ 
	var _A= { 
		dom: GEL.Element.Attacher.DOM, 
		inline: GEL.Element.Attacher.Writer,
		_default: GEL.Element.Attacher.DOM
	}; 
	GEL.Element.Attacher.get= function(type,el){ 
		var _c= type in _A ? 
			_A[type]  : _A['_default'];
		if(typeof _c =='string'){ 
			try { _c= eval(_c); }
			catch(e){ throw e; }
		}
		return new _c(el); 
	}
})(); 
/*
 * Class: GEL.Element.Attacher.MetaAttacher
 */
 (function(){
 var _readyCalls= 0; 
GEL.Element.Attacher.MetaAttacher= function(){ 
	var _superC= GEL.Element.Attacher.MetaAttacher.superclass.constructor,
		_self= this, 
		_waiting= new Object(),
		_keys= GEL.objectUtil.keys,
		_needload= true, 
		_pending= new Array()
	; 
	_superC.apply(this, arguments); 
	this.elements= new Array(); 
	this.type= 'asynchronous';
	this.getQueueSize= function(){ 
		return { 
			needload: (_keys(_waiting)).length, 
			pending: _pending.length
		}
	}
	/*
	 * Function: attach
	 * Attaches the GELements contained in the meta element.
	 */

	this.attach= function(){ 
		var 
			i=0,
			_a= this.elements, 
			_torun= [], 
			_gel= null  
		; 
		if(!_needload) return; 
		while((_gel= _pending.shift())){ 
			_torun.push(_gel); 
			_gel.on("ready", elementReadyHandler); 
			_gel.on("error", elementReadyHandler); 
		}
		for(var i=0;i<_torun.length;i++) 
			_torun[i].attach(); 
		_needload= false; 
		if( (_keys(_waiting)).length <= 0) {
			this.isready= true; 
			this.fire("ready", this); 
		}
		return this; 
	}
	var _calls= 0; 
	function elementReadyHandler(t){ 
		this.unsubscribe('ready', arguments.callee); 
		this.unsubscribe('error', arguments.callee); 
		delete _waiting[this.id]; 
		if( (_keys(_waiting)).length <=0 ){ 
			_self.fire("ready", _self); 
			_self.isready= true; 
		}else if(_pending.length > 0 && _needload ){
			_self.attach();
		}
	}
	/*
	 * Function: addElement
	 * 
	 * Parameters:
	 * 		el - The element to add.
	 */
	this.addElement= function(el){ 
		this.elements.push(el); 
		_pending.push(el); 
		_waiting[el.id]= el; 
		this.isready= false; 
		_needload= true; 
	}
} 
GEL.extend(GEL.Element.Attacher.MetaAttacher, GEL.event.Publisher); 
})(); 
/*
 * Class: GEL.Element.Attacher.MetaAttacher.Synchronized
 */
GEL.Element.Attacher.MetaAttacher.Synchronized= (function(){ 
/* TODO: 
*  At some point Gecko browsers can be handled as a unique case. 
*    Since Gecko guarantees script execution in the order of attachment, 
*    we do not need to have a concept of synchronized script attachment
*    This, however, does not work correctly when there are MetaElements
*    within the MetaElement
*/
/*if(GEL.env.ua.gecko) { return GEL.Element.Attacher.MetaAttacher; }*/
var _C= function(){ 
	var 
		_superC= 
			GEL.Element.Attacher.MetaAttacher.Synchronized.superclass.constructor
		,_pending= new Array()
		,_running= false 
		,_self= this
	;
	_superC.apply(this, arguments); 
	this.elements= new Array(); 
	this.type= 'synchronous';
	this.getQueueSize= function(){ 
		return { 
			pending: _pending.length,
			running: _running
		}
	}
	/*
	 * Function: attach
	 * Attaches a list of elements in order.
	 * 
	 */
	this.attach= function(){ 
		if(_running) return; 
		if(_pending.length <=0)
			return _self.finishHandler(); 
		var _gel= _pending.shift();
		_running= true; 
		_gel.on("ready", elementReadyHandler); 
		_gel.on("error", elementReadyHandler); 
		_gel.attach();
	}
	function elementReadyHandler(t){
		this.unsubscribe('error',arguments.callee);
		this.unsubscribe('ready',arguments.callee);
		_running= false; 
		if(_pending.length <= 0) {
			return _self.finishHandler();
		}else{
			return _self.attach(); 
		}
	}

	this.finishHandler= function(){ 
		this.isready= true; 
		return this.fire("ready", this); 
	}
	this.addElement= function(el){ 
		this.elements.push(el);
		_pending.push(el); 
		this.isready= false; 
	}
}
GEL.extend(_C, GEL.event.Publisher); 
return _C; 
})();

GEL.Element.Attacher.MetaAttacher.Inline= (function(){ 
	var 
	  _KEYS= GEL.objectUtil.keys, 
	  _W= window,
	  _GLOBAL_ID= 1, 
	  _C= function(metaElement){
		var 
			_waiting= {}, 
			_self= this,
			_elements= []
		; 
		this.attach= function(){ 
			var _gel= null; 
			for(var i=0;i<_elements.length;i++) { 
				_gel= _elements[i]; 	
				addEvents(_gel); 
				_gel.setAttacher("inline"); 
				_gel.attach(); 
				if(GEL.env.ua.gecko){
					_gel.stateManager.stateTransitionHandler(); 
					continue; 
				}else { 
					while(!_gel.isready)
						_gel.stateManager.stateTransitionHandler(); 
				}
			}
			if(!GEL.env.ua.gecko)return; 
			var 
				_el= GEL.ement("SCRIPT", {}),
				_myid= "element_"  + _GLOBAL_ID++
			; 
			GEL.ElementLoader= GEL.ElementLoader || {};
			GEL.ElementLoader[_myid]= _elements;
			GEL.ElementLoader[_myid].readify= function(){
				for(var i=0,l=this.length;i<l; i++){
					while(!this[i].isready)
						this[i].stateManager.stateTransitionHandler(); 
				}
			}
			_el.setScriptText("GEL.ElementLoader." + _myid + ".readify();"); 
			_el.attach(); 
		}
		this.addElement= function(el){ 
			_elements.push(el); 
			_waiting[el.id]= true; 
			this.isready= false; 
		}
		function addEvents(gel){ 
			gel.on("ready", readyHandler); 
			gel.on("error", readyHandler); 
		}
		function readyHandler(type){ 
			var _id= this.id; 
			delete _waiting[this.id]; 
			if((_KEYS(_waiting)).length > 0) return;  
			_self.isready= true; 
			_self.fire("ready", _self); 
		}
	}
GEL.extend(_C, GEL.event.Publisher); 
return _C;
})(); 
/*
 * Section: GEL Namespaces
 */
(function(){ 
/* Get ourselves */
var _CORE_PATH= GEL.env.gelpath= (function(){ 
	var 
		_sMap= document.getElementsByTagName("SCRIPT"),
		_path= "core/core", 
		_gelCore= _sMap[_sMap.length - 1], 
		_src= _gelCore.src, 
		_pathIndex= _src.indexOf(_path), 
		_base= _src.slice(0,_pathIndex), 
		_qsvIdx= _src.indexOf("?"), 
		_qsv= _qsvIdx >= 0 ? _src.substr(_qsvIdx+1) : "",
		_o= {},
		_protoIndex= _base.indexOf("://")
	;
	if(_pathIndex < 0 ) { /* removed underscore here */
		_o.path= "/gel/lib"; 
		_o.qsv= _qsv; 
		return _o;  
	} 
	_o= ( _protoIndex < 0 ) ? 
	(function(){ 
		var _b= _base; 
		if(_b.charAt(_b.length - 1) === '/') 
			_b= _b.slice(0, _b.length - 1); 
		return { 
			hostname: window.location.host, 
			basepath: _b, 
			qsv: _qsv, 
			proto: window.location.protocol
		};
	})() : 
	(function(){ 
			var 
				_t= _base.slice(
					_base.indexOf("//") + 2, 
					_base.length - 1
				), 
				_idx= _t.indexOf("/"), 
				_host= _t.slice(0, (_idx > 0 ? _t.indexOf("/") : _t.length - 1)),
				_b= _base.slice(_base.indexOf(_host) + _host.length), 
				_p= _base.slice(0, _base.indexOf("://") + 1)
			; 
			if(_b.charAt(_b.length - 1) === '/') _b= _b.slice(0, _b.length - 1); 
			return { 
				proto: _p,  
				hostname: _host, 
				qsv: _qsv, 
				basepath: _b
			};
	})(); 
	_o.path= _o.proto + '//' + _o.hostname + _o.basepath; 
return _o; 	
})(); 	

	/*
	 * Variable: GELNS
	 * Holds registered GEL Namespaces.
	 */
var GELNS = { 
	'scriptbase': _CORE_PATH.path || "/gel/lib", 
	'skinbase': '/gel/skins', 
	'namespaces': {
		'skin.Palette91': { 
			name: 'gel-skin-go4', 
			type: 'skin', 
			path: 'palette91/palette91.css'
		},
		'skin.YUISkinSam': { 
			name: 'yui-skin-sam', 
			type: 'skin', 
			path: "http://yui.yahooapis.com/2.7.0/build/logger/assets/skins/sam/logger.css"
		},
		"legacy.GDN": { 
			path: "legacy/GDN/GDN.js", 
			type: "script",
			requires: ["util.Cookie"]
		},
		'legacy.SiteLife': { 
			path: 'legacy/GMTISiteLife.js', 
			type: 'script', 
			requires: ["util.Cookie", "com.Pluck", "util.Selector"]
		},
		'org.flowplayer.hfCustomJqueryTools': { //ADDED
			name: 'org.flowplayer.hfCustomJqueryTools', 
			path: 'http://i.usatoday.net/_common/_scripts/gel/lib/3rdparty/jquery/jquery.tools.125.overlay.custom-apple.expose.min.js', 
			type: 'script',
			requires: ['org.jQuery1-4-2']
		},
		'org.Prototype': { 
			name: 'org.Prototype', 
			path: '3rdparty/prototype/prototype-1.6.1.js', 
			type: 'script'
		},
		'org.JSON': { 
			name: 'GDN.org.JSON', 
			path: '3rdparty/json/json.js', 
			type: 'script'
		}, 
		'org.PorkIframe': { 
			name: 'GDN.org.PorkIframe', 
			path: '3rdparty/porkiframe/pork.iframe.js', 
			type: 'script'
		}, 
		'org.jQuery': { 
			name: 'GDN.org.jQuery', 
			path: '3rdparty/jquery/jquery-1.3.2.js', 
			type: 'script'
		},
		'org.jQuery1-4-2': { //ADDED
			name: 'org.jQuery1-4-2', 
			path: 'http://i.usatoday.net/_common/_scripts/gel/lib/3rdparty/jquery/jquery-1.4.2-min.js', 
			type: 'script'
		},
		'org.jQuery1-6-1': { //ADDED
			name: 'GDN.org.jQuery', 
			path: 'http://i.usatoday.net/_common/_scripts/gel/lib/3rdparty/jquery/jquery-1.6.1.js', 
			type: 'script'
		},
		'com.Pluck': { 
			name: 'GDN.com.Pluck', 
			path: 'vendor/pluck/pluck.js', 
			type: 'script', 
			requires: ['org.PorkIframe','org.YUI.json']
		},
		'com.usatoday.hfVideoModal': {  //ADDED
			name: 'com.usatoday.hfVideoModal', 
			path: 'http://i.usatoday.net/_common/_scripts/gel/lib/video/hf.video.modal.js', 
			type: 'script', 
			depends: ['widget.Video.BrightcoveAPIModules', 'org.jQuery1-4-2', 'org.flowplayer.hfCustomJqueryTools']
		},
		'anim.YUIAnimator':{ 
			path: 'anim/yuianimator.js', 
			type: 'script', 
			requires: ['util.Selector']
		},
		'org.YUI.logger':{ 
			path: '3rdparty/yui/logger-min.js', 
			depends: ['org.YUI', 'org.YUI.domevent'], 
			type: 'script'
		},
		'org.YUI' : { 
			path: '3rdparty/yui/yahoo-min.js', 
			type: 'script'
		},
		'org.YUI.json': { 
			path: '3rdparty/yui/json-min.js', 
			type: 'script', 
			requires: [], 
			depends: ['org.YUI'] 
		}, 
		'org.YUI.domevent':{ 
			path: '3rdparty/yui/yahoo-dom-event.js', 
			requires: [ 'org.YUI'], 
			type: 'script'
		},
		'org.YUI.animation': { 
			path: '3rdparty/yui/animation-min.js', 
			type: 'script', 
			requires: ['org.YUI.domevent']
		},
		'org.YUI.selector': { 
			path: '3rdparty/yui/selector-min.js', 
			depends: ['org.YUI'],
			type: 'script'
		},
		'widget.GELTabs': { 
			path: "widgets/tabs/geltabs.js", 
			requires: ['util.Selector'], 
			depends: [ 'widget'], 
			type: 'script'
		},
		'widget': { 
			path: "widgets/widget.js", 
			requires: [], 
			depends: [], 
			type: 'script'
		},
		'widget.Conveyor': { 
			path: "widgets/conveyor/conveyor.js", 
			type: 'script', 
			depends: ['widget.GELTabs']
		},
		'widget.Console': {
			path: "widgets/console/console.js", 
			skin: "skin.YUISkinSam",
			type: "script",
			requires: ['org.YUI.logger']
		},
		'widget.AdBanner': { 
			path: "widgets/banner/banner.js", 
			requires: ['remoting', 'util.Cookie', 'util.Selector'], 
			type: 'script'
		}, 
		'util.Selector': { 
			name: "util.Selector", 
			path: "selector/selector.js",
			type: "script"
		},
		'remoting': { 
			name: "remoting", 
			path: "remoting/remoting.js", 
			requires: [], 
			type: 'script'
		},
		'widget.Menu': { 
			name: "widget.Menu",
			path: "widgets/menu/menu.js", 
			requires: ['util.Selector'], 
			type: "script"
		},
		'widget.Video': { 
			path: "video/video.js", 
			requires: ['remoting', 'widget.AdBanner'], 
			type: "script"
		}, 
		'widget.Video.BrightcoveAPIModules': { 
			name: 'widget.Video.BrightcoveAPIModules', //ADDED
			path: "http://admin.brightcove.com/js/APIModules_all.js", 
			requires: ["http://admin.brightcove.com/js/BrightcoveExperiences.js"], 
			type: "script"
		},
		'widget.Video.gReactions': { 
			path: "video/GReactions.js", 
			requires: [], 
			type: "script"
		},
		"util.Cookie": { 
			path: "cookie/cookie.js", 
			type: "script"
		},
		"util.Flash": {
			path: "flashutil/flashutil.js", 
			type: "script"
		},
		'analytics': { 
			name: "analytics", 
			type: "script", 
			path: "analytics/analytics.js",
			requires: ["util.Cookie", "remoting"]
		},
		"widget.ArticleTools": { 
			name: "widget.ArticleTools", 
			type: "script", 
			path: "widgets/articletools/articletools.js",
			depends: ["widget"], 
			requires: ["util.Selector"]
		},
		'custom': { 
			path: "/scripts/custom/custom.js", 
			requires: [], 
			depends: ["widget"], 
			type: 'script'
		}

	}
}; 
/*
 * Function: GEL.register
 * Registers an an object in a namespace.
 * 
 *  Parameters:
 *  	namespace - An identifier for the namespace.
 *  	o - An object containing data on the namespace's path, requirements, dependencies, skin, and type.
 */
GEL.register= function(namespace,o) { 
	var _path= o.path ||null, 
		_reqs= o.requires|| new Array(), 
		_deps= o.depends || new Array(), 
		_skin= o.skin || null, 
		_base= o.base || null, 
		_type= o.type || 'script'; 
	if(!_path) throw new Error("You must provide a path to your namespace"); 
	if(_type =='script') return registerScript()
	else return registerSkin(); 

	function registerScript(){ 
		var _obj= GELNS.namespaces,
		    _o= {  
			path: _path, 
			requires: _reqs, 
			depends: _deps, 
			name: namespace,
			type: 'script',
			skin: _skin
		}; 
		if(typeof _base != 'undefined' && _base ) 
			_o.base= _base; 
		_obj[namespace]= _o; 
		return _o; 
	}
	/*
	 * Function: registerSkin
	 * Part of <GEL.register>. Registers a skin object.
	 * 
	 * Returns: 
	 * 		An skin object in the namespace.
	 * 
	 */
	function registerSkin(){ 
		var _obj= GELNS.namespaces, 
		    _o= { 
			path: _path,
			type: 'skin',
			name: namespace
		};
		_obj[namespace]= _o; 
		return _o; 
	}
}
	/*
	 * Function: getPath 
	 * 
	 * Parameters: 
	 * 		ns - The namespace to calculate the path for.
	 * 
	 * Returns: 
	 * 		The path of the namespace.
	 */
	function getPath(ns){ 
		if(typeof ns=='string')return ns; 
		if(ns.base==='relative') return ns.path; 
		var 
			_proto= window.location.protocol
			,_GP= GEL.env.gelpath
			,_GQ= _GP.qsv 
			,_b= ns.type =='skin' ? 
				GELNS.skinbase : 
			 	_GP.path	
			,_path= ""
		;
		if(
			ns.path.toLowerCase().indexOf('http://') == 0 || 
			ns.path.indexOf('/') ==0 
		){ 
			_path= ns.path; 
		}else { 
			if(
				_b.indexOf('/') == 0 
				|| _b.indexOf('://') >= 0 
			){
				_path= _b + '/' + ns.path; 
			}else{
				_path= _proto + '://' + _b; 
			}
		}
		return _GQ ? _path + '?' + _GQ : _path; 
	}

	function getAssocNamespaces(nsobj, incType){ 
			if(typeof nsobj != 'object' 
				|| nsobj.length<=0
				|| !(incType in nsobj)
			) return null; 

			var 
				_i= 0, _libns= null, 
				_libgel= null, 
				_libnsList= nsobj[incType],
				_metagel= new GEL.MetaElement(); 
			for(;_i <_libnsList.length;_i++) { 
				_libns= _libnsList[_i]; 
				_libgel= GEL.util.importer.require(_libns); 
				_metagel.addElement(_libgel); 
			}
			return _metagel; 
	}
	/*
	 * Namespace: GEL.util.importer
	 */
GEL.util.importer= {
	register: GEL.register,
	require: function(namespace, o){ 
		o= o || new Object(); 
		var 
			_ons= null,  
			_gelement= null; 

		if(typeof namespace == 'undefined' || !namespace)
			throw new Error("You must require() a namespace"); 
		if(!(namespace in GELNS.namespaces)){
			var 
				_hIdx= namespace.indexOf("http://"), 
				_sIdx= namespace.indexOf("/"); 
			if(_hIdx != 0 && _sIdx  != 0){
				throw new Error(
				"Cannot find namespace \"" + namespace + 
				"\", perhaps you need to register it? "
				); 
			}
			_hIdx= _sIdx= null; 
			_ons= { path: namespace, type: 'script' };
		}else{
			_ons= GELNS.namespaces[namespace]; 
		}
		var _id= '__gel_ns' + _ons.type + '_'  + namespace;
		var _gelement= GEL.cachemgr.get(_id); 
		if(_ons.type ==='skin'){  
			return _gelement ? _gelement : 
				new GEL.Element("LINK", { 
					href: getPath(_ons), 
					rel: "stylesheet", 
					id: _id 
				}); 
		}
		var 
			_meta= new GEL.MetaElement(), 
			_gelement=  _gelement ? _gelement :  
				GEL.Element("SCRIPT", { 
					src:  getPath(_ons), 
					id:  _id
				}), 
			_depmeta= getAssocNamespaces(_ons, 'depends'), 
			_reqmeta= getAssocNamespaces(_ons, 'requires'); 
			_skin=null;
		if(typeof _ons.skin == 'string'){  
			var _skin= GEL.util.importer.require(_ons.skin); 
			_meta.addElement(_skin); 
		}
		if(
			_reqmeta instanceof GEL.MetaElement 
			&&_reqmeta.size() > 0 	
		) {
			_meta.addElement(_reqmeta); 
		}

		if(
			typeof _depmeta== 'object'
			&& _depmeta instanceof GEL.MetaElement 
			&& _depmeta.size() > 0 	
		) {
			var _synchronizedEl= new GEL.MetaElement([ 
				_depmeta, _gelement
			]); 
			_synchronizedEl.setAttacher("sync"); 
			_meta.addElement(_synchronizedEl); 
		}else{ 
			_meta.addElement(_gelement); 
		}
		_gelement._namespace= namespace; 
		_meta.id= _meta._namespace= namespace +':metawrap'; 
		return _meta;
	}

}
/* 
 * Function: GEL.use
 *  Import a list of namepsaces and execute callback function when complete
 *
 *     Shortcut for the following, except it accepts multiple namespaces 
 *	      var _metaElement= 
 *			GEL.util.importer.
 *				require(namespace).
 *				on("ready", callback).
 *				attach();
 * 
 * Parameters:
 * 		namespace - Array of or single GEL namespace to import
 *		callback - Callback function to execute when complete 
 * 
 * Returns:
 * 	 	The GEL MetaElement created 
 */

GEL.use= (function(){ 
	var _imp= GEL.util.importer; 
	return function(namespace,callback){ 
		var 
			ns= namespace, cb= callback,
			_mEl= new GEL.MetaElement(),
			_nsEl
		;
		if(!(ns instanceof Array)) ns= [ns]; 
		var _mEl= new GEL.MetaElement(); 
		for(var i=0;i<ns.length;i++){ 
			try{_nsEl= _imp.require(ns[i]);}
			catch(e){
				GEL.log(
					"ERROR: GEL.use(): Exception obtaining namespace \"" + 
					ns[i]+"\" \n" + e.message
				);
				continue; 
			};
			_mEl.addElement(_nsEl); 
		}
		if(typeof cb == 'function') 
			_mEl.on("ready", cb);  
		_mEl.attach(); 
		return _mEl;
	}
})();  

/*
 * Function: GEL.util.importer.getnamespace
 * 
 * Parameters:
 * 		name - The identifier of the requested namespace.
 * 
 * Returns:
 * 		The GEL Namespace associated with the given identifier.
 */
GEL.util.importer.getnamespace= function(name){ 
	if(name in GELNS.namespaces) return GELNS.namespaces[name]; 
	else return null; 
}
/*
 * Function: GEL.util.importer.addRequires
 * Adds a requirement to the namespace. Calls <addDep>.
 * 
 * Parameters:
 * 		ns - The namespace to add the requirement to.
 * 		req - The namespace of the requirement.
 */
GEL.util.importer.addRequires= GEL.util.importer.addRequirement= 
	function(ns, req){ return addDep('requires', ns, req);  }
/*
 * Function: GEL.util.importer.addDepends
 * Adds a dependency to the namespace. Calls <addDep>.
 * 
 * Parameters:
 * 		ns - The namespace to add the dependency to.
 * 		req - The namespace of the dependency.
 */
GEL.util.importer.addDepends= GEL.util.importer.addDependency= 
	function(ns, req){ return addDep('depends', ns, req);}
/*
 * Function: addDep 
 * Adds a requirement or dependency to the namespace
 * 
 * Parameters: 
 * 		type - 'requires' or 'depends'. 
 * 		ns - The namespace to add the requirement or dependency.
 *  	req - The requirement or dependency.
 */
function addDep(type, ns, req) { 
	if(typeof ns =='string' && !(ns=GEL.util.importer.getnamespace(ns)))
		throw new Error("Cannot add Requirement to namespace that does not exist"); 
	if(typeof req == 'string' && !(req in GELNS.namespaces) )
		GEL.register(req, { path: req, type: 'script' });
	ns[type]= ns[type] || new Array(); 
	ns[type].push(req); 

}
})();


(function(){ 
var _A= ['attach','installTransitionDetector', 'registerDOMEvent', 'unregisterDOMEvent']; 
var _C= GEL.Element.StateManager= function(gelement){ 
	var _superC= _C.superclass.constructor; 
	_superC.call(this); 
	this.gelement= gelement; 
	if(!this.gelement) return null; 
}
/*
 * Class: GEL.Element.StateManager
 */
GEL.extend(GEL.Element.StateManager, GEL.event.Publisher, { 
	/* 
	 * Function: begin
	 * Initializes the state manager.
	 */
	begin: function() { 
		this.installTransitionDetector(); 
	},
	/*
	 * Function: stateTransitionHandler
	 * Prompts a transition event to a new state.
	 * 
	 * Parameters:
	 * 		newReadyState - The new state.
	 */
	stateTransitionHandler: function(newReadyState){ 
		this.fire(
			"loadstatetransition", this, 
			{
				oldstate: this.type, 
				newstate: newReadyState, 
				gelement: this.gelement
			}
		); 
	}
}); 
for (var i=0;i<_A.length;i++) { 
	var _m= _A[i];
	_C.prototype[_m]= (function(method){ 
		return function(){ 
			throw new Error('GEL.Element.StateManager.' + method + 
				'() is abstract ' +
				'and must be implemented'
			); 
		}
	})(_m); 
}
})();
// Transition detector for elements that are not yet in the DOM 
// This wil detect when the objects move to the Attached state
(function(){ 
	/*
	 * Class: _C
	 */
var _C= GEL.Element.StateManager.PreAttach= function(){
	var _superC= GEL.Element.StateManager.PreAttach.superclass.constructor;
	_superC.apply(this, arguments);
}
GEL.extend(_C, GEL.Element.StateManager, { 
	type: 'preattach',
	/*
	 * Function: attach
	 * Attaches a GELement and handles the state transition.
	 */
	attach: function(){ 
		var _el= this.gelement.attacher.attach(this.gelement); 
		if(_el) 
			this.stateTransitionHandler(_el); 
		else { 
			GEL.log(
				'got no element for ' + 
				this.gelement.id + 
				', installing local transition detector'
			); 
		 	_C.prototype.installTransitionDetector.apply(this);  	
		}
	},
	/*
	 * Function: registerDOMEvent
	 * Registers a DOM event listener for a specified type
	 * 
	 * Parameters:
	 * 		type - The type of DOM event listener.
	 * 
	 * Returns:
	 * 		Boolean value. False if the listener is already registered, true if the operation completes successfully.
	 */ 
	registerDOMEvent: function(type){ 
		var _l= this.gelement.domEvents; 
		if(type in _l) 
			return false; 
		_l[type]= true; 
		return true; 
	},
	/*
	 * Function: unregisterDOMEvent
	 * Unreachable.
	 */ 
	unregisterDOMEvent: function(type){ 
		var _l= this.gelement.domEvents; 
		if(type in _l) 
			return delete _l[type]; 
		else 
			return false; 
	},
	/*
	 * Function: installTransitionDetector
	 * Detects state transitions for the GELement.
	 */ 
	installTransitionDetector: function(){
		var _id= this.gelement.id,
		    _self= this,
		    _el= null, 
		    _d= document, 
		    _finderFn= function(){ 
			var _ret= _d.getElementById(_id);
			return typeof _ret == 'object' ? 
				_ret : false; 
		    },
		    _foundFn= function(element){ 
			_self.stateTransitionHandler(element); 
		    }
		if( (_el= _finderFn()) ) { _foundFn(_el); } 
		else {this.trackid= GEL.tracker.add(_finderFn, _foundFn);}
	}, 
	/*
	 * Function: stateTransitionHandler
	 * 
	 */ 
	stateTransitionHandler: function(element){ 
		GEL.tracker.remove(this.trackid); 
		var 
			_gel= this.gelement, 
			_el
		; 

		_el= typeof _gel != 'undefined' ? 
			_gel.getElement() : null; 
		if(typeof element != 'undefined' && element && _el !== element )
			this.gelement.setElement(element); 
		var _super= GEL.Element.StateManager.PreAttach.superclass;
		_super.stateTransitionHandler.call(this, 'attach'); 
	}
});
})();

// This is for anonymous DOM elements 
// Since we will attach these ourselves, we do not need 
// to detect its attachment transition 
/*
 * Class: GEL.Element.StateManager.PreAttach.Null
 */ 
GEL.Element.StateManager.PreAttach.Null = function(){
	var _superC= GEL.Element.StateManager.PreAttach.Null.superclass.constructor;
	_superC.apply(this, arguments); 
}
GEL.extend(GEL.Element.StateManager.PreAttach.Null, GEL.Element.StateManager.PreAttach, { 
	/*
	 * Function: installTransitionDetector
	 * Null function.
	 */
	installTransitionDetector: function(){ 
		return; 
	}
}); 
GEL.Element.StateManager.PreAttach.ImmediateTransition= function(){
	var _superC= GEL.Element.StateManager.PreAttach.ImmediateTransition.superclass.constructor;
	_superC.apply(this, arguments); 
}
GEL.extend(
	GEL.Element.StateManager.PreAttach.ImmediateTransition, 
	GEL.Element.StateManager.PreAttach, 
	{ 
		installTransitionDetector: function(){ 
			return this.stateTransitionHandler(); 
		}
	}
); 

// Transition state manager for elements in the DOM but not yet ready 
// or loaded.  Will detect and transition to ready or error state 
/*
 * Class: _C
 */
(function(){
var _C= GEL.Element.StateManager.Attached= function(){ 
	var _superC= GEL.Element.StateManager.Attached.superclass.constructor;
	_superC.apply(this, arguments); 
} 
GEL.extend(_C, GEL.Element.StateManager, { 

	type: 'attach',
	/*
	 * Function: attach
	 * Null Function.
	 */
	attach: function(){ 
		//return; 
		var 	
			_el= this.gelement.getElement(),
			_a= this.gelement.attachToElement
		; 
		_a= _a instanceof GEL.Element.Base ? _a.getElement() : _a; 
		if(_el.parentNode === _a) return; 
		this.gelement.attacher.attach(this.gelement); 
	},
	/*
	 * Function: unregisterDOMEvent
	 * Unregisters a DOM Event Listener.
	 * 
	 * Parameters: 
	 * 		type - The DOM Event Listener type to unregister.
	 */
	unregisterDOMEvent: function(type){ 
		var 
			_gel= this.gelement,
			_l= _gel.domEvents; 
		if(!(type in _l)) 
			return false; 
		var fn= _l[type];
		_gel.detachEventListener(type, fn); 
		return fn; 
	},
	/*
	 * Function: registerDOMEvent
	 * Registers a DOM event listener for a specified type
	 * 
	 * Parameters:
	 * 		type - The type of DOM event listener.
	 * 
	 * Returns:
	 * 		Boolean value. False if the listener is already registered, true if the operation completes successfully.
	 */ 
	registerDOMEvent: function(type){ 
		var _l= 
			this.gelement.domEvents,
			_el= this.gelement.getElement()
		; 
		if(type in _l) 
			return false; 
		var fn= this.gelement.getDOMEventHandler(type); 
		_l[type]= fn; 
		this.gelement.attachEventListener(type, fn);  
		return true; 
	},
	/*
	 * Function: installTransitionDetector
	 * Detects state transitions for the GELement.
	 */
	installTransitionDetector: function(){ 
		var _self= this, 
		     _foundFn= function(){ _self.stateTransitionHandler('ready'); },
		     _gel= this.gelement,
		     _el= _gel.element
		  ; 
		var _finderFn= function(){ 
		    	var _el= _gel.element; 
			if(_el.readyState && 
				(_el.readyState == 'loaded' ||
				_el.readyState == 'complete' )
			) { return _el; }
			if(_el.nextSibling) { return _el; }
			else { 
				return false; 
			}
		};
		if( _finderFn()) _foundFn(); 
		else this.trackid= GEL.tracker.add(_finderFn, _foundFn); 
	},
	stateTransitionHandler: function(newState){ 
		GEL.tracker.remove(this.trackid); 
		var _super= GEL.Element.StateManager.Attached.superclass; 
		_super.stateTransitionHandler.call(this, 'ready'); 
	}
}); 
GEL.Element.StateManager.Attached.Null= function(){ 
	var _superC= GEL.Element.StateManager.Ready.superclass.constructor,
		_super= GEL.Element.StateManager.Ready.superclass; 
	_superC.apply(this, arguments); 
}
GEL.extend(GEL.Element.StateManager.Attached.Null, GEL.Element.StateManager.Attached, { 

	installTransitionDetector: function() { 
		this.stateTransitionHandler('ready'); 
	}
}); 
})();
(function(){ 
var _C= GEL.Element.StateManager.Ready= function(){ 
	var _superC= GEL.Element.StateManager.Ready.superclass.constructor,
		_super= GEL.Element.StateManager.Ready.superclass; 
	_superC.apply(this, arguments); 
} 
GEL.extend(_C, GEL.Element.StateManager.Attached, { 
	type: 'ready', 
	installTransitionDetector: function(){ },
	stateTransitionHandler: function(){ }
}); 
})(); 
(function(){ 
var _C= GEL.Element.StateManager.Error= function(){ 
	var _superC= GEL.Element.StateManager.Error.superclass.constructor,
		_super= GEL.Element.StateManager.Error.superclass; 
	_superC.apply(this, arguments); 
} 
GEL.extend(_C, GEL.Element.StateManager.Attached, { 
	type: 'error', 
	installTransitionDetector: function(){ },
	registerDOMEvent: function(){ 
		GEL.log("ERROR: This element is in an error state"); 
	},
	stateTransitionHandler: function(){ } 
}); 
})(); 
/*
 * Class: GEL.Element.StateManager.PreAttach.Document
 */
GEL.Element.StateManager.PreAttach.Document= function(){ 
	var _superC= GEL.Element.StateManager.PreAttach.Document.superclass.constructor; 
	_superC.apply(this, arguments); 
}
GEL.extend(GEL.Element.StateManager.PreAttach.Document, GEL.Element.StateManager.PreAttach, { 
	installTransitionDetector: (function(){ 
		var _D= document; 
		function findFn(){ 
			var _ret= 	
				!!(
					'body' in _D && 	
					_D.body && 
					'nodeType' in _D.body.firstChild
				);
			return _ret; 
		} 
	return function(){ 
		var _self= this; 
		if(!findFn())
		this.trackid= GEL.tracker.add(
			findFn, 
			function(){ _self.stateTransitionHandler(); }
		); 
		else 
			return this.stateTransitionHandler(); 
	}})()
}); 
/*
 * Class: GEL.Element.StateManager.Attached.Document
 */
GEL.Element.StateManager.Attached.Document= (function(){ 
var 
	_D= document, 
	_W= window,
	_G= GEL, 
	_UA= GEL.env.ua,
	_aeFn= _G.elementUtil.attachEventListener, 
	_isReady= false, 
	_loadEvent= null, 
	_deFn= _G.elementUtil.detachEventListener
;

return function(){ 
	var 
		_superC= GEL.Element.StateManager.
			Attached.Document.
			superclass.constructor,
		_self= this
	; 
	_superC.apply(this,arguments); 
	this.installTransitionDetector= (function(){ 
		var _isloaded= false; 
		return function(){ 
			if(_isReady){
				GEL.tracker.remove(_self.trackid); 
				_self.stateTransitionHandler(); 
				_self.gelement.overrideLoadHandlers(); 
			}
			else if(!_isloaded){
				_isloaded= true; 
				_self.trackid= 
					GEL.tracker.add(
						arguments.callee, 
						new Function()
					);
			}
			return _isReady; 
		} 
	})();
	init(); 

	function init(){ 
		var 
			_G= GEL, _D= document, _W= window,
			_isIE= GEL.env.ua.ie,
			_domObjects= [_D, _W],
			_owEvents= _self.gelement.loadEvents, 
			_keysFn= _G.objectUtil.keys, 
			_copyFn= _G.objectUtil.copy, 
			_attachFn= _G.elementUtil.attachEventListener, 
			_detachFn= _G.elementUtil.detachEventListener,
			_readyHandler= function(domObject, eventType){ 
				return function(event){
					if(eventType == 'readystatechange' && 
						domObject.readyState != 'complete' && 
						domObject.readyState != 'loaded'
					) return;
				_detachFn(domObject, eventType, arguments.callee); 
					_isReady= true; 
					if(!("readyState" in domObject))
						domObject.readyState="complete"; 
					_owEvents[eventType][domObject]= _isIE ? 
						_copyFn(event) : event; 
				}
			}
		;
		for(var event in _owEvents){ 
			if(!_owEvents[event]) continue; 
			for ( 
				var a= _owEvents[event], i=0, l= a.length, o= a[i]; 
				i<l;
				o= a[++i]
			){ 
				_attachFn(o, event, _readyHandler(o, event)); 
			}
		}
		if ( typeof _D.readyState != 'undefined' && _D.readyState === "complete" ) {
			_isReady= true; 
		}else if (_UA.ie){ 
			if (_D.documentElement.doScroll && _W== _W.top ){
				var _fn=function(){
					if(_isReady)return _isReady;
					try { _D.documentElement.doScroll("left"); }
					catch(e){return false;} 
					_isReady= true; 
					return _isReady; 
				};
				if(!_fn()) 
 					var _trackId= GEL.tracker.add(_fn, new Function()); 
			}
		}
	   }
	}
})()
GEL.extend(GEL.Element.StateManager.Attached.Document, GEL.Element.StateManager.Attached); 
/*
 * Class: GEL.Element.StateManager.Attached.Remote
 */
GEL.Element.StateManager.Attached.Remote= (function(){ 
	var 
		_AEFN= GEL.elementUtil.attachEventListener, 
		_DEFN= GEL.elementUtil.detachEventListener 
	;
return function(){ 
	var _superC= 
		GEL.Element.StateManager.Attached.Remote.superclass.constructor; 
	_superC.apply(this,arguments); 
	var 
		_nodeType= this.gelement.tagName().toLowerCase(), 
		_gel= this.gelement, 
		_element= _gel.getElement(),
		_uasucks= GEL.env.ua.webkit,
		_self= this
	;
	if(_uasucks) 
		init(); 
	this.installTransitionDetector= install; 
	function init(){ 
		addEvents(_element);
	}
	function loadHandler(e){ 
		var 
			_el= _gel.getElement()
		; 
		if(!_el){ 
			if(_element) { 
				removeEvents(_element); 
			}
			return; 
		}else if(
			_el.readyState && 
			_el.readyState != 'complete' && 
			_el.readyState != 'loaded' 
		) {
			return; 
		}
		removeEvents(_gel.getElement()); 
		_self.stateTransitionHandler('ready'); 
	}
	function errorHandler(e){ 
		removeEvents(_gel.getElement()); 
		_self.fire(
		"loadstatetransition", _self, 
			{
			oldstate: _self.type, 
			newstate: 'error', 
			element: _self.gelement.element, 
			gelement: _self.gelement
			}
		); 
	}
	function removeEvents(element){ 
		var _event= element.readyState ? /*(GEL.env.ua.ie ||GEL.env.ua.opera) ? */
			"readystatechange" : "load";
		_DEFN(element,"error", errorHandler); 
		_DEFN(element,_event, loadHandler); 
	}
	function addEvents(element){ 
		var _event= (GEL.env.ua.ie ||GEL.env.ua.opera) ? 
			"readystatechange" : "load";
		_AEFN(element,"error", errorHandler); 
		_AEFN(element,_event, loadHandler); 
	}

	function install(){ 
		var 
			_n= this.gelement.tagName(),
			_el= this.gelement.getElement()
		;
		if(!_uasucks) 
			addEvents(_el); 
		else if(_element !== _el) 
			removeEvents(_element); 
		_element= _el;
		if(_el.readyState) loadHandler(); 
		if(
			_n.toUpperCase() =='LINK' && 
			(_uasucks||GEL.env.ua.gecko) 
		){
			 return this.stateTransitionHandler('ready');
		}
	}
}
})(); 
GEL.extend(GEL.Element.StateManager.Attached.Remote, GEL.Element.StateManager.Attached); 
(function(){ 
GEL.Element.StateManagerFactory= function(gelement){ 
	this.gelement= gelement; 
	this.managers= {}; 
	if(typeof this.transitionMap!='undefined') return; 
	this.transitionMap= { 
		ready: GEL.Element.StateManager.Ready, 
		error: GEL.Element.StateManager.Error, 
		preattach: GEL.Element.StateManager.PreAttach, 
		attach: GEL.Element.StateManager.Attached
	};
}
GEL.Element.StateManagerFactory.prototype= { 
	createStateManager: function(stateType){ 
		if( !(stateType in this.transitionMap) ) 
			throw new Error("Cannot transition to state of type " + stateType); 
		else if (stateType in this.managers)
			return this.managers[stateType]; 
		else {  
			throw new Error("did you reinstall a transition map for " + stateType + "?"); 
			return new this.transitionMap[stateType](this.gelement); 
		}
	},
	makeManagers: function(){ 
		var _stateMgr; 
		for(var t in this.transitionMap){ 
			try { _stateMgr= new this.transitionMap[t](this.gelement) }
			catch(e){ 
				GEL.log("ERROR: Unable to create statemanager for type " + t); 
				continue; 
			};
			this.managers[t]= _stateMgr; 
		}
		return this; 
	}
}
GEL.Element.StateManagerFactory.NullPreAttach= function(){ 
	var _superC= GEL.Element.StateManagerFactory.NullPreAttach.superclass.constructor,
		_super= GEL.Element.StateManagerFactory.NullPreAttach.superclass; 
	_superC.apply(this,arguments); 
	this.transitionMap.preattach= GEL.Element.StateManager.PreAttach.Null; 
	this.name='NullPreAttach'; 
}
GEL.extend(GEL.Element.StateManagerFactory.NullPreAttach, GEL.Element.StateManagerFactory ); 
GEL.Element.StateManagerFactory.Remote= function(){ 
	var _superC= GEL.Element.StateManagerFactory.Remote.superclass.constructor,
		_super= GEL.Element.StateManagerFactory.Remote.superclass; 
	_superC.apply(this,arguments); 
	var _l= this.gelement.isLocal(); 
	this.transitionMap.attach=  
		(_l && _super.transitionMap && 'attach' in _super.transitionMap )  
			? _super.transitionMap.attach : 
			GEL.Element.StateManager.Attached.Remote
	this.name= 'Remote'; 
} 
GEL.extend( GEL.Element.StateManagerFactory.Remote, GEL.Element.StateManagerFactory); 

GEL.Element.StateManagerFactory.Document= function(){ 
	var _superC= GEL.Element.StateManagerFactory.Document.superclass.constructor,
		_super= GEL.Element.StateManagerFactory.Document.superclass; 
	_superC.apply(this,arguments); 
	this.transitionMap.preattach=  
		GEL.Element.StateManager.PreAttach.Document; 
	this.transitionMap.attach= 
		GEL.Element.StateManager.Attached.Document;
	this.name= 'Document'; 

} 
GEL.extend( GEL.Element.StateManagerFactory.Document, GEL.Element.StateManagerFactory); 

})();


// This is a simple animator that can show, hide, toggle and slide 
// using simple class manipulation 
/*
 * Class: GEL.anim.SimpleAnimator
 */
GEL.namespace('anim'); 
/*
 * Function: GEL.anim.SimpleAnimator
 * Constructor for the simple animator.
 * 
 * Parameters:
 * 		gelement - The GELement to animate.
 * 		options - Animation options.
 */
GEL.anim.SimpleAnimator= function(gelement, options){ 
	var _superC= GEL.anim.SimpleAnimator.superclass.constructor; 
	_superC.call(this); 
	this.gelement= gelement; 	
	this.options= options|| new Object(); 
	this.HIDE_CLASS= this.hideClass= 'hideclass' in this.options ? this.options['hideclass'] : 'gel-hidden'; 
}
GEL.extend(GEL.anim.SimpleAnimator, GEL.event.Publisher, { 
		/*
		 * Function: isVisible
		 * Gets the visiblity of the GELement.
		 * 
		 * Returns: 
		 * 		Boolean visiblity value of the GELement.
		 */
	isVisible: function(){ 
		if (this.gelement.hasClassName(this.HIDE_CLASS)) 
			return false; 
		else 
			return true; 
	},
	/*
	 * Function: show
	 * Shows the GELement
	 */
	show: function(){ 
		this.gelement.removeClassName(this.HIDE_CLASS); 
		this.fire("animationComplete", this); 
	},
	/*
	 * Function: hide
	 * Hides the GELement
	 */
	hide: function(){ 
		this.gelement.addClassName(this.HIDE_CLASS); 
		this.fire("animationComplete", this); 
	},
	/*
	 * Function: toggle
	 * Shows the element if hidden, hides if shown.
	 */
	toggle: function(){ 
		if(this.gelement.hasClassName(this.HIDE_CLASS)) this.show(); 
		else this.hide(); 
	}
});
(function(){ 
var _G= new Object(); 
GEL.cachemanager= GEL.cachemgr= {}; 
GEL.cachemgr.get= function(element){ 
	var _t= typeof element; 
	switch(_t) { 
		case "string": 
			return element in _G ? _G[element] : null; 
		case "object": 
			return ('id' in element && element.id )? 
				GEL.cachemgr.get(element.id) : 
				null; 
		case "default": 
			return null; 

	}
}
GEL.cachemgr.__CACHE= _G;
GEL.addGELement= function(gelement){
	if(gelement.id in _G) return; 
	_G[gelement.id]= gelement; 
}
GEL.rmGELement= function(gelement){
	if(typeof gelement === 'string') 
		return delete _G[gelement]; 
	else if(gelement.id in _G) 
		delete _G[gelement.id];  
}
GEL.thepage= new GEL.Element.Document(document)
GEL.thepage.on("ready", function(){ 
	GEL.Element.Base.prototype.attachToElement= document.body;  
}); 

GEL.thepage.on("unload", function(){
	var _gel; 
	for (var gelid in _G) { 
		_gel= _G[gelid]; 
		try { 
			_gel.purgeElement();
		}
		catch(e){ GEL.log("failed to purge element " + _gel.id ); }
		try { 
			GEL.rmGELement(gelid); 
		}
		catch(e){ GEL.log("failed to remove element " + _gel.id ); }
		_gel= null; 
	}
})
})(); 
GEL.namespace('env.url');
GEL.env.url.qsv= (function(str){ 
	var 	
		_args= str.split('&'),
		_ret= {}, 
		_t; 
	for(var i=0;i<_args.length;i++){ 
		if(!_args[i]) continue; 
		_t= _args[i].split('='); 
		_ret[_t[0]]= _t[1] ? _t[1] : true; 
	}
	return _ret; 
})(window.location.search.substr(1)); 
GEL.env.domain= (function(){
	var 
		_h= window.location.hostname, 
		_a= _h.split(".")
	;
	return _a.slice(_a.length-2).join("."); 
})(); 

GEL.thepage.initializer= (function(){ 
/*
 * Object: GEL.thepage.initializer
 */
var 
	_init= new GEL.MetaElement(),
	_cfg= '',
	_TIMEOUT= 0
;  
/*_init.setAttacher('sync');*/
_init.initRoutines= []; 
_init.init= _init.initialize= _init.load= init; 
_init.add= _init.addInitRoutine= addInitRoutine; 
return _init; 
/*
 * Function: GEL.thepage.initializer.addInitRoutine.
 * Queues up a callback routine to be run during initialization of the page 
 * 
 * Parameters:
 * 		options - Initialization object 
 *			name - name of the callback routine 
 * 				e.g. "banners"
 *
 *			namespace - Array or String of namespaces to import 
 *				e.g. "widget.GELTabs" __OR__ 
 *					[ "remoting", "widget.GELTabs", "anim.YUIAnimator"]
 *
 *			callback - Callback function to run when namespaces are ready.
 *				The callback function will execute with "this" set to 
 *				the meta element for the callbacks priority.  This allows 
 *				the callback function to add libraries, etc. to the tier. 
 *				e.g. function(){ 
 *					var _newNamespaceLibrary= GEL.util.importer("newNamespace"); 
 *					_newNamespaceLibrary.on("ready", completeInitialization); 
 *					this.addElement(_newNamespaceLibrary); 
 *				     }
 *				
 *			priority - The priority of this routine, 
 *				groups of 10 will be initialized syncrhonously	
 *				e.g. priority 22 and 23 will load at the same time.  callbacks will
 *				be executed when complete.   priority 31 will not run until 
 *				__both__ 22 and 23 have finished 
 *			
 */

function addInitRoutine(options){
	options= options || {}; 
	var 
		_ns= options.namespace, 
		_cb= options.callback, 
		_name= options.name,
		_pr= ('priority' in options && typeof options.priority=='number') ? 
			options.priority : 100, 
		_init
	;
	if(typeof _cb != 'function') 
		throw new Error(
			"Error creating callback for " + _name + ":" + 
			"callback argument must be function reference"
		); 
	if(typeof _name != 'string') 
		throw new Error("name argument must be present"); 
	_init= { 
		name: _name, 
		priority: _pr, 
		namespace: _ns, 
		callback: _cb
	}; 
	this.initRoutines.push(_init); 
}
/*
 * Function: GEL.thepage.initializer.initialize
 *  	Used to trigger page initialization.  A single call to this function should be 
 *	either embedded within a script block on the page itself or triggered by registering 
 *	for thepage ready event.  Since it is page-specific, the latter is __NOT__ done by GEL.
 *	e.g. 
 *		GEL.thepage.on("ready", function(){ GEL.thepage.initializer.initialize() }); 
 *	NOTE: GEL.thepage.onReady fires only after all content within the page has loaded.  Typically  
 *	the initRoutines can (and should) be fired prior to this occurring. 	
 *
 * Parameters: None
 * 	
 */
function init(){ 
	var 
		_initList= this.initRoutines.sort(sorter),
		_self= this, 
		_queueList= [], _tier= [], 
		_routine, _prio, _name= '',
		_tier, _libGelement, _ns, 
		_lastTier,  
		_timer= 0, 
		_runningTiers= 0, 
		_lastPriority= -1
	; 
	for(var i=0;i<_initList.length;i++){ 
		_routine= _initList[i]; 
		_prio= parseInt(_routine.priority / 10, 10); 
		if(_prio != _lastPriority){
			_tier= []; 
			_queueList.push(_tier); 
			_lastPriority= _prio; 
		}
		_tier.push(_routine); 	
	}
	_self.addInitRoutine= _self.add= function(object){ 
		var 
			_namespaces= object.namespace, 
			_cb= object.callback
		; 
		GEL.use(_namespaces, _cb); 
	}
	_self.on("ready",tierFinishHandler)
	doNext();
	function doNext(){ 
		if(_queueList.length <= 0){
			_self.fire("complete", _self); 
			GEL.thepage.timerList.display();
			return; 
		}
		var _m= loadTier(_queueList.shift()); 
		_self.addElement(_m); 
		_TIMEOUT= getTimeout(); 
		if(_TIMEOUT > 0) {
			_timer= setTimeout(tierTimeoutHandler, _TIMEOUT); 
		}
		_self.attach(); 
	}
	function tierTimeoutHandler(){ 
		doNext(); 
	}
	function tierFinishHandler(){ 
		clearTimeout(_timer); 
		if(_queueList.length <= 0){
			_self.unsubscribe(arguments[0],arguments.callee); 
		}
		doNext(); 
	}
	function loadTier(routineList){ 
		var 
			_r=null,
			_lib,
			_m= new GEL.MetaElement(),
			_config= GEL.config.init, 
			_t= null,
			_tList= [],
			_cbFn, _name= ''; 
		_m.on("preAttach", function(){
			for(var i=0;i<_tList.length;i++) 
				_tList[i].start(); 
		}); 
		for(var i=0;i<routineList.length;i++){ 
			_r= routineList[i];
			_name= _r.name; 
			if(_name in _config && !_config[_name]) continue; 
			else if(!(_name in _config) && !(_config._default)) continue; 
			_t= new GEL.util.benchmark.Timer(_r.priority + ':' + _name+"(lib)").start();
			_tList.push(_t); 
			GEL.thepage.timerList.addTimer(_t); 
			_lib= getNSEl(_r.namespace); 
			_lib.on("ready", getCallback(_r.callback, _m, _name,_t)); 
			_m.addElement(_lib); 
		}
		return _m; 
	}
	function getCallback(cbFn, metaEl, name, timer){
		return function(e){ 
			timer.end();
			this.unsubscribe(e, arguments.callee); 
			if(typeof cbFn != 'function')
				return; 
			var _t= new GEL.util.benchmark.Timer(name).start(); 
			try { 
				cbFn.apply(metaEl, arguments);
			}
			catch(e){ 
				var _msg= "ERROR running callback for " + name;
				GEL.log(_msg); 
				GEL.logEx(e); 	
			}; 
			setTimeout((function(myTimer){ 
				return function(){ 
					myTimer.end(); 
					GEL.thepage.timerList.addTimer(myTimer); 
					GEL.thepage.timerList.display(); 
				}
			})(_t), 10); 
		}
	}
}
function sorter(a,b){ 
	return a.priority <= b.priority ?  -11 : 1; 
}
function getTimeout(){ 
	var _r= _TIMEOUT; 
	if(!('tierTimeout' in GEL.config)) 
		return _r; 
	_r= parseInt(GEL.config.tierTimeout,10);
	if(_r < 1000) _r = _r * 1000; 
	return _r; 

}

function getNSEl(ns){ 
	var _ret= new GEL.MetaElement(), _lib; 
	if(ns instanceof Array){ 
		for(var i=0;i<ns.length;i++){ 
			try { _lib= GEL.util.importer.require(ns[i]) }
			catch(e){ GEL.log("Cannot find namespace: " + e.message); continue; }; 
			_ret.addElement(
				_lib
			);
		}
	}else { 
		try{ _lib= GEL.util.importer.require(ns); }
		catch(e){ return _ret; } 
		_ret.addElement(_lib); 
	}
	return _ret; 
}

})(); 
(function(){ 
function initNullTimer(){
	GEL.namespace("util.benchmark"); 
	GEL.util.benchmark.Timer= GEL.util.benchmark.TimerList= function(){}
	var 
		_D= "start,stop,end,addTimer,getTimer,display".split(","),
		_FN= function(){return this;},
		_M= "getStop,getStart,getEnd".split(","),
		_MFN= function(){ return new Function(); } 
	;
	for(var i=0;i<_D.length;i++)
		GEL.util.benchmark.Timer.prototype[_D[i]]= 
			GEL.util.benchmark.TimerList.prototype[_D[i]]=
				_FN;
	for(var i=0;i<_M.length;i++) 
		GEL.util.benchmark.Timer.prototype[_M[i]]= 
			GEL.util.benchmark.TimerList.prototype[_M[i]]=
				_MFN; 
	GEL.thepage.timerList= new GEL.util.benchmark.TimerList(); 
}
var _ns= null; 
if(GEL.config.init.timers){
	GEL.register("benchmark",{name:"benchmark",type:"script",path:"benchmark/benchmark.js" }); 
	_ns= GEL.util.importer.require("benchmark");
	_ns.setAttacher("inline"); 
	_ns.attach(); 
}else
	initNullTimer(); 

if(GEL.config.init.debug){
	GEL.thepage.on("attach", function(){
		GEL.use("widget.Console", function(){
			new GEL.widget.Console();
		});
	});
}else
	GEL.widget.Console= new Function(); 
})(); 
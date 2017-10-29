if(typeof GEL == 'undefined' || !GEL)  GEL={util: {},env:{}};
/*
   Base 64 encoding/decoding class.
   
   Remarks:
   ----------------------------------------------------------------------------
   This provides a class that implements methods for Base 64 encoding/decoding.
   This class is static and does not require an instance of an object to call it.
*/
(function(){ 
Base64 =
{
    key: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    decode: function(value)
    {
    	var 
		value= value || this, 
        	keyStr = Base64.key,
        	output = "",
        	chr1, chr2, chr3 = "",
        	enc1, enc2, enc3, enc4 = "",
		i=0;
	;
        value = value.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        /* do*/
	while (i < value.length)
        {
            enc1 = keyStr.indexOf(value.charAt(i++));
            enc2 = keyStr.indexOf(value.charAt(i++));
            enc3 = keyStr.indexOf(value.charAt(i++));
            enc4 = keyStr.indexOf(value.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64)
                output = output + String.fromCharCode(chr2);

            if (enc4 != 64)
                output = output + String.fromCharCode(chr3);

            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";
        } 
        return output;
    },
    /* Base 64 encodes the specified value. */
    encode : function(value)
    {
    	value= value || this; 
        var keyStr = Base64.key;
        var output = new String();
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;
        do
        {
            chr1 = value.charCodeAt(i++);
            chr2 = value.charCodeAt(i++);
            chr3 = value.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2))
                enc3 = enc4 = 64;
            else if (isNaN(chr3))
                enc4 = 64;

            output = output + 
            keyStr.charAt(enc1) + 
            keyStr.charAt(enc2) + 
            keyStr.charAt(enc3) + 
            keyStr.charAt(enc4);
             
            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";
        } while (i < value.length);
        return output;
    }
};

String.prototype.base64encode= Base64.encode; 
String.prototype.base64decode= Base64.decode; 

GEL.namespace("util.Base64");
String.prototype.base64encode= 
	GEL.util.Base64.encode= 
		Base64.encode; 
String.prototype.base64decode= 
	GEL.util.Base64.decode= 
		Base64.decode; 

})();
	
GEL.util.Cookie= function(name,value,options) {

	var 
		_rawValue= value,
		_o= this.options= 
			options || new Object(),
	    	_self= this
	;
	if(typeof GEL.env.cookies != 'undefined' && GEL.env.cookies.exists(name) ) 
		return GEL.env.cookies.get(name); 
	this.name= name;  
	parseOptions(); 
	function parseOptions(){ 
		_self.isencoded= 'isencoded' in _o ? 
			_o.isencoded : null; 
		_self.isescaped= 'isescaped' in _o ? 
			_o.isescaped : null; 
		_self.expires= 'expires' in _o ? 
			_o.expires : null; 
		if(_self.expires && typeof _self.expires == 'object') 
			_self.expires= _self.expires.toGMTString(); 
		_self.maxage= 'maxage' in _o ? 
			_o['max-age'] : null; 
		_self.path= 'path' in _o ? _o.path : '/'; 
		_self.domain= 'domain' in _o ?
			_o.domain : null; 
	}
	this.getRawValue= function(){ 
		return _rawValue; 
	}
	this.setRawValue= function(value){ 
		_rawValue= value; 
	}
	this.getValue= function(){ 
		var _ret= _rawValue; 
		if(this.isencoded) 
			_ret= _ret.base64decode();  
		if (this.isescaped)
			_ret= unescape(_ret);  
		return _ret; 
	}
	this.setValue= function(value){
		if(this.isencoded)
			value= value.base64encode(); 
		if(this.isescaped) 
			value= escape(value); 
		_rawValue= value; 
		return this.set(); 
	}
	function getParams(){ 
		var 	
			o= { }
		; 
		o[_self.name]= _rawValue;  
		if(_self.path) 
			o['path']= _self.path; 
		if(_self.domain)
			o['domain']= _self.domain; 
		if(_self.expires)
			o.expires= (_self.expires instanceof Date) ? 
					_self.expires.toGMTString() : _self.expires; 
		if(_self.maxage) 
			o['max-age'] = _self.maxage; 
		return o; 
	}
	this.set= function(){
		if(!this.name) return null; 
		var 
			_o= getParams(),
			_s= GEL.objectUtil.join(_o, "=",";")
		; 
		GEL.log("setting " + _s); 
		document.cookie= _s;  
		return this; 
	}
	this.remove= function(){ 
		var 
			_d= new Date(),
			_name= this.name
		;
		var _s= _name + "=";
		if(this.path) 
			_s += ';path=' + this.path; 
		if(this.domain) 
			_s += ";domain=" + this.domain; 
		_s += ';expires=' + _d.toGMTString(); 
		document.cookie= _s;  
		GEL.env.cookies.remove(this.name); 
		return this; 
	}
}
GEL.util.Cookie.prototype.toString= function(){ return this.value }
GEL.extend(GEL.util.Cookie, GEL.event.Publisher); 

GEL.util.MetaCookie= function(cookie, options) { 
	var _self= this, 
		_superC= GEL.util.MetaCookie.superclass.constructor; 	
	_superC.apply(this, arguments); 
	options= options || {}; 
	this.cookie= cookie;  
	this.delimiter= cookie.delimiter= 'delimiter' in options ? 
		options.delimiter : (this.delimiter || '&');
	this.format= 'format' in options ? options.format : 
		(this.format || ''); 
	this.keydelim = cookie.keydelim = 'keydelim' in options ? 
		options.keydelim : (this.keydelim || "=");
	this.ignoredelimiter= 'ignore' in options ? 
			options.ignore : (this.ignoredelimiter || null); 
	this.refresh= function(){ 
		this.values= read(); 
	}
	this.valmap= 'valmap' in options ? options.valmap : {}; 
	this.refresh(); 
	function read(){ 
		var 
			_o= new Object(), 
			c= (function(){ 
				var v= cookie.getValue(); 
				if(!_self.ignoredelimiter) 
					return v; 
				else 
					return v.substr(
						v.lastIndexOf(_self.ignoredelimiter)+1, 
						v.length
					);
			})(),
			pair= '', 
			_delim= _self.delimiter,
			_keydelim= _self.keydelim,
			pairs= new Array(), 
			i=0
		;
		pairs=c.split(_delim);
		for(;i<pairs.length;i++) {
			if(!pairs[i]) continue; 
			pair=pairs[i].split(_keydelim);
			if(!pair[0]) continue; 
			_o[pair[0]]= pair[1]; 
		}
		return _o; 
	}
}
GEL.extend(GEL.util.MetaCookie, GEL.event.Publisher,{ 
	setRawValue: function(value){ 
		this.cookie.setRawValue(value); 
		this.refresh(); 
		return this; 
	}, 
	getRawValue: function(){ 
		return this.cookie.getRawValue();
	}, 
	getValue: function(key){
		var _key= key in this.valmap ? 
			this.valmap [key] : key; 
		return _key == null ? 
			this.cookie.getValue() : 
			this.values[_key]; 
 	},
	deleteValue: function(key){ 
		var _key= key in this.valmap ? this.valmap[key] : key; 
		if(_key && _key in this.values) {
			delete this.values[_key]; 
			this.set(); 
		}
		return this; 
	},
	setValue: function (key,value){
		var _key= key in this.valmap ? this.valmap[key] : key; 
		this.values[_key]= value; 
		this.set(); 
		return this; 
	},
	set: function() { 
		var _v= GEL.objectUtil.join(
			this.values, this.keydelim, this.delimiter
		);
		if(this.expires) this.cookie.expires= this.expires; 
		this.cookie.setValue(_v); 
		return this; 
	},
	remove: function() { 
		this.cookie.remove(); 	
		return this; 
	}
});
GEL.env.cookies= (function(){ 
	var 
		_cookies= {}, 
		_self= {  
			refresh: readCookies, 
			get: getCookie, 
			getCookie: getCookie, 
			exists: exists, 
			replace: replace,
			remove: remove
		}; 
	GEL['cookies']= _cookies; 
	readCookies(); 
	return _self; 
	function getCookie(name){ 
		if(name in _cookies) { 
			return _cookies[name]; 	
		}else { 
			_cookies[name]= new GEL.util.Cookie(name, "");
			return _cookies[name]; 
		}
	}
	function exists(name){ 
		return name in _cookies; 
	}
	function replace(name, newcookie) {
		_cookies[name]= newcookie; 
		return _cookies[name];
	}
	function remove(name){ 
		delete _cookies[name]; 
	}
	function readCookies(){ 
		var 
			j={}, 
			s= document.cookie, 
			a, o, n, v,_c,_idx
		; 
		if(!s) return j; 
		var a=s.split(/;\s*/),_f= {}; 
		for(var i=0;i<a.length;i++){
			_idx= a[i].indexOf("="); 	
			n=a[i].slice(0,_idx);
			v=a[i].slice(_idx+1,a[i].length);
			_f[n]= true; 
			if(n in _cookies) 
				_c= _cookies[n]; 
			else{ 
				_c= new GEL.util.Cookie(n, v); 
				_cookies[n]= _c; 
			}
			_c.setRawValue(v); 
		}
		for (var n in _cookies) {
			if(!(n in _f))
				_cookies[n].setRawValue("");
		}
		return j; 
	}
})(); 

GEL.env.cookies.pluck= (function(){ 
	var _c= GEL.env.cookies.get("at");
	_c.isencoded= false; _c.isescaped= true; 
	_c.domain= "." + GEL.env.domain; 
	var _o= new GEL.util.MetaCookie(_c, 
		{ 
			delimiter: "&", 
			keydelim: "=", 
			domain: "." + GEL.env.domain,
			valmap: { 
				username: "a", 
				uid: "u",
				email: "e",
				gender: "g",
				info: "s",
				time: "t",
				logintime: "t",
				uid: "u",
				hash: "h"
			}
		}
	); 
	return GEL.env.cookies.replace("at", _o);  
})(); 
GEL.env.cookies.gcionsn= (function(){
	var 
		_c= GEL.env.cookies.get("GCIONSN")
	; 
	_c.isencoded= true; 
	_c.isescaped= false; 
	_c.domain= "." + GEL.env.domain; 
	var _o= new GEL.util.MetaCookie(_c,
		{ 
			delimiter: "~", keydelim: ":",
		  	valmap: { status: "sts", state: "sta" }
		}
	); 
	return GEL.env.cookies.replace("GCIONSN", _o);  
})(); 
GEL.env.cookies.gcionpn= (function(){
	var 
		_c= GEL.env.cookies.get("GCIONPN")
	; 
	_c.isencoded= true; 
	_c.isescaped= false; 
	var _o= new GEL.util.MetaCookie(_c,
		{ 
			delimiter: "~", keydelim: ":",
		  	valmap: { seg: "segments"}
		}
	); 
	_o.expires= new Date( 
		new Date().getTime() + 
		365 * 10 * 86400 * 1000 
	)
	return GEL.env.cookies.replace("GCIONPN", _o);  
})(); 

GEL.env.cookies.gcionid= (function(){
	var 
		_c= GEL.env.cookies.get("GCIONID"),
		_extraVals= []
	;
	_c.expires= new Date ( Number(new Date()) + (86400 * 1000 * 365)); 
	_c.isencoded= true;
	_c.isescaped= false;

	_c.domain= "." + GEL.env.domain; 
	var _o= new GEL.util.MetaCookie( _c, 
		{ 	
			delimiter: "|", keydelim: ":", 
			ignore: "~",
			domain: "." + GEL.env.domain, 
			valmap: { 
				email: "adr", 
				autologin: "aln", 
				avatar: "ava", 
				country: "cou", 
				gender: "gen", 
				lastname: "lnm", 
				state: "sta", 
				username: "usr",
				companysize: "siz",
				industry:  "ind",
				occupation: "job",
				sessions: "ses",
				site: "sit",
				hash: "hsh",
				logintime: "tim"
			} 
		}
	); 
	var _oRefresh= _o.refresh; 
	_o.refresh= function(){ 
		_oRefresh.call(_o); 
		var _v= _c.getValue(), _t,_a;
		_t= _v.slice(0,_v.lastIndexOf("~")); 
		_a= _t.split("~");
		_extraVals= _a; 
		_o.values.gcionid= _a[0]; 
		_o.values.version= _a[1]; 
		_o.values.datecreated= _a[2]; 
		_o.values.status= _a[3]; 
	}
	_o.set= function() { 
		var _v= _extraVals.join("~") + "~" +   
			GEL.objectUtil.join(
				this.values, this.keydelim, this.delimiter
			)
		;
		if(this.expires) this.cookie.expires= this.expires; 
		this.cookie.setValue(_v); 
		return this; 
	};

	_o.refresh(); 
	return GEL.env.cookies.replace("GCIONID", _o); 
})(); 
GEL.env.persistentcache= GEL.env.cookies.gcionpn;
GEL.env.sessioncache= GEL.env.cookies.gcionsn;
GEL.env.user= (function(){
	var 
		user =new GEL.event.Publisher(), 
		_year= (new Date()).getYear() + 1900, 
		_pCookie= GEL.env.cookies.pluck,  
		_gSNCookie= GEL.env.cookies.gcionsn, 
		_gIDCookie= GEL.env.cookies.gcionid,
		_VAL_MAP= {}
	; 
	_VAL_MAP= { 
		username: _pCookie,
		email: _pCookie,
		uid: _pCookie, 
		gender: function(){ 
			var _s= _gIDCookie.getValue("gender");
			if(!_s) return _s; 
			return _s == 2 ? 'male' : 'female'; 
		},
		zip: _gIDCookie,
		yob: _gIDCookie,
		autologin: _gIDCookie,
		state: _gIDCookie,
		country: _gIDCookie,
		loginstate: function(){ return _pCookie.getValue() }, 
		isloggedin: function() { return this.getValue("loginstate") ? true : false; }, 
		at: function() { return _pCookie.getValue() },
		uid: _pCookie,
		age: function(){ 
			var _y= this.getValue("yob") || 0; 
			return _y ? _year - _y : null;
		},		
		companysize: _gIDCookie,
		industry:  _gIDCookie,
		occupation: _gIDCookie,
		sessions: _gIDCookie,
		site: _gIDCookie,
		logintime: [_gIDCookie, _pCookie ],
		hash: [_gIDCookie, _pCookie ],
		loginduration: function(){ 
			var 
				_now= new Date(), 
				_offset= _now.getTimezoneOffset() * 60000, 
				_lt= new Date(_gIDCookie.getValue("tim") * 1000 + _offset), 
				_diff= _now.getTime() - _lt.getTime() 
			; 
			return parseInt(_diff / 1000); 
		},
		segments: GEL.env.persistentcache
	};
	user.init= function(){
		var _v, _k; 
		for (_k in _VAL_MAP) {
			_v= this.getValue(_k); 
			this[_k]= _v; 
		}
	}
	user.refresh= function(){ 
		GEL.env.cookies.refresh(); 
		_gIDCookie.refresh(); 
		_pCookie.refresh(); 
		_gSNCookie.refresh(); 
		this.init();
	}
	user.setValue =function (key,value){
		var 
			_currValue= this.getValue(key), 
			_chgEvent= { 
				attribute: key, 
				oldValue: _currValue, 
				newValue: value 
			}, 
			_c= key in _VAL_MAP ? _VAL_MAP[key] : _gIDCookie
		; 
		if(!(_c instanceof Array)) _c= [_c]; 
		for(var i=0,l=_c.length;i<l;i++)
			_c[i].setValue(key, value); 
		this.fire("attributechanged", this, _chgEvent); 
	};
	user.getValue= function(key){
		var _c= _gIDCookie; 
		if(key in _VAL_MAP){
			_c= _VAL_MAP[key];
			if(_c instanceof Array) 
				_c= _c[0]; 
		}
		if(typeof _c == 'function') 
			return _c.call(this); 
		else 
			return key ? _c.getValue(key) : _c.getValue(); 
	}

	user.onLogin= function(){ 
		this.refresh(); 
		this.fire("login", this); 
	}
	user.onLogout= function(){ 
		GEL.env.cookies.refresh(); 
		_gIDCookie.refresh(); 
		_pCookie.refresh(); 
		_gSNCookie.refresh(); 
		this.refresh();
		this.fire("logout", this); 
	}
	user.zagupdate= function(){ 
		GEL.env.cookies.refresh(); 
		_gIDCookie.refresh(); 	
		this.init(); 
	}

	user.init(); 
return user; 
})(); 

/* It ____KILLS____ me that we have to adapt into this silly 
   legacy interface; however, some ads made the mistake of 
   programming to this thing...c'est la Legacy User Auth (Piece of Sh*t!)
*/
(function(){ 
if(!(
	typeof window.GDN =='undefined' || 
	typeof window.GDN.Cookie == 'undefined'
)){
	return; 
}
var _g; 
if(typeof window['GDN'] == 'undefined') 
	_g= window['GDN']= {};
else 
	_g= window['GDN']; 

_g.Cookie= {
	Exists: function(n){ return GEL.env.cookies.exists(n) }
};
_g.Cookies= { 
	GCION: { 
		Name: "GCIONID", 
		Get: function(){ 
			return { 
				Yob: function(){ 
					return GEL.env.user.yob 
				}, 
				Gender: function() { 
					return GEL.env.user.gender 
				}, 
				Zip: function(){ 
					return GEL.env.user.zip
				}
			}
		}
	}
}; 
})(); 


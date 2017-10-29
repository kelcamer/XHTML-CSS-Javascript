(function(){ 
	
	var 
		_G= GEL, 
		_GC= _G.config, 
		_I= _G.thepage.initializer,
		_UA= _G.env.ua
	; 
	_G.Element.Script.prototype.attachToElement = document.body;
	if (typeof mjx_req != 'undefined'){
		_GC.AdPage = mjx_req;
	} else {
		_GC.AdPage = location.host;
	}
	_GC.AdServer = "gannett.gcion.com";
	_GC.AdNetworkId= 5111.1;
	_GC.PlacementId= 778079;
/*	
	_I.add( {
		name: "tabs", 
		priority: 5, 
		namespace: ["widget.GELTabs", "anim.YUIAnimator"], 
		callback: initTabs 
	});
	_I.add({ 
		name: "UAS", 
		priority: 100, 
		namespace: ["org.jQuery", "util.Cookie"], 
		callback: function(){
			jQuery(document).ready(function(){
				window.$= function(id) {return document.getElementById(id)};
				document.body.y= 0;
				usatAuth.setLogInOutPages('uslAvatarCruiseIn.htm', 'uslAvatarCruiseOut.htm');
				onresize= usatAuth.em.SetPosition; 
				usatAuth.initialSetup();
			})
		}
	});
*/
	_I.add({ 
		name: "renderQQ", 
		priority: 200, 
		/*namespace: ["org.jQuery"],*/ // causes GEL to load old version of jQuery
		callback: renderQQ 
	});
	_I.add ( {
		name: "banners", 
		priority: 250, 
		namespace: "widget.AdBanner", 
		callback: function(){ 
			var 
				_o= _G.namespace("config.loadBanners")
				,_bl= _G.thepage.bannerLocator
				,_metaElement= null
			;
			_bl.findBanners();
			_metaElement= _bl.loadBanners(
			/* 
			If this function returns true, the banner will be loaded and vice versa. 

			The GEL.config.loadBanners object (created on the page itself) has banner positions as keys
				and true or false as a value.  If a banner position is in 
				the loadBanners object and has a false value it will NOT 
				be loaded 
			*/
				function(){ 
					return this.config.adPosition in _o ? 
						_o[this.config.adPosition] : true; 
				}, 
				null, 
				false
			);
			 this.addElement(_metaElement); 
		}
	});
/*
	if(_UA.ie == 6) { 
		_I.add({ 
			name: "hoverfix", 
			priority: 1000, 
			callback: hoverFix, 
			namespace: "org.jQuery"
		});
	}	
	function initTabs(){ 
		var _TP= _G.thepage; 

		_TP.fullscrollTabs= new _G.widget.GELTabs("fullconveyor", { 
			metaAnimationClass: _G.anim.YUIAnimator.Scroller,  
			autoRotate: true,
			rotationInterval: 20
		});
		
		_TP.fullscrollTabs.init(); 	

		var _hiderList= _TP.foreach("a.hider", function(){ 
		var _g= _G.ement(this), _tabEl= (function(e){ 
				var _e= e.nextSibling; 
				while(_e && _e.nodeType != 1) 
					_e= _e.nextSibling
				return _G.ement(_e); 
			})(this);
			_g.on("click", function(t,e){ 
				e.preventDefault(); 
				_tabEl.toggle(); 
				if(_tabEl.isVisible()){ 
					_g.setHTML("Hide"); 
				}else {
					_g.setHTML("Show"); 
				}
			});
		});
	}
	function toggleCaption(){
		var captionLength = jQuery(".photo-caption-text").html().length;
		if(captionLength < 1)
			{jQuery(".photo-caption-toggle .caption").css({'visibility':'hidden'})}
		else 
		{
			jQuery(".photo-caption-toggle .caption").css({'visibility':'visible'});
			jQuery("#caption-toggle").toggle(
				function () {
					jQuery(".photo-caption").css({"visibility":"hidden"});
					jQuery("#caption-toggle.caption-toggle").css({"background-position":"0px -11px"});
				},
				function () {
					jQuery(".photo-caption").css({"visibility":"visible"});
					jQuery("#caption-toggle.caption-toggle").css({"background-position":"0px -25px"});
				}		
			);
			jQuery("#caption-toggle").click();
		}
	}
*/	
	function renderQQ() {
		if (typeof qqDisplay != 'undefined'){
			switch (qqDisplay){
				case 'default':
				qqOffset = 100;
				qqItemHeight = 46;
				break;
				case 'va':
				qqOffset = 85;
				qqItemHeight = 36;
				break;
				case 'front':
				qqOffset = 85;
				qqItemHeight = 36;
				break;
				case 'front2010':
				qqOffset = 110;
				qqItemHeight = 38;
				break;
				default : 
				qqOffset = 100;
				qqItemHeight = 46;
			} 
			var qqHeight = (qqOffset + (qqCount * qqItemHeight)) +'px';  
			jQuery('#qq').html('<div class="qqBox" style="height:' + qqHeight + '"><iframe id="qqFrame' + qqID + '" name="qqFrame' + qqID + '" class="qqFrame" src="http://content.usatoday.com/quickquestion/jquery/1.0.1.html?qqID=' + qqID + '&section=' + qqSection + '&display=' + qqDisplay + '" width="100%" height="100%" frameborder="0" border="0"></iframe></div>');  
		} //if
	}
/*
	function hoverFix(){
		//GAMES
		jQuery("#section-nav>li:eq(3)").hover(
		  function () {
		  jQuery('#section-nav li ul:eq(0)').css({'display':'block'});
		  }, 
		  function () {
		  jQuery('#section-nav li ul:eq(0)').css({'display':'none'});
		  }
		);
		//PHOTOS
		jQuery("#section-nav>li:eq(6)").hover(
		  function () {
		  jQuery('#section-nav li ul:eq(1)').css({'display':'block'});
		  }, 
		  function () {
		  jQuery('#section-nav li ul:eq(1)').css({'display':'none'});
		  }
		);		
	}
*/
	setTimeout(function(){ _I.init(); }, 20);
})();
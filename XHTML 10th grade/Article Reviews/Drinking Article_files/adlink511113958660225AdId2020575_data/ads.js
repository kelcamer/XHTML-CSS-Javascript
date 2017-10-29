

var detect = navigator.userAgent.toLowerCase();

function checkIt(string) {
	return detect.indexOf(string) >= 0;
}

var naturalImages = new Array; 

naturalImageOnLoad = function() {
	if (this.width >= this.height) {
		// this.originalImageTag.width = this.boxSize;
		this.originalImageTag.height = (this.boxSize * this.height / this.width);
	} else {
		// this.originalImageTag.height = this.boxSize;
		this.originalImageTag.width = (this.boxSize * this.width / this.height);
	}
	this.originalImageTag.style.visibility='visible';
}

function resizeImage(obj, size) {
	if(obj.naturalWidth > 0 && obj.naturalHeight > 0) {
		if (obj.naturalWidth >= obj.naturalHeight) {
			// obj.width = size;
			obj.height = (size * obj.naturalHeight / obj.naturalWidth);
		} else {
			// obj.height = size;
			obj.width = (size * obj.naturalWidth / obj.naturalHeight);
		}
	} else {
		var img = new Image();
		img.onload = naturalImageOnLoad;
		img.originalImageTag = obj;
		img.boxSize = size;
		img.src = obj.src;
		naturalImages.push(img);
	}
	if(!checkIt("msie")) {
		obj.style.visibility='visible';
	}
}
/**
 * SWFObject v1.5: Flash Player detection and embed - http://blog.deconcept.com/swfobject/
 *
 * SWFObject is (c) 2007 Geoff Stearns and is released under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */
if(typeof deconcept=="undefined"){var deconcept=new Object();}if(typeof deconcept.util=="undefined"){deconcept.util=new Object();}if(typeof deconcept.SWFObjectUtil=="undefined"){deconcept.SWFObjectUtil=new Object();}deconcept.SWFObject=function(_1,id,w,h,_5,c,_7,_8,_9,_a){if(!document.getElementById){return;}this.DETECT_KEY=_a?_a:"detectflash";this.skipDetect=deconcept.util.getRequestParameter(this.DETECT_KEY);this.params=new Object();this.variables=new Object();this.attributes=new Array();if(_1){this.setAttribute("swf",_1);}if(id){this.setAttribute("id",id);}if(w){this.setAttribute("width",w);}if(h){this.setAttribute("height",h);}if(_5){this.setAttribute("version",new deconcept.PlayerVersion(_5.toString().split(".")));}this.installedVer=deconcept.SWFObjectUtil.getPlayerVersion();if(!window.opera&&document.all&&this.installedVer.major>7){deconcept.SWFObject.doPrepUnload=true;}if(c){this.addParam("bgcolor",c);}var q=_7?_7:"high";this.addParam("quality",q);this.setAttribute("useExpressInstall",false);this.setAttribute("doExpressInstall",false);var _c=(_8)?_8:window.location;this.setAttribute("xiRedirectUrl",_c);this.setAttribute("redirectUrl","");if(_9){this.setAttribute("redirectUrl",_9);}};deconcept.SWFObject.prototype={useExpressInstall:function(_d){this.xiSWFPath=!_d?"expressinstall.swf":_d;this.setAttribute("useExpressInstall",true);},setAttribute:function(_e,_f){this.attributes[_e]=_f;},getAttribute:function(_10){return this.attributes[_10];},addParam:function(_11,_12){this.params[_11]=_12;},getParams:function(){return this.params;},addVariable:function(_13,_14){this.variables[_13]=_14;},getVariable:function(_15){return this.variables[_15];},getVariables:function(){return this.variables;},getVariablePairs:function(){var _16=new Array();var key;var _18=this.getVariables();for(key in _18){_16[_16.length]=key+"="+_18[key];}return _16;},getSWFHTML:function(){var _19="";if(navigator.plugins&&navigator.mimeTypes&&navigator.mimeTypes.length){if(this.getAttribute("doExpressInstall")){this.addVariable("MMplayerType","PlugIn");this.setAttribute("swf",this.xiSWFPath);}_19="<embed type=\"application/x-shockwave-flash\" src=\""+this.getAttribute("swf")+"\" width=\""+this.getAttribute("width")+"\" height=\""+this.getAttribute("height")+"\" style=\""+this.getAttribute("style")+"\"";_19+=" id=\""+this.getAttribute("id")+"\" name=\""+this.getAttribute("id")+"\" ";var _1a=this.getParams();for(var key in _1a){_19+=[key]+"=\""+_1a[key]+"\" ";}var _1c=this.getVariablePairs().join("&");if(_1c.length>0){_19+="flashvars=\""+_1c+"\"";}_19+="/>";}else{if(this.getAttribute("doExpressInstall")){this.addVariable("MMplayerType","ActiveX");this.setAttribute("swf",this.xiSWFPath);}_19="<object id=\""+this.getAttribute("id")+"\" classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" width=\""+this.getAttribute("width")+"\" height=\""+this.getAttribute("height")+"\" style=\""+this.getAttribute("style")+"\">";_19+="<param name=\"movie\" value=\""+this.getAttribute("swf")+"\" />";var _1d=this.getParams();for(var key in _1d){_19+="<param name=\""+key+"\" value=\""+_1d[key]+"\" />";}var _1f=this.getVariablePairs().join("&");if(_1f.length>0){_19+="<param name=\"flashvars\" value=\""+_1f+"\" />";}_19+="</object>";}return _19;},write:function(_20){if(this.getAttribute("useExpressInstall")){var _21=new deconcept.PlayerVersion([6,0,65]);if(this.installedVer.versionIsValid(_21)&&!this.installedVer.versionIsValid(this.getAttribute("version"))){this.setAttribute("doExpressInstall",true);this.addVariable("MMredirectURL",escape(this.getAttribute("xiRedirectUrl")));document.title=document.title.slice(0,47)+" - Flash Player Installation";this.addVariable("MMdoctitle",document.title);}}if(this.skipDetect||this.getAttribute("doExpressInstall")||this.installedVer.versionIsValid(this.getAttribute("version"))){var n=(typeof _20=="string")?document.getElementById(_20):_20;n.innerHTML=this.getSWFHTML();return true;}else{if(this.getAttribute("redirectUrl")!=""){document.location.replace(this.getAttribute("redirectUrl"));}}return false;}};deconcept.SWFObjectUtil.getPlayerVersion=function(){var _23=new deconcept.PlayerVersion([0,0,0]);if(navigator.plugins&&navigator.mimeTypes.length){var x=navigator.plugins["Shockwave Flash"];if(x&&x.description){_23=new deconcept.PlayerVersion(x.description.replace(/([a-zA-Z]|\s)+/,"").replace(/(\s+r|\s+b[0-9]+)/,".").split("."));}}else{if(navigator.userAgent&&navigator.userAgent.indexOf("Windows CE")>=0){var axo=1;var _26=3;while(axo){try{_26++;axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash."+_26);_23=new deconcept.PlayerVersion([_26,0,0]);}catch(e){axo=null;}}}else{try{var axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");}catch(e){try{var axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");_23=new deconcept.PlayerVersion([6,0,21]);axo.AllowScriptAccess="always";}catch(e){if(_23.major==6){return _23;}}try{axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");}catch(e){}}if(axo!=null){_23=new deconcept.PlayerVersion(axo.GetVariable('$version').split(" ")[1].split(","));}}}return _23;};deconcept.PlayerVersion=function(_29){this.major=_29[0]!=null?parseInt(_29[0]):0;this.minor=_29[1]!=null?parseInt(_29[1]):0;this.rev=_29[2]!=null?parseInt(_29[2]):0;};deconcept.PlayerVersion.prototype.versionIsValid=function(fv){if(this.major<fv.major){return false;}if(this.major>fv.major){return true;}if(this.minor<fv.minor){return false;}if(this.minor>fv.minor){return true;}if(this.rev<fv.rev){return false;}return true;};deconcept.util={getRequestParameter:function(_2b){var q=document.location.search||document.location.hash;if(_2b==null){return q;}if(q){var _2d=q.substring(1).split("&");for(var i=0;i<_2d.length;i++){if(_2d[i].substring(0,_2d[i].indexOf("="))==_2b){return _2d[i].substring((_2d[i].indexOf("=")+1));}}}return "";}};deconcept.SWFObjectUtil.cleanupSWFs=function(){var _2f=document.getElementsByTagName("OBJECT");for(var i=_2f.length-1;i>=0;i--){_2f[i].style.display="none";for(var x in _2f[i]){if(typeof _2f[i][x]=="function"){_2f[i][x]=function(){};}}}};if(deconcept.SWFObject.doPrepUnload){if(!deconcept.unloadSet){deconcept.SWFObjectUtil.prepUnload=function(){__flash_unloadHandler=function(){};__flash_savedUnloadHandler=function(){};window.attachEvent("onunload",deconcept.SWFObjectUtil.cleanupSWFs);};window.attachEvent("onbeforeunload",deconcept.SWFObjectUtil.prepUnload);deconcept.unloadSet=true;}}if(!document.getElementById&&document.all){document.getElementById=function(id){return document.all[id];};}var getQueryParamValue=deconcept.util.getRequestParameter;var FlashObject=deconcept.SWFObject;var SWFObject=deconcept.SWFObject;


document.write('\n\n\n\n\n	 \n	\n		\n		\n			\n	\n	\n\n\n\n\n\n\n		\n		\n	\n				\n			\n			\n				\n				<IFRAME SRC="http://ad.doubleclick.net/adi/N3285.usatoday/B2343920.51;sz=728x90;ord=8254021655367924331?;click=http://r.turn.com/r/formclick/id/azqWwPYsjHIAvAQAcgABAA/url/;" WIDTH=728 HEIGHT=90 MARGINWIDTH=0 MARGINHEIGHT=0 HSPACE=0 VSPACE=0 FRAMEBORDER=0 SCROLLING=no BORDERCOLOR=\'#000000\'>\n<SCRIPT language=\'JavaScript1.1\' SRC="http://ad.doubleclick.net/adj/N3285.usatoday/B2343920.51;abr=!ie;sz=728x90;ord=8254021655367924331?;click=http://r.turn.com/r/formclick/id/azqWwPYsjHIAvAQAcgABAA/url/;">\n</SCRIPT>\n<NOSCRIPT>\n<A HREF="http://r.turn.com/r/formclick/id/azqWwPYsjHIAvAQAcgABAA/url/http://ad.doubleclick.net/jump/N3285.usatoday/B2343920.51;abr=!ie4;abr=!ie5;sz=728x90;ord=8254021655367924331?">\n<IMG SRC="http://ad.doubleclick.net/ad/N3285.usatoday/B2343920.51;abr=!ie4;abr=!ie5;sz=728x90;ord=8254021655367924331?" BORDER=0 WIDTH=728 HEIGHT=90 ALT="Advertisement"></A>\n</NOSCRIPT>\n</IFRAME>\n			\n					\n		\n	\n					\n					\n		\n	\n		\n	\n\n\n\n			<span style="display: none">\n					<img height="1" width="1" style="border-style:none;" alt="" src="http://segments.adap.tv/data/?p=cadreon&type=gif&segment=8&add=true"/> \n					<img border="0" src="http://r.turn.com/r/beacon?b2=6YtkBrDAE9IC5hFHjnB-yIAsYMfEACa-nO9phD-NOvPPVx7awJtIT5bFbQ7adJJ3wc3E_rvvWKH9Who8_my78Q&cid="> \n				</span>\n				<span style="display: none">\n																																																																																																														<scr' + 'ipt src=\'http://ad.yieldmanager.com/pixel?&id=1502968&id=1468517&id=1230109&id=1283938&id=1023063&id=1198834&id=939893&id=1229614&id=956404&id=1230210&id=1436518&id=1294447&id=1210932&id=1416226&id=1331328&id=1342492&id=1415533&id=940083&id=1416227&id=1357445&id=1349763&id=698998&id=1238433&id=1224511&id=1364633&id=1253950&id=1415270&id=1230205&id=1239839&id=1398249&id=1361950&id=1238467&id=1250690&id=1473912&id=1364793&id=1543832&id=1433249&id=1470619&id=1364562&id=1198835&id=1467123&id=1266660&id=1467710&id=1320775&id=950991&id=1331325&id=1282674&id=1415271&id=1238971&id=1050626&id=956405&id=1230215&t=1\' type=\'text/javascript\'></scr' + 'ipt>\n		</span>\n	\n							<iframe name="turn_sync_frame" width="0" height="0" frameborder="0" src="http://cdn.turn.com/server/ddc.htm?uid=2989857500695124180&mktid=73&mpid=1912842&fpid=-1&rnd=2633247845432834667&nu=n&sp=n&ctid=1" marginwidth="0" marginheight="0" vspace="0" hspace="0" allowtransparency="true" scrolling="no"></iframe>\n\n			<!-- (c) 2005-2011 Turn, Inc. -->\n\n')


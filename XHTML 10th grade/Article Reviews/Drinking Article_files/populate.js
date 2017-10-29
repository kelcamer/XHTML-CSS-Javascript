DM_addToLoc("zipcode", escape(s_ut.prop30));
DM_addToLoc("age", escape(s_ut.prop31));
DM_addToLoc("gender", escape(s_ut.prop32));
DM_addToLoc("country", escape(s_ut.prop35));
DM_addToLoc("job", escape(s_ut.prop33));
DM_addToLoc("industry", escape(s_ut.prop34));
DM_addToLoc("company size", escape(s_ut.prop39));
DM_addToLoc("csp code", escape(s_ut.getQueryParam('csp')));
/*DM_addToLoc("hhi", escape(RDBIncRange));*/
DM_tag();
document.write('<img id="rsi_segs_ashx" border="0" width="1" height="1" style="position:absolute;top:-1000px;left:-1000px" src="http://i.usatoday.net/_common/_images/clear.gif" />');
        if (!window.rsinetsegs) window.rsinetsegs=[];
setTimeout(
	function(){
		document.cookie=('rsi_seg='+(rsinetsegs.join('|')).replace(/J06575_/g,'')+';expires='+new Date(rsi_now.getTime()+259200000).toUTCString()+';path=/;domain=.usatoday.com');
 		document.getElementById('rsi_segs_ashx').src= 'http://usata1.gcion.com/gcion.ashx?q=5&Segment='+escape(rsinetsegs.join('|'))+'&CacheDefeat='+new Date().getTime();
	}
,1);
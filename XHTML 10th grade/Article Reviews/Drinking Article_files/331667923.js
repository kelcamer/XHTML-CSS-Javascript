/* AG-develop 12.7.1-348 (2011-10-07 15:38:31 UTC) */
rsinetsegs=['J06575_10051','J06575_10263','J06575_10275','J06575_10285','J06575_10290','J06575_10300','J06575_10380','J06575_10381','J06575_10389','J06575_10390','J06575_10392','J06575_10396','J06575_10407','J06575_10427','J06575_10465','J06575_10473','J06575_10561','J06575_10564','J06575_10633','J06575_10638','J06575_10650','J06575_10695','J06575_50133','J06575_50319','J06575_50507','J06575_10540','J06575_50558','J06575_50240','J06575_50709','J06575_50735','J06575_50763','J06575_50778','J06575_50826','J06575_50001','J06575_50889','J06575_50902'];
var rsiExp=new Date((new Date()).getTime()+2419200000);
var rsiDom=location.hostname;
rsiDom=rsiDom.replace(/.*(\.[\w\-]+\.[a-zA-Z]{3}$)/,'$1');
rsiDom=rsiDom.replace(/.*(\.[\w\-]+\.\w+\.[a-zA-Z]{2}$)/,'$1');
rsiDom=rsiDom.replace(/.*(\.[\w\-]{3,}\.[a-zA-Z]{2}$)/,'$1');
var rsiSegs="";
var rsiPat=/.*_5.*/;
for(x=0;x<rsinetsegs.length;++x){if(!rsiPat.test(rsinetsegs[x]))rsiSegs+='|'+rsinetsegs[x];}
document.cookie="rsi_segs="+(rsiSegs.length>0?rsiSegs.substr(1):"")+";expires="+rsiExp.toGMTString()+";path=/;domain="+rsiDom;
if(typeof(DM_onSegsAvailable)=="function"){DM_onSegsAvailable(['J06575_10051','J06575_10263','J06575_10275','J06575_10285','J06575_10290','J06575_10300','J06575_10380','J06575_10381','J06575_10389','J06575_10390','J06575_10392','J06575_10396','J06575_10407','J06575_10427','J06575_10465','J06575_10473','J06575_10561','J06575_10564','J06575_10633','J06575_10638','J06575_10650','J06575_10695','J06575_50133','J06575_50319','J06575_50507','J06575_10540','J06575_50558','J06575_50240','J06575_50709','J06575_50735','J06575_50763','J06575_50778','J06575_50826','J06575_50001','J06575_50889','J06575_50902'],'j06575');}
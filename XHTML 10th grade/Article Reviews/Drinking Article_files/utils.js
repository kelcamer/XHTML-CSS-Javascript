   (function($){
    $(document).ready(function() {
      function click(thing, elt) {
	var height= elt.height();
	return function(){
	  thing.toggleClass('off')
	  var off= thing.hasClass('off');
	  $('.legend', thing).css('visibility',(off ?'hidden' :'visible'));
	  $('.label > a', thing).css('background','url(http://i.usatoday.net/_common/_images/caption'+(off ?0 :1)+'.gif) left no-repeat');
	}}
     $("img[cutline]").each(function(j){
      var $this= $(this);
      var width= $this.width();
      var height= $this.height();
      var wrapme= ('a' == $this.parent()[0].tagName.toLowerCase()) ?$this.parent() :$this;
// ie has not been fully respecting dynamically applied styles
      var mT = $this.css('marginTop');
      var mR = $this.css('marginRight');
      var mB = $this.css('marginBottom');
      var mL = $this.css('marginLeft');
      var rudiment= 'margin: '+mT+' '+mR+' '+mB+' '+mL+'; float: '+$this.css('float');
      $this.css({'border':'1px solid #666','margin':'0','float':'none'});
      var marker= wrapme
	  .wrap('<div style="line-height:12px; font-size:12px; width:'+(width+2)+'px;'+rudiment+'">'+
		  '<div class="blog-captioned-photo'+j+'">'+
		    '<div class="photo-container" style="height:'+(height+2)+'px; position:relative; padding:0; clear:both">'+
                      '<span></span>'+
		      '<div class="legend" style="'+
			  'position:absolute;z-index:20;bottom:1px;left:0;width:'+(width+2)+'px;'+
			  'font-size:10px;color:#fff;background-color:#000;'+
			  'filter:alpha(opacity=70);-moz-opacity:0.7;opacity:0.7'+
			'">'+
                        '<div class="wording" style="margin:5px; font-family:Arial,Helvetica,sans-serif">'+
                           $this.attr('cutline')+
                        '</div>'+
                      '</div>'+
		    '</div>'+
		    '<div class="controls">'+
		      '<div class="label" style="width:100px; float:left">'+
                        '<a href="javascript:void(0)" style="padding:0 0 0 11px; font-size:10px; color:#666">CAPTION</a>'+
                      '</div>'+
		      '<div class="credit" style="width:'+(width-98)+'px; float: left; font-size:10px;'+
                        'color:#666; text-align:right">'+$this.attr('credit')+'</div>'+
		    '</div>'+
		  '</div>'+
		'</div>')
	  .parent()
	  .parent()
	  .parent()
	  .parent();
      var bucket= $(marker);
      var F= click(bucket, $('.legend', bucket));
      F();
      $('.label > a', bucket).click(F);
     })
    });
   })(jQuery);

function renderQQ(qqID,qqSection,qqCount,qqDisplay) {
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
		default : 
		qqOffset = 100;
		qqItemHeight = 46;
	} 
        var qqHeight = (qqOffset + (qqCount * qqItemHeight)) +'px';  
        document.write('<div class="qqBox" style="height:' + qqHeight + '"><iframe id="qqFrame' + qqID + '" name="qqFrame' + qqID + '" class="qqFrame" src="http://content.usatoday.com/quickquestion/jquery/1.0.1.html?qqID=' + qqID + '&section=' + qqSection + '&display=' + qqDisplay + '" width="100%" height="100%" frameborder="0" border="0"></iframe></div>');  
}

/*if (navigator.userAgent.indexOf('Firefox/2.') > -1) {
	document.write('<style type="text/css">div.item div.qqBox {margin-left: 18px !important;}</style>');
}*/


var afs_num_top_ads = 3;
var afs_top_ads = "";
var afs_bottom_ads = "";

function GetParam(name) {
   var match = new RegExp("[\?&]" + name + "=([^&]+)", "i").exec(location.search);
   if (match == null) return null;
   else return decodeURIComponent(match[1]).replace(/\+/g," ");
}

/*
 * This function is required. It processes the google_ads JavaScript object,
 * which contains AFS ads relevant to the user's search query. The name of
 * this function must be google_afs_request_done. If this
 * function is not named correctly, your page will not display AFS ads.
 */
 
 

function google_ad_request_done(google_ads) {
   for(i = 0; i < google_ads.length; i++) {
      var isNarrow = google_ads[i].type == "text/narrow";
      adRendering =
         '<div class="afs_inner_box">' +
         '<a class="ad_title" href="' + google_ads[i].url + '" >' +
         google_ads[i].line1 + '</a><br><span class="ad_text">' +
         google_ads[i].line2 + '<br>' +
         google_ads[i].line3 + '</span><br>' + 
         '<a class="ad_url" href="' + google_ads[i].url + '">' + google_ads[i].visible_url + '</a><br/></div>';
	      i < afs_num_top_ads ? afs_top_ads += adRendering : afs_bottom_ads += adRendering;
   }
}

function display_afs_ads(ads, div_id) {
   if (ads != "" && document.getElementById(div_id) != null) {
      document.getElementById(div_id).innerHTML =
         '<div class="afs_ad_box">' +
         '<div class="afs_header"><a href="' + google_info.feedback_url+'">Ads by Google</a></div>' +
          ads + '</div>';
   }
}

//google_afs_query = GetParam('q');

//if (google_afs_query != null) {
   //google_afs_adpage = GetParam('p');
   //google_afs_ad = GetParam('a');
   google_max_num_ads='6';
   //google_afs_ad = 'w6'; // specify the number of ads you are requesting
   google_ad_client = 'ca-usatoday_js'; // Type your client_id between the quotes. Please verify spelling.
   google_encoding = 'utf8'; // select output encoding scheme
   google_safe = 'high'; // specify level for filtering non-family-safe ads
   google_adtest = 'off'; // ** set parameter to off before launch to production
   google_ad_output = 'js';
   google_ad_type = 'text';
   google_image_size = '160x600';
   /*
    * The JavaScript returned from the following page uses
    * the parameter values assigned above to populate an array
    * of ad objects. Once that array has been populated,
    * the JavaScript will call the google_afs_request_done
    * function to display the ads.
    */
   document.write('<script type="text/javascript" src="http://pagead2.googlesyndication.com/pagead/show_ads.js"></scr' + 'ipt>');
//}
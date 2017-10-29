//****************
//GLOBAL VARIABLES
//****************

var originalPath= window.location.toString().toLowerCase();
var adfileSsts= (originalPath+'////').split('/');
var adtech_throttle = 4;//This variable controls the flow of adtech calls:0 = none;1 = 12.5%;2 = 50%;3 = 87.5%;>3 = 100%
var adtechserver = "gannett.gcion.com"; //Adtech Server Name
var adtechnetworkid =  5111.1; //Adtech Network ID
var keyword_counter=0;
var keyvaluepair_counter=0;
var alteredPath= getAlteredPath(); 
var ad_regions = {};
var adpos_arr = new Array();
var ad_sizes = {};
var default_rotate=180;
var min_rotate=60;
initialize();
var specialAdTag= {
	Links2: 1,
	Zaplet1: 1,
	SLFront: 1,
	FloatBottom: 1,
	Links1: 1,
	HFMarketing: 1,
	ShopBox2: 1,
	ShopBox3: 1,
	ShopBox4: 1,
	BigShop: 1,
	AdOps1: 1
};

var regularAdTag = {
	Bottom728x90: 1,
	Headline: 1,
	HFHeadline: 1,
	HFBottom728x90: 1,
	HFLaunchPad: 1,
	HFPoster: 1,
	HFSpon: 1,
	Launchpad: 1,
	PageCount: 1,
	Poster2: 1,
	Poster3: 1,
	Poster4: 1,
	Poster5: 1,
	PosterBlog: 1,
	Preroll: 1,
	Spon1: 1,
	Top728x90: 1,
	Special1: 1,
	Special2: 1,
	Widget: 1,
	Video_Banner_300: 1,
	FixedPanel: 1,
	SFPoster: 1,
	SkinRight: 1,
	SkinLeft: 1,
	HFStrip: 1
};
var adCreativeSizes = {
	Bottom728x90: '728x90',
	Headline: 'dynamic',
	HFPoster: 'dynamic',
	HFSpon: '88x31',
	Launchpad: 'dynamic',
	Links2: 'dynamic',
	PageCount: 'dynamic',
	Poster2: '180x150',
	Poster3: '300x250',
	Poster4: '180x150',
	PosterBlog: '300x250',
	Poster5: 'dynamic',
	Preroll: 'dynamic',
	Special2: 'dynamic',
	Spon1: '88x31',
	Top728x90: '728x90',
	Widget: 'dynamic',
	Zaplet1: '88x31',
	FixedPanel: '336x700',
	SFPoster: '300x250',
	SkinRight: '125x600',
	SkinLeft: '125x600',
	HFStrip: '660x60'
}
var ContextWebKeywords = '';
GetContextWebKeywords();
var con_path = document.location.href;
if (con_path.indexOf("ContestId=cfd292ce-ecae-44e7-a540-82ebe3d46f91") != -1) document.write('<style type="text/css">#searchBar {display:none;}#navcontainer {display:none;}.globalNavBorder {display:none !important}.inside-copy {display:none !important}.featurAdvLink {display:none !important}#footerGlobalNav {display:none !important}.footerTitle {display:none !important}.footerLink {display:none !important}</style>')



//********************
//END GLOBAL VARIABLES
//********************

function getAlteredPath()
{
var host=window.location.host.toLowerCase();
var path = originalPath;

if (window.mjx_req && (window.mjx_req != '')) 
{
	if(window.mjx_req.charAt(window.mjx_req.lastIndex)=='/')
		{
			path=mjx_req.substring(0, window.mjx_req.lastIndexOf('/'));
		}
	else
		{
		host=path = mjx_req;
		}
}
else
	{
		if(!(host=="usatoday.com" || host=="www.usatoday.com" || host=="asp.usatoday.com" || host == "content.usatoday.com"))
		{
			path=host;
		}
	}
return path;
}

function get_ad_content(ad_position_name) {
	
	if (regularAdTag[ad_position_name])
	{
		inFIF=void(0);
		callAd(ad_position_name);
	}
	else if (specialAdTag[ad_position_name])
		handleSpecialAdTags(ad_position_name);
}


function handleSpecialAdTags(ad_position_name) {
	
	//recent changes: made links2 ad call handle both links1 and links2 ad calls.  links1 is then ignored
	
	switch(ad_position_name) {
		case 'Links2':
			callGoogleFunction('top');
			handleLinks2();
			break;
		case 'Zaplet1':
			handleZaplet1();
			break;
		case 'SLFront':
			callIframeSLF('SLFront');
			break;
		case 'FloatBottom':
			callGoogleFunction('bottom');
			break;
		case 'Links1': // do nothing for links
			break;
		case 'HFMarketing':
			handleHFMarketing('HFMarketing');
			break;
		case 'ShopBox2':
			handleShopBox('ShopBox2');
			break;
		case 'ShopBox3':
			handleShopBox('ShopBox3');
			break;
		case 'ShopBox4':
			handleShopBox('ShopBox4');
			break;
		case 'BigShop':
			handleBigShop('BigShop');
			break;
		case 'AdOps1':
			handleAdOps1('AdOps1');
			break;
	}
}

function handleLinks2() {
	var path = alteredPath;
	path = path.replace("://", "");
	path = path.substring(path.indexOf('/')+1);
	var section = path.substring(0, path.indexOf('/'));
	if(section =='life' || section=='money' || section=='travel')
	{
		callAd('Links2');
	}
//	else if(section=='travel')
	//{
		//callTravelLinks('Links2');
		
//	}
}

function handleZaplet1()
{
	var path = originalPath;
	path = path.replace("://", "");
	path = path.substring(path.indexOf('/')+1);
	var section = path.substring(0, path.indexOf('/'));

	if(section =='sports' || section=='travel' || section=='money' || section=='test')
	{
		callAd('Zaplet1');
	}
	
}
function handleAdOps1(ad_position_name)
{
		var path = window.location.toString().replace(/\.com\/test/, '.com').toLowerCase();
		var section;
	 	path = path.replace("://", "");
		path = path.substring(path.indexOf('/')+1);
		section = path.substring(0, path.indexOf('/'));
		if(!(section=="life"||section=="money"||section=="news"||section=="sports"||section=="tech"||section=="travel"||section=="weather"))
		{
			section="ros";
		}
	var iframeLocation = 'http://i.usatoday.net/_ads/survey/' + section + '.htm';
	var iframeCall = '<iframe name="'+ad_position_name + '" src="'+iframeLocation + '" scrolling="no" frameborder="0" height="1" width="1"></iframe>';
	document.write(iframeCall);
	if(section!="ros")
	{
		iframeLocation = 'http://i.usatoday.net/_ads/survey/ros.htm';
		iframeCall = '<iframe name="'+ad_position_name + '" src="'+iframeLocation + '" scrolling="no" frameborder="0" height="1" width="1"></iframe>';
		document.write(iframeCall);
	}
}
function handleShopBox(ad_position_name)
{
	var iframeLocation = 'http://content.usatoday.com/_ads/shop_box_ads/' + ad_position_name + '.htm';
	var iframeCall = '<iframe class="frameShopBox" name="'+ad_position_name + '" src="'+iframeLocation + '" scrolling="no" frameborder="0"></iframe>';
	document.write(iframeCall);
}
function handleBigShop(ad_position_name)
{
	var iframeLocation = 'http://content.usatoday.com/_ads/shop_box_ads/' + ad_position_name + '.htm';
	var iframeCall = '<iframe class="frameBigShop" name="'+ad_position_name + '" src="'+iframeLocation + '" scrolling="no" frameborder="0" style="margin-top: -20px;"></iframe>';
	document.write(iframeCall);
}

function handleHFMarketing(ad_position_name)
{
	var iframeLocation = 'http://content.usatoday.com/_ads/home_front_box_ads/' + ad_position_name + '.htm';
	var iframeCall = '<iframe class="frameHFMarketing" name="'+ad_position_name + '" src="'+iframeLocation + '" scrolling="no" frameborder="0" style="margin-top: -60px;"></iframe>';
	document.write(iframeCall);
}

function callIframeSLF(ad_position_name)
{
	var iframeLocation = 'http://i.usatoday.net/_ads/sponsoredlink/' + ad_position_name + '.htm';
	var iframeCall = '<iframe class="frameSLF" name="'+ad_position_name + '" src="'+iframeLocation + '" scrolling="no" frameborder="0"></iframe>';
	document.write(iframeCall);
}

function callIframeFloat(ad_position_name)
{
	//steve ahlberg's iframes
	var iframeLocation = 'http://i.usatoday.net/_ads/sponsoredlink/' + ad_position_name + '.htm?'+document.location.pathname;
	var iframeCall = '<iframe class="frameFloatBottom" name="'+ ad_position_name + '" src="' + iframeLocation + '" scrolling="no" frameborder="0" style="width:600px; height:225px;"></iframe>';
	document.write(iframeCall); 
}
function callGoogleFunction(ad_position_name)
{
	if(ad_position_name=='top')
	{
		display_afs_ads(afs_top_ads, "Adv9");
	}
	else
	{
		display_afs_ads(afs_bottom_ads, "relatedLinksWide");
	}
}

function callIframeLinks(ad_position_name)
{
		var path = originalPath;
		path = path.replace("://", "");
		path = path.substring(path.indexOf('/')+1);
		var section = path.substring(0, path.indexOf('/'));
		if(section=='travel')
			{
				callTravelLinks('Links1');
			}
		else
			{	
				//steve ahlberg's iframes
				var iframeLocation = 'http://i.usatoday.net/_ads/sponsoredlink/' + ad_position_name + '.htm?'+document.location.pathname;
				var iframeCall = '<iframe name="'+ ad_position_name + '" src="' + iframeLocation + '" scrolling="no" frameborder="0" style="padding-bottom:8px; height: 155px;"></iframe>';
				var con_path = document.location.href;
				if (con_path.indexOf("ContestId=cfd292ce-ecae-44e7-a540-82ebe3d46f91") == -1) 
				{
					document.write(iframeCall); 
				}
			}
}

function callTravelLinks(ad_position_name)
{
	//recent change combined the two sherman travels into just links1 position and did nothing when any other ad position came through
	var iframeLocation="";
	var iframeCall="";
	if(ad_position_name=='Links1')
	{
		iframeLocation = 'http://syn.shermanstravel.com/shermanstravel/syndication/usatoday/traveldeals_iframe_src.php?format=html&report=todaysTopTravelDeals&charLim=70';
		iframeCall = '<iframe name="'+ ad_position_name + '" src="' + iframeLocation + '" scrolling="no" frameborder="0" style="padding-bottom:8px; height: 155px;"></iframe>';

		iframeLocation = 'http://syn.shermanstravel.com/shermanstravel/syndication/usatoday/traveldeals_iframe_src.php?format=html&report=topTravelDeals&ct=UT_ROS&num=3';
		iframeCall2 = '<iframe width="100%" scrolling="no" height="300" style="margin-bottom:5px" frameborder="0" marginwidth="0" marginheight="0" src="'+iframeLocation + '"></iframe>';
		
		iframeCall += iframeCall2;	
	}

	document.write(iframeCall);
}
function GetContextWebKeywords()
{
	var pageURL= document.location.href;
	var search= document.location.search;
	if (search) {
		pageURL= pageURL.substring(0, pageURL.indexOf('?'));
		if (search.match(/type=blog/) && search.match(/ak=([^&#]*)/))
			pageURL+= '?type=blog&ak='+RegExp.$1
	}
	var requestURL= "http://contextweb.usatoday.net/asp/Context/ContextWebHandler.ashx?URL=" + encodeURIComponent(pageURL);
	document.write('<script type="text/javascript" src="' + requestURL + '"></scr' + 'ipt>');
}

function initialize() {
		var randomnumber = Math.round(Math.random()*3);
		if(randomnumber < adtech_throttle){
			window.adgroupid= window.adgroupid || Math.round(Math.random() * 1000000);
		
			if(originalPath.indexOf('?')!=-1)
				originalPath = originalPath.substring(0, originalPath.indexOf('?'));	

			if(alteredPath.indexOf('?')!=-1)
				alteredPath = alteredPath.substring(0, alteredPath.indexOf('?'));

			if(alteredPath.lastIndexOf('/')!=-1 && ((!window.mjx_req) || (window.mjx_req == '')))
				alteredPath = alteredPath.substring(0, alteredPath.lastIndexOf('/'));

			alteredPath = alteredPath.replace(/https*:\/\//, '');

		}
		//include google script
		var requestURL= "http://i.usatoday.net/_common/_scripts/_oas/google.js";
		if(window.usat_analytics_pagename_url!="www.usatoday.com/search/results")
		{
			document.write('<script type="text/javascript" src="' + requestURL + '"></scr' + 'ipt>');
		}
}



function callAd(ad_position_name)
{
	
			var posReg = RegExp(/(\d+)x(\d+)_(.*)/);
			var sizepos ="";
			var adtech_creativesize = "";
			var placementID=808504;

			if(adCreativeSizes[ad_position_name]=='dynamic')
			{
				adtech_creativesize="0";
				adtech_pos="";
			}		
			else
				{
					adtech_creativesize = "-1";
					sizepos = adCreativeSizes[ad_position_name];
					adtech_pos = "size="+sizepos+";";
				}

				//cut off last slash
				if(originalPath.charAt(originalPath.length-1) == '/')
						{
							originalPath=originalPath.substring(0, originalPath.lastIndexOf('/'));
						}
				if(alteredPath.charAt(alteredPath.length-1) == '/')
						{
							alteredPath=alteredPath.substring(0, alteredPath.lastIndexOf('/'));
						}
				
				
			//BLOGS HANDLING
			checkForBlogs();	 

//used to determine whether page is default.htm for home/section front in which case send the entire url (w/out truncating the filename)
			if(((!window.mjx_req) || (window.mjx_req == '')) && ((originalPath.indexOf("Default.aspx".toLowerCase())!=-1) || (originalPath.indexOf("Default.htm".toLowerCase())!=-1) || ((originalPath == "http://www.usatoday.com") || (originalPath == "http://usatoday.com")))) 
			{
				  originalPath = originalPath.replace("http://", "");
					if ((originalPath == "www.usatoday.com") || (originalPath == "usatoday.com"))
					{
						originalPath = "www.usatoday.com/default.htm";
					}
					
					placementID = getSectionBasedPlacementID(originalPath);
					
					document.write('<scr'+'ipt language="javascript1.1" src="http://'+adtechserver+'/addyn/3.0/'+adtechnetworkid +'/'+placementID+'/0/'+ adtech_creativesize +'/ADTECH;'+ adtech_pos +'alias='+ originalPath+'_'+ad_position_name+';cookie=info;loc=100;target=_blank;'+ContextWebKeywords+'grp='+window.adgroupid+';misc='+new Date().getTime()+'"></scri'+'pt>');			
			}
			else
			{
				 placementID = getSectionBasedPlacementID(alteredPath);
			   document.write('<scr'+'ipt language="javascript1.1" src="http://'+adtechserver+'/addyn/3.0/'+adtechnetworkid +'/'+placementID+'/0/'+ adtech_creativesize +'/ADTECH;'+ adtech_pos +'alias='+ alteredPath+'_'+ad_position_name+';cookie=info;loc=100;target=_blank;'+ContextWebKeywords+'grp='+window.adgroupid+';misc='+new Date().getTime()+'"></scri'+'pt>');		
			}
}

function getSectionBasedPlacementID(passedPath)
{
			var myPath = passedPath.substring(passedPath.indexOf('/')+1);
			var section="ros";
			var id=808504;
			if(myPath.indexOf('/')!=-1)
			{
				section = myPath.substring(0, myPath.indexOf('/'));
				section = section.toLowerCase();
			}
			switch(section){
			case 'life':
		id=808997;	
		break;
		case 'money':
		id=809044;
		break;
		case 'news':
		id=809058;
		break;
		case 'sports':
		id=809059;
		break;
		case 'tech':
		id=809045;
		break;
		case 'travel':
		id=809051;
		break;
		case 'weather':
		id=809057;
		break;
	}
	return id;
}

function checkForBlogs()
{
	var host=window.location.host.toLowerCase();
	
			var path = window.location.toString().replace(/\.com\/test/, '.com').toLowerCase();
			path = path.replace("://", "");
			path = path.substring(path.indexOf('/')+1);
			var section = path.substring(0, path.indexOf('/'));
			
			if(host=="blogs.usatoday.com")
			{
				originalPath = host +'/' +section;
				alteredPath = host +'/'+ section;
			}
}


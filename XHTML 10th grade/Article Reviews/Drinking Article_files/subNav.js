jQuery(document).ready(function () {

    /* Add for hover intent */
    /**
    * hoverIntent r5 // 2007.03.27 // jQuery 1.1.2+
    * <http://cherne.net/brian/resources/jquery.hoverIntent.html>
    * 
    * @param  f  onMouseOver function || An object with configuration options
    * @param  g  onMouseOut function  || Nothing (use configuration options object)
    * @author    Brian Cherne <brian@cherne.net>
    */
    (function ($) { $.fn.hoverIntent = function (f, g) { var cfg = { sensitivity: 7, interval: 100, timeout: 0 }; cfg = $.extend(cfg, g ? { over: f, out: g} : f); var cX, cY, pX, pY; var track = function (ev) { cX = ev.pageX; cY = ev.pageY; }; var compare = function (ev, ob) { ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t); if ((Math.abs(pX - cX) + Math.abs(pY - cY)) < cfg.sensitivity) { $(ob).unbind("mousemove", track); ob.hoverIntent_s = 1; return cfg.over.apply(ob, [ev]); } else { pX = cX; pY = cY; ob.hoverIntent_t = setTimeout(function () { compare(ev, ob); }, cfg.interval); } }; var delay = function (ev, ob) { ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t); ob.hoverIntent_s = 0; return cfg.out.apply(ob, [ev]); }; var handleHover = function (e) { var p = (e.type == "mouseover" ? e.fromElement : e.toElement) || e.relatedTarget; while (p && p != this) { try { p = p.parentNode; } catch (e) { p = this; } } if (p == this) { return false; } var ev = jQuery.extend({}, e); var ob = this; if (ob.hoverIntent_t) { ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t); } if (e.type == "mouseover") { pX = ev.pageX; pY = ev.pageY; $(ob).bind("mousemove", track); if (ob.hoverIntent_s != 1) { ob.hoverIntent_t = setTimeout(function () { compare(ev, ob); }, cfg.interval); } } else { $(ob).unbind("mousemove", track); if (ob.hoverIntent_s == 1) { ob.hoverIntent_t = setTimeout(function () { delay(ev, ob); }, cfg.timeout); } } }; return this.mouseover(handleHover).mouseout(handleHover); }; })(jQuery);
    /* End hover intent */


    /* Check to see if override is passed in so we don't set tab and subnav off URL */
    if (typeof (override) == 'undefined') {
        currentTab = window.location.pathname.split('/');
    } else {
        var currentTab = new Array();
        currentTab[1] = override;
    }

    defaultSubNav = "";
    defaultTopNav = "";
    tabNumber = "";

    /* ------------------------------------------------------------------------------------ */
    /* Examine url pathname to determine which tab to highlight and which subnav to display */
    /* ------------------------------------------------------------------------------------ */
    var tabDisplay = "";
    if (typeof pgType != "undefined") {
        tabDisplay = currentTab[2];
    } else {
        tabDisplay = currentTab[1];
    }
    switch (tabDisplay) /*(currentTab[1])*/{
        case "index":
            if (currentTab[2] == 'blogIndex') {
                jQuery("div.logo_home").css("display", "block");
                jQuery("div.subNav_blog").css("display", "block");
                defaultSubNav = "subNav_blog";
                defaultTopNav = ".main_nav #tab8";
                tabNumber = "8";
            } else {
                jQuery("div.logo_home").css("display", "block");
                jQuery("div.subNav_yourLife").css("display", "block");
                defaultSubNav = "subNav_yourLife";
                defaultTopNav = ".main_nav #tab1";
                tabNumber = "1";
            }
            break;
        case "health":
            if (currentTab[2] == 'sleepmatters') {
                jQuery("div.logo_sleepmatters").css("display", "block");
                jQuery("div.subNav_health").css("display", "block");
                defaultSubNav = "subNav_health";
                defaultTopNav = ".main_nav #tab2";
                tabNumber = "2";
            } else {
                jQuery("div.logo_health").css("display", "block");
                jQuery("div.subNav_health").css("display", "block");
                defaultSubNav = "subNav_health";
                defaultTopNav = ".main_nav #tab2";
                tabNumber = "2";
            }
            break;
        case "fitness-food":
            jQuery("div.logo_food").css("display", "block");
            jQuery("div.subNav_food").css("display", "block");
            defaultSubNav = "subNav_food";
            defaultTopNav = ".main_nav #tab3";
            tabNumber = "3";
            break;
        case "fitness":
            jQuery("div.logo_food").css("display", "block");
            jQuery("div.subNav_food").css("display", "block");
            defaultSubNav = "subNav_food";
            defaultTopNav = ".main_nav #tab3";
            tabNumber = "3";
            break;
        case "food":
            jQuery("div.logo_food").css("display", "block");
            jQuery("div.subNav_food").css("display", "block");
            defaultSubNav = "subNav_food";
            defaultTopNav = ".main_nav #tab3";
            tabNumber = "3";
            break;
        case "parenting-family":
            if (currentTab[2] == 'familyfriends') {
                jQuery("div.logo_familyfriends").css("display", "block");
                jQuery("div.subNav_family").css("display", "block");
                defaultSubNav = "subNav_family";
                defaultTopNav = ".main_nav #tab4";
                tabNumber = "4";
            } else {
                jQuery("div.logo_family").css("display", "block");
                jQuery("div.subNav_family").css("display", "block");
                defaultSubNav = "subNav_family";
                defaultTopNav = ".main_nav #tab4";
                tabNumber = "4";
            }
            break;
        case "sex-relationships":
            jQuery("div.logo_sex").css("display", "block");
            jQuery("div.subNav_sex").css("display", "block");
            defaultSubNav = "subNav_sex";
            defaultTopNav = ".main_nav #tab5";
            tabNumber = "5";
            break;
        case "your-look":
            if (currentTab[2] == 'ownit') {
                jQuery("div.logo_ownit").css("display", "block");
                jQuery("div.subNav_yourLook").css("display", "block");
                defaultSubNav = "subNav_yourLook";
                defaultTopNav = ".main_nav #tab6";
                tabNumber = "6";
            } else if (currentTab[2] == 'beautylife') {
                jQuery("div.logo_beautylife").css("display", "block");
                jQuery("div.subNav_yourLook").css("display", "block");
                defaultSubNav = "subNav_yourLook";
                defaultTopNav = ".main_nav #tab6";
                tabNumber = "6";
            } else {
                jQuery("div.logo_yourLook").css("display", "block");
                jQuery("div.subNav_yourLook").css("display", "block");
                defaultSubNav = "subNav_yourLook";
                defaultTopNav = ".main_nav #tab6";
                tabNumber = "6";
            }
            break;
        default:
            jQuery("div.logo_home").css("display", "block");
            jQuery("div.subNav_yourLife").css("display", "block");
            defaultSubNav = "subNav_yourLife";
            defaultTopNav = ".main_nav #tab1";
            tabNumber = "1";
            break;
    }
    jQuery(".main_nav #tab" + tabNumber).css('background-color', '#6d177c');


    var valueHoverNav = "";             /* var for tab to highlight when hovering over tab or it's subNav */
    var valueSubNav = defaultSubNav;    /* var to let us know which subNav to show */


    jQuery("div.tab1").hoverIntent(function () {
        jQuery("div." + defaultSubNav).css("display", "none"); /* hide default subNav */
        jQuery("div." + valueSubNav).css("display", "none");      /* hide previously displayed subNav */
        jQuery(valueHoverNav).css('background-color', 'transparent'); /* deselect the tab for previous subNav */
        jQuery(".main_nav #tab" + tabNumber).css('background-color', '#6d177c'); /* make sure default tab remains highlighted */
        jQuery("div.subNav_yourLife").css("display", "block"); /* show subNav for yourLife */
        jQuery(".main_nav #tab1").css('background-color', '#6d177c');
        valueSubNav = "subNav_yourLife";
        valueHoverNav = ".main_nav #tab1";
    }, function () { });

    jQuery("div.tab2").hoverIntent(function () {
        //jQuery("div.tab2").mouseenter(function () {
        jQuery("div." + defaultSubNav).css("display", "none");
        jQuery("div." + valueSubNav).css("display", "none");      /* hide previously displayed subNav */
        jQuery(valueHoverNav).css('background-color', 'transparent'); /* deselect the tab for previous subNav */
        jQuery(".main_nav #tab" + tabNumber).css('background-color', '#6d177c'); /* make sure default tab remains highlighted */
        jQuery("div.subNav_health").css("display", "block");
        jQuery(".main_nav #tab2").css('background-color', '#6d177c');
        valueSubNav = "subNav_health";
        valueHoverNav = ".main_nav #tab2";
    }, function () { });

    jQuery("div.tab3").hoverIntent(function () {
        //jQuery("div.tab3").mouseenter(function () {
        jQuery("div." + defaultSubNav).css("display", "none");
        jQuery("div." + valueSubNav).css("display", "none");      /* hide previously displayed subNav */
        jQuery(valueHoverNav).css('background-color', 'transparent'); /* deselect the tab for previous subNav */
        jQuery(".main_nav #tab" + tabNumber).css('background-color', '#6d177c'); /* make sure default tab remains highlighted */
        jQuery("div.subNav_food").css("display", "block");
        jQuery(".main_nav #tab3").css('background-color', '#6d177c');
        valueSubNav = "subNav_food";
        valueHoverNav = ".main_nav #tab3";
    }, function () { });

    jQuery("div.tab4").hoverIntent(function () {
        jQuery("div." + defaultSubNav).css("display", "none");
        jQuery("div." + valueSubNav).css("display", "none");      /* hide previously displayed subNav */
        jQuery(valueHoverNav).css('background-color', 'transparent'); /* deselect the tab for previous subNav */
        jQuery(".main_nav #tab" + tabNumber).css('background-color', '#6d177c'); /* make sure default tab remains highlighted */
        jQuery("div.subNav_family").css("display", "block");
        jQuery(".main_nav #tab4").css('background-color', '#6d177c');
        valueSubNav = "subNav_family";
        valueHoverNav = ".main_nav #tab4";
    }, function () { });

    jQuery("div.tab5").hoverIntent(function () {
        jQuery("div." + defaultSubNav).css("display", "none");
        jQuery("div." + valueSubNav).css("display", "none");      /* hide previously displayed subNav */
        jQuery(valueHoverNav).css('background-color', 'transparent'); /* deselect the tab for previous subNav */
        jQuery(".main_nav #tab" + tabNumber).css('background-color', '#6d177c'); /* make sure default tab remains highlighted */
        jQuery("div.subNav_sex").css("display", "block");
        jQuery(".main_nav #tab5").css('background-color', '#6d177c');
        valueSubNav = "subNav_sex";
        valueHoverNav = ".main_nav #tab5";
    }, function () { });

    jQuery("div.tab6").hoverIntent(function () {
        jQuery("div." + defaultSubNav).css("display", "none");
        jQuery("div." + valueSubNav).css("display", "none");      /* hide previously displayed subNav */
        jQuery(valueHoverNav).css('background-color', 'transparent'); /* deselect the tab for previous subNav */
        jQuery(".main_nav #tab" + tabNumber).css('background-color', '#6d177c'); /* make sure default tab remains highlighted */
        jQuery("div.subNav_yourLook").css("display", "block");
        jQuery(".main_nav #tab7").css('background-color', '#6d177c');
        valueSubNav = "subNav_yourLook";
        valueHoverNav = ".main_nav #tab6";
    }, function () { });



    jQuery("div.subNav").mouseenter(function () {
        jQuery("div." + defaultSubNav).css("display", "none");    /* hide default subNav */
        jQuery("div." + valueSubNav).css("display", "block");     /* show subNav for current tab */
        jQuery(valueHoverNav).css('background-color', '#6d177c'); /* highlight the tab for current subNav */
    }).mouseleave(function () {
        jQuery(".main_nav #tab" + tabNumber).css('background-color', '#6d177c'); /* make sure default tab remains highlighted */
    });

    jQuery("div.all_nav").mouseleave(function () {
        jQuery("div." + valueSubNav).css("display", "none");      /* hide previously displayed subNav */
        jQuery("div." + defaultSubNav).css("display", "block");   /* show default subNav */
        jQuery(valueHoverNav).css('background-color', 'transparent'); /* deselect the tab for previous subNav */
        jQuery(".main_nav #tab" + tabNumber).css('background-color', '#6d177c'); /* make sure default tab remains highlighted */
        valueSubNav = defaultSubNav;
        valueHoverNav = "";
    });


});

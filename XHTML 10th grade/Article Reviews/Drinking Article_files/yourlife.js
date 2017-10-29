// JScript source code

var override;

// Used by header and footer to control radio button selection
function changeSearch(type) {
    if (type == 'yourlife') {
        document.footer_search_form.yourlifeB.checked = true;
        document.life_search_form.yourlife.checked = true;
    } else {
        document.footer_search_form.usatodayB.checked = true;
        document.life_search_form.usatoday.checked = true;
    }
}

function recipe_search() {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");                    // loop through query string looking for s variable

        switch (pair[0]) {
            case "q":
                if (pair[1] != "Enter+Key+Word") {
                    document.recipe_search_form.q.value = pair[1];
                }
                break;
            case "m":
                document.recipe_search_form.SR1.selectedIndex = pair[1];
                break;
            case "h":
                document.recipe_search_form.SR2.selectedIndex = pair[1];
                break;
            case "t":
                document.recipe_search_form.SR3.selectedIndex = pair[1];
                break;
            case "w":
                document.recipe_search_form.SR4.selectedIndex = pair[1];
                break;
            case "s":
                document.recipe_search_form.SR5.selectedIndex = pair[1];
                break;
            case "e":
                document.recipe_search_form.SR6.selectedIndex = pair[1];
                break;
        }
    }
}

/* Share Bar */
if (jQuery(".tShareBarCont").length > 0 && jQuery(".fArticleItem").length < 1)
    buildShareBarLinks();

/* Toggle "more" share options */
jQuery(".tShareBarCont .tShareBar li a.sMore").click(function () {
    if (jQuery(this).hasClass("sLess")) {
        jQuery(this).removeClass("sLess").html("More");
    } else {
        jQuery(this).addClass("sLess").html("Less");
    }

    jQuery(this).parents(".tShareBar").find(".sMoreList").slideToggle("slow");

    return false; // Stops any default action
});

function buildShareBarLinks() {
    // Getting URL and page title
    var storyURL = document.location.href;
    var storyTitle = document.title;

    // Building Links for individual share links
    var yBuzzURL = "http://buzz.yahoo.com/buzz?publisherurn=usatoday&guid=" + storyURL + "?csp=34";
    var mixxURL = "http://mixx.com/submit/story?page_url=" + storyURL + "partner=usat";
    var facebookURL = "http://www.facebook.com/sharer.php?u=" + storyURL + "&title=" + storyTitle;
    var twitterURL = "http://twitter.com/home?status=RT @USATODAY " + storyTitle + " " + storyURL; ;
    var farkURL = "http://cgi.fark.com/cgi/fark/farkit.pl?u=" + storyURL + "&h=" + storyTitle;
    var redditURL = "http://reddit.com/submit?url=" + storyURL + "&title=" + storyTitle;
    var diggURL = "http://digg.com/submit?phase=2&url=" + storyURL + "title=" + storyTitle;
    var myspaceURL = "http://www.myspace.com/index.cfm?fuseaction=postto&u=" + storyURL + "&t=" + storyTitle;
    var stumbleuponURL = "http://www.stumbleupon.com/submit?url=" + storyURL + "&h=" + storyTitle;
    var propellerURL = "http://www.propeller.com/story/submit/?url=" + storyURL + "&title=" + storyTitle;
    var linkedinURL = "http://www.linkedin.com/shareArticle?mini=true&url=" + storyURL + "&title=" + storyTitle + "&source=USATODAY.com";

    // Attaching href's to specific links
    var sBar = jQuery(".tShareBar");

    sBar.find(".sYBuzz").attr("href", yBuzzURL);
    sBar.find(".sMixx").attr("href", mixxURL);
    sBar.find(".sFacebook").attr("href", facebookURL);
    sBar.find(".sTwitter").attr("href", twitterURL);
    sBar.find(".sFark").attr("href", farkURL);
    sBar.find(".sReddit").attr("href", redditURL);
    sBar.find(".sDigg").attr("href", diggURL);
    sBar.find(".sMyspace").attr("href", myspaceURL);
    sBar.find(".sStumbleUpon").attr("href", stumbleuponURL);
    sBar.find(".sPropeller").attr("href", propellerURL);
    sBar.find(".sLinkedIn").attr("href", linkedinURL);
}

// replace missing image with appropriate fallback image onError
function handleImageError(img, path, size) {

    path = path.toUpperCase()

    if (size == "large"){
        file = "/images/missingPiece.jpg";
    }
    else if (size == "rect"){
        file = "/images/missingRect.jpg";
    }
    else {
        file = "/images/somethingsMissing.jpg";
    }


    if (path.match(/HEALTH/)) {
        path = "health";
    }
    else if (path.match(/FITNESS/)) {
        path = "fitness-food";
    }
    else if (path.match(/RELATIONSHIPS/)) {
        path = "sex-relationships";
    }
    else if (path.match(/MIND/)) {
        path = "mind-soul";
    }
    else if (path.match(/LIFE/)) {
        path = "index";
    }
    else if (path.match(/LOOK/)) {
        path = "your-look";
    }
    else if (path.match(/PARENTING/)) {
        path = "parenting-family";
    }
    else if (path.match(/FAMILY/)) {
        path = "parenting-family";
    }
    else if (path.match(/FOOD/)) {
        path = "recipes";
    }
    else if (path.match(/PAW/)) {
        path = "pawprintpost";
    }
    else if (path.match(/KINDNESS/)) {
        path = "kindness";
    }
    else {
        path = "search";
    }

    img.src = 'http://i.usatoday.net/yourlife/_common/' + path + file;
}

// Blog Archive Page - Control Month drop down
function selectMonth() {
    var query = window.location.search.substring(1);
    var qPosition = query.indexOf("q=");
    if (qPosition != -1) {
        var vars = query.split("=");
        var m = vars[1] - 1;
        document.months_dropdown.list.options[m].selected = true;
    }
}



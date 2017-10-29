
usatAuth.em.loginHandlers.pluckRefresh = function() {
        if (dmJQuery("#uslComments").children().length > 0) { dmJQuery("#uslComments").children().get(0).alreadyRendered = false; }
        else { document.getElementById('uslComments').innerHTML = '<pas:USAT_pluck_comments plckCommentOnKeyType="article" plckCommentOnKey="' + usat.contentID + '"></pas:USAT_pluck_comments>'; }
        pluckAppProxy.setThemeName("");
        pluckAppProxy.replaceTag("USAT_pluck_comments"); 
}

usatAuth.em.logoutHandlers.pluckRefresh = function() {
        if (dmJQuery("#uslComments").children().length > 0) { dmJQuery("#uslComments").children().get(0).alreadyRendered = false; }
        else { document.getElementById('uslComments').innerHTML = '<pas:USAT_pluck_comments plckCommentOnKeyType="article" plckCommentOnKey="' + usat.contentID + '"></pas:USAT_pluck_comments>'; }
        pluckAppProxy.setThemeName("");
        setTimeout('pluckAppProxy.replaceTag("USAT_pluck_comments")', 300);
}

function setCookie(c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value) + ";domain=.usatoday.com;path=/" +
        ((expiredays == null) ? "" : ";expires=" + exdate.toUTCString());
}
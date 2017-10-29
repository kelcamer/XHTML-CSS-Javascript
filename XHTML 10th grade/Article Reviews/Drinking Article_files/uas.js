(function ($) {
    self.usatAuth={
        // resources
        anonymousIcon: 'http://sitelife.usatoday.com/ver1.0/Content/images/no-user-image.gif',
        gigyaConf: {
            APIKey: '2_-mPkqEfEdZOZQuoa_NqVctn9y3ZmtXHCCgY5ro38tcNUia5R48niy0d1ol2VXgMh'
                , enabledProviders: 'facebook, myspace, twitter, yahoo, linkedin, google, aol, liveid'
                , useHTML: 'true'
                , showTermsLink: 'false'
                , showWhatsThis: 'true'
        },
        gigyaPath: 'http://cdn.gigya.com/js/socialize.js?apiKey=',
        cssPath: 'http://i.usatoday.net/asp/uas3/uas.css',
        pluginPath: 'http://i.usatoday.net/asp/uas3/uas.jquery.plugins.js',
        // inits
        initialSetup: function (parms) {
            usatAj.showDebug('initialSetup: ', parms);
            // use setTimeout to give page a chance to settle down
            jQuery(document).ready(function () { usatAuth.initialSetupWorker(parms) });
        },
        runHandlers: function (typ) {
            usatAj.showDebug('runHandlers: ', typ);
            var h=usatAuth.em[typ];
            for (var f in h)
                if ('function'==typeof h[f])
                    h[f]();
        },
        em: { loginHandlers: {}, logoutHandlers: {}, optionsHandlers: {}, thirdPartyHandlers: {}, readyHandlers: {} },
        initialSetupWorker: function (parms) {
            usatAj.showDebug('initialSetupWorker: ', parms);
            usatAuth.parms=jQuery.extend({}, parms||{}, usatAuth.parms||{});
            if (usatAuth.parms.debug) usatAj.Debug=usatAuth.parms.debug;
            if (!usatAuth.parms.uasPrefix)
                if (location.hostname.match(/usatin/))
                    if (location.hostname.match(/localhost/)||location.pathname.match(/\btest\b/))
                        usatAuth.parms.uasPrefix='';
                    else
                        usatAuth.parms.uasPrefix='http://'+location.hostname+'/asp/uas3/';
                else
                    usatAuth.parms.uasPrefix='http://content.usatoday.com/asp/uas3/';
            usatAuth.setDefault('doRegister', usatAuth.parms.uasPrefix+'uasDoRegister.ashx'); // ?query in url should not be used
            usatAuth.setDefault('doProfile', 'http://sitelife.usatoday.com/ver1.0/Persona/PersonaProfileSubmit'); // originally had ?plckUserId=<id>&sid=
            usatAuth.setDefault('doSignIn', usatAuth.parms.uasPrefix+'uasDoSignIn.ashx');
            usatAuth.setDefault('doGigyaSignIn', usatAuth.parms.uasPrefix+'uasDoSignIn.ashx');
            usatAuth.setDefault('doEdit', usatAuth.parms.uasPrefix+'uasDoEdit.ashx');
            usatAuth.setDefault('doDelete', usatAuth.parms.uasPrefix+'uasDoDelete.ashx');
            usatAuth.setDefault('doConvert', usatAuth.parms.uasPrefix+'uasDoConvert.ashx');
            usatAuth.setDefault('doNotConvert', usatAuth.parms.uasPrefix+'uasNotUpdating.ashx');
            usatAuth.setDefault('forgotPassword', 'http://content.usatoday.com/asp/uas/urLogInReminder.ashx');
            usatAuth.setDefault('checkHandle', usatAuth.parms.uasPrefix+'uas-check-handle.ashx');
            usatAuth.setDefault('checkEmail', usatAuth.parms.uasPrefix+'uas-check-email.ashx');
            usatAuth.setDefault('postZag', 'http://content.usatoday.com/registration/zagito5/postzagito.ashx');
            usatAuth.updateCookie();
            var check=!usatAuth.parms.again&&usatAuth.signedIn()&&usatAuth.usatinfo.BrowserTimeout<new Date().getTime();
            // write UAS into 1 of 3 different locations on the page. If the first selector is not defined, try the next
            usatAuth.controlElements=jQuery('#regAnchor').parent();
            if (!usatAuth.controlElements.length) usatAuth.controlElements=jQuery('#USATRegister');
            if (!usatAuth.controlElements.length) usatAuth.controlElements=jQuery('.uasControlElement');
            jQuery(document).ready(function () {
                usatAj.showDebug('initialSetupWorker\'s document.ready ', parms);
                // 'this' gets a new definition here
                usatAuth.getControlBlock(1);
            });
        },
        getControlBlock: function (initialize) {
            usatAj.showDebug('getControlBlock: ', initialize);
            var controlBlock=usatAuth.parms.uasPrefix+(usatAuth.signedIn()?'uasSignedIn.htm':'uasSignedOut.htm');
            usatAuth.controlElements.each(function (j) {
                usatAj.ahah(this, null, controlBlock, function () { if (initialize) usatAuth.runHandlers('readyHandlers') });
            });
        },
        setDefault: function (name, val) {
            usatAj.showDebug('setDefault: ', name, val);
            if (!usatAuth.parms[name]) usatAuth.parms[name]=val;
        },
        activateElements: function () {
            usatAj.showDebug('activateElements: ');
            usatAuth.loadAvatar();
            usatAuth.loadDependencies();
        },
        // status
        getAuthStatus: function () {
            usatAj.showDebug('getAuthStatus [placeholder]');
        },
        signedIn: function () {
            usatAj.showDebug('signedIn: ');
            return 'Signed In'==usatAuth.usatinfo.Status;
        },
        login: function (callback) {
            if (!callback) callback=function () { };
            if (usatAuth.signedIn())
                callback(usatAuth.usatinfo);
            else {
                usatAuth.em.loginHandlers.usatAuthLogin=function () {
                    callback(usatAuth.usatinfo);
                    delete usatAuth.em.loginHandlers.usatAuthLogin;
                }
                jQuery('a.uasSignIn:first').click();
            }
        },
        updateCookie: function (changes) {
            usatAj.showDebug('updateCookie: ', changes);
            var bcompat={ Handle: usatAuth.noop, Status: usatAuth.noop };
            var bcomprd={ Handle: unescape, Status: unescape };
            var info=usatAuth.cookie('USATINFO')
            usatAuth.usatinfo=info==null?{}:usatAuth.nameValuePairs(usatAuth.cookie('USATINFO'));
            if (usatAuth.usatinfo.Status=='Signed+In') {
                usatAuth.usatinfo.Status='Signed In';  // compensate for backwards compatability
                if (!changes) changes={ Status: 'Signed In' }; else changes.Status='Signed In';
            }
            usatAj.showDebug('cookie value: '+usatAuth.cookie('USATINFO'));
            if (changes) {
                usatAj.showDebug('usatinfo was: '+usatAuth.nameValuePairs(usatAuth.usatinfo, bcompat));
                // usatAuth.usatinfo= jQuery.extend(usatAuth.usatinfo, changes);
                for (var nm in changes) {
                    usatAj.showDebug('changing '+nm+' to '+changes[nm]);
                    if (null===changes[nm])
                        delete usatAuth.usatinfo[nm]; // work around bug in /travel/flights/item.aspx
                    else
                        usatAuth.usatinfo[nm]=changes[nm];
                }
                usatAj.showDebug('usatinfo is: '+usatAuth.nameValuePairs(usatAuth.usatinfo, bcompat));
                usatAuth.cookie('USATINFO', usatAuth.nameValuePairs(usatAuth.usatinfo, bcompat), { expires: 365 });
                /*
                * USATINFO fields:
                *   Status: {'Signed In', 'Signed Out'},
                *   RememberMe: {'Y', 'N'},
                *   UserID: {system assigned guid or blank if not signed in}
                */
            }
            return usatAuth.usatinfo;
        },
        doConvert: function (convert) {
            usatAj.showDebug('doConvert: ', convert);
            usatAuth.parms.converted=convert;
            if (convert) {
                usatAj.showDebug('pajax: ', usatAuth.parms.doConvert);
                var data=jQuery('form.uas_signin_screen_form').serialize().replace(/\w+=(\&|$)/g, '').replace(/\&$/, '');
                usatAj.pajax(usatAuth.parms.doConvert, data, function (txt) {
                    usatAj.showDebug('doConvert\'s pajax callback');
                    usatAuth.updateCookie({ conv: 'y' });
                    jQuery.colorbox.close();
                }, function () { usatAuth.errorNotify('failed to contact web server to upgrade your upgrade your credentials') });
            } else {
                usatAj.showDebug('pajax: ', usatAuth.parms.doConvert);
                usatAj.pajax(usatAuth.parms.doNotConvert, 'uu='+encodeURIComponent(usatAuth.nameValuePairs(usatAuth.usatinfo)), function (txt) {
                    usatAj.showDebug('doConvert\'s "not updating" ajax callback');
                    usatAuth.updateCookie({ conv: 'n' });
                    jQuery.colorbox.close();
                }, function () { usatAuth.errorNotify('failed to contact web server to prevent future questions like this') });
            }
        },
        doSignOut: function () {
            usatAuth.updateCookie({ Status: 'Signed Out', UserID: null, Identity: null });
            usatAuth.cookie('SLPERSIST', null);
            usatAuth.getControlBlock();
            usatAuth.runHandlers('logoutHandlers');
            return false;
        },
        forgotPassword: function (email) {
            usatAj.ajax(usatAuth.parms.forgotPassword+'?Rand='+new Date().getTime()+'&LoginEmail='+email,
                usatAuth.errorNotify,
                function () { usatAuth.errorNotify("Oops, we are having a problem, please try again later.") }
            );
        },
        enableLinks: function () {
            usatAj.showDebug('enableLinks: ');
            usatAuth.retrieve('a.uasRegister', 'uasRegister.aspx', undefined, 'showRegisterForm');
            usatAuth.retrieve('a.uasSignIn', 'uasSignIn.aspx', undefined, 'showLoginForm');
            usatAuth.retrieve('a.uasOptions', 'uasOptionsOld.htm');
            jQuery('a.uasSignOut').unbind('click').click(usatAuth.doSignOut);
            usatAuth.retrieve('a.uasConvert', 'uasConvert.htm');
            if (!usatAuth.usatinfo.conv&&jQuery("#uas_screen5").length<1/*&&Math.floor(Math.random()*11)==0*/) {
                setTimeout(function () {
                    jQuery('a.uasConvert').trigger('click');
                }, 2000);
            }
        },
        loadDependencies: function () {
            if (!self.loadedDependencies) {
                jQuery("head").append('<link rel="stylesheet" href="'+usatAuth.cssPath+'" type="text/css" />');
                // some versions of jQuery 1.4 do not bust cache on getScript (busts cache in 1.3 and below)
                // only causes a problem in IE, so setting cache to false explicitly
                $.ajax({
                    type: "GET",
                    url: usatAuth.gigyaPath+usatAuth.gigyaConf.APIKey,
                    success: function(){
                        gigya.services.socialize.addEventHandlers(usatAuth.gigyaConf, {
                            onLogin: function (gigyaObject) {
                                usatAuth.GigyaCallback(gigyaObject);
                            }
                        });
                        jQuery.getScript(usatAuth.pluginPath, function () {
                            setTimeout(function () {
                                usatAuth.enableLinks();
                                loadedDependencies=1;
                            }, 500);
                        });
                    },
                    dataType: "script",
                    cache: false
                });
            }
            else {
                usatAuth.enableLinks();
            }
        },
        retrieve: function (target, contentUrl, config, emLabel) {
            usatAj.showDebug('retrieve: ', target, contentUrl, config);
            var conf= jQuery.extend({}, {
                width: 532,
                initialWidth: 532,
                initialHeight: 532,
                maxHeight: 532,
                height: 532,
                html: '<div id="simplemodal-wrap"><!--CONTENT GOES HERE--></div>',
                close: '',
                opacity: 0.85,
                onLoad: function () { },
                onComplete: function () {
                    usatAj.showDebug('retrieve\'s click\s onClose callback for ', target, contentUrl, config);
                    usatAj.ahah(jQuery('#simplemodal-wrap')[0], null, usatAuth.parms.uasPrefix+contentUrl);
                    usatAuth.em.thirdPartyHandlers={};
                    usatAuth.modalOpen=1;
                },
                onClose: function (dialog) {
                    usatAj.showDebug('retrieve\'s click\s onClose callback for ', target, contentUrl, config);
                    usatAuth.modalOpen=0;
                    jQuery.colorbox.close();
                    usatAuth.em.thirdPartyHandlers={};
                }
            }, config||{});
            jQuery(target).colorbox(conf);
            if (emLabel) usatAuth.em[emLabel]= function() {jQuery.colorbox(conf)};
        },
        modalOpen: 0,
        // cookie and parameter support
        cookie: function (name, value, options) {
            usatAj.showDebug('cookie: ', name, value, options);
            if ('undefined'==typeof value) { // get
                if (!(' '+document.cookie).match(new RegExp(' '+name+'=([^;]*)')))
                    return null;
                return decodeURIComponent(RegExp.$1);
            } else { // set
                options=options||{};
                if (null==value) options.expires= -1;
                var expires='';
                if (options.expires) {
                    var date=options.expires;
                    if ('number'==typeof options.expires)
                        date=new Date(new Date().setTime(new Date().getTime()+options.expires*24*60*60*1000));
                    expires='; expires='+date;
                }
                var path='; path='+(options.path||'/');
                var domain='; domain='+(options.domain||'.usatoday.com');
                var secure=options.secure?'secure':'';

                usatAj.showDebug('document.cookie was '+document.cookie.replace(/; /g, ';\n\t . . . . '));
                usatAj.showDebug('document.cookie= '+(document.cookie=[name, '=', encodeURIComponent(value), expires, path, domain, secure].join('')));
                usatAj.showDebug('document.cookie has become '+(document.cookie+'').replace(/; /g, ';\n\t . . . . '));
            }
        },
        noop: function (y) { return y },
        nameValuePairs: function (pairs, backcompat) {
            usatAj.showDebug('nameValuePairs: ', pairs, backcompat);
            if ('object'==typeof pairs) {
                var r=[];
                if (backcompat) switch (typeof backcompat) {
                    case 'object':
                        for (var name in pairs)
                            if (name in backcompat)
                                r.push(encodeURIComponent(name), '=', backcompat[name](pairs[name]), '&');
                            else
                                r.push(encodeURIComponent(name), '=', encodeURIComponent(pairs[name]), '&');
                        break;
                    case 'function':
                        for (var name in pairs)
                            r.push(encodeURIComponent(name), '=', backcompat(pairs[name]), '&');
                        break;
                    default:
                        for (var name in pairs)
                            r.push(encodeURIComponent(name), '=', pairs[name], '&');  // some old code did not do any encoding on usatinfo name value pairs
                } else
                    for (var name in pairs)
                        r.push(encodeURIComponent(name), '=', encodeURIComponent(pairs[name]), '&');
                r.pop();
                return r.join('');
            } else if ('string'==typeof pairs) {
                var r={};
                var list=pairs.split('&');
                if (backcompat) switch (typeof backcompat) {
                    case 'object':
                        for (var j=0; j<list.length; j++) {
                            var pair=list[j].split('=')
                            if (2==pair.length)
                                if (pair[0] in backcompat)
                                    r[decodeURIComponent(pair[0])]=backcompat[pair[0]](pair[1]);
                                else
                                    r[decodeURIComponent(pair[0])]=decodeURIComponent(pair[1]);
                        }
                        break;
                    case 'function':
                        for (var j=0; j<list.length; j++) {
                            var pair=list[j].split('=')
                            if (2==pair.length)
                                r[decodeURIComponent(pair[0])]=backcompat(pair[1]);
                        }
                        break;
                    default:
                        for (var j=0; j<list.length; j++) {
                            var pair=list[j].split('=')
                            if (2==pair.length)
                                r[decodeURIComponent(pair[0])]=pair[1];
                        }
                } else
                    for (var j=0; j<list.length; j++) {
                        var pair=list[j].split('=')
                        if (2==pair.length)
                            r[decodeURIComponent(pair[0])]=decodeURIComponent(pair[1]);
                    }
                return r;
            }
        },
        // avatar
        loadAvatar: function (signin) {
            usatAj.showDebug('loadAvatar: ', signin);
            usatAuth.updateCookie();
            if (signin) {
                usatAuth.cookie('SLPERSIST', null);
                usatAj.showDebug('1: '+usatAuth.usatinfo.Status)
                usatAuth.updateCookie();
                usatAj.showDebug('2: '+usatAuth.usatinfo.Status)
            }
            var handle=''
            var handle0=usatAuth.usatinfo.Handle;
            if (handle0) handle=handle0.replace(/\+/g, ' ');
            if (handle!=handle0) usatAuth.updateCookie({ Handle: handle });
            var userID=usatAuth.usatinfo.UserID;
            var identity='uas'==usatAuth.usatinfo.AuthType?null:usatAuth.usatinfo.Identity;
            if ('Signed In'==usatAuth.usatinfo.Status&&userID) {
                usatAuth.sitelife(userID, identity, function (sl) {
                    usatAj.showDebug('loadAvatar\'s sitelife callback', signin);
                    var profileUrl=(self.usl&&usl.personalUrl)||'http://www.usatoday.com/community/profile.htm';
                    var personaUrl=profileUrl+(sl.PID?'?UID='+sl.PID:'');
                    var messageUrl=profileUrl+'?plckPersonaPage=PersonaMessages';
                    jQuery('.uasAvtPhoto').html('<a href="'+personaUrl+'" border="0"><img src="'+sl.ICON+'" alt="User Image" width="58" height="58" /></a>');
                    jQuery('.uasAvtHandle').html('<a href="'+personaUrl+'"><b>'+handle+'</b></a>');
                    if (sl.PID)
                        jQuery('.uasAvtMsgs').html('<a href="'+messageUrl+'">'+sl.MSGS+' messages</a>');
                });
            } else {
                jQuery('.uasAvtPhoto').html('<img src="'+usatAuth.anonymousIcon+'" />');
                jQuery('.uasAvtMsgs').html('');
            }
        },
        sitelife: function (guid, identity, callback) {
            usatAj.showDebug('sitelife: ', guid, identity, callback);
            var slpersist=usatAuth.cookie('SLPERSIST');
            if (slpersist)
                callback(usatAuth.nameValuePairs(slpersist));
            else {
                var guid=guid.replace(/-/g, '');
                var pid='';
                if (!identity)
                    for (var j=0; j<32; j+=2)
                        pid+=((parseInt(guid.charAt(j), 16)+parseInt(guid.charAt(j+1), 16))%16).toString(16);
                else
                    pid=identity;
                var req='jsonRequest={"UniqueId":8,"Requests":[{"UserKey":{"Key":"'+pid+'"}}]}';
                usatAj.pajax('http://sitelife.usatoday.com/ver1.0/Direct/Process', req, function (porkjson) {
                    usatAj.showDebug('sitelife\s pajax callback', guid, identity, callback);
                    /* atomic fields available:
                    Message, MessageTime, AvatarPhotoUrl, LastUpdated, LastUpdated_UTC, Age, Sex, AboutMe,
                    Location, NumberOfRecommendations, NumberOfMessages, NumberOfFriends, NumberOfPendingFriends,
                    MessagesOpenToEveryone, PersonaPrivacyMode, DateOfBirth, DateOfBirth_UTC, CommentsTabVisible,
                    PhotosTabVisible, IsEmailNotificationsEnabled, SelectedStyleId, Signature, CurrentUserRecommendedProfile,
                    CurrentUserHasReportedAbuse, Key, DisplayName, Email, UserTier, AdministrativeTier, ImageUrl,
                    PersonaUrl, IsBlocked
                    */
                    var decoded=unescape(porkjson);
                    var custom=decoded.match(/"ImageUrl":"([^"]*)"/);
                    var icon=RegExp.$1||usatAuth.anonymousIcon;
                    decoded.match(/"NumberOfMessages":"([^"]*)"/);
                    var msgs=RegExp.$1;
                    var SLPERSIST=custom?{
                        PID: pid,
                        ICON: icon,
                        MSGS: msgs
                    } /*icon was not customized*/:{
                        ICON: usatAuth.anonymousIcon
                    };
                    usatAuth.cookie('SLPERSIST', usatAuth.nameValuePairs(SLPERSIST), { expires: 1/(24*6) });
                    callback(SLPERSIST);
                }, function () { usatAuth.errorNotify('failed to contact web server to get your icon') });
            }
        },
        // support
        errorNotify: function (msg, sel) {
            usatAj.showDebug('errorNotify: ', msg);
            if (msg.length>255) msg='Oops, we are having problems. Please try again later.';

            if (sel===undefined) {
                sel=jQuery('#uasWarning');
                if (!sel.length) {
                    jQuery('body').prepend('<div id="uasWarning" class="uas_error_notification"></div>');
                    sel=jQuery('#uasWarning');
                }
                var warntimer=setTimeout(function () {
                    sel.trigger('click');
                }, 4000);
                sel.html(msg)
                    .animate({ height: sel[0].scrollHeight }, 400)
                    .click(function () {
                        clearTimeout(warntimer);
                        sel.animate({ height: '0' }, 400);
                    });
            }
            else {
                jQuery(sel).html(msg);
            }
        },
        require: function (globalName, scriptUrl) {
            usatAj.showDebug('require: ', globalName, scriptUrl);
            if ('undefined'==typeof self[globalName])
                usatAj.addNode(jQuery('head')[0], 'script', '', { src: scriptUrl, type: 'text/javascript' }, 0);
        },
        breakpoint: function () {
            usatAj.showDebug('breakpoint: ');
            var rationale='current javascript debuggers have problems with dynamically added javascript';
            rationale='but if they call into a statically defined function, like this';
            rationale='we can set a breakpoint here, thus allowing some minor debugging';
        },
        objectString: function (obj, prefix) {
            usatAj.showDebug('objectString: ', obj, prefix);
            // FIXME -- deal with obj= {a:[]}
            var pfx=prefix||''
            var t=''
            var w=0
            for (var p in obj) if (w<(p+'').length) w=p.length
            var sep=''
            for (var p in obj) {
                t+=sep+p+': '+Array(1+w-(p+'').length).join(' ')
                if ('object'==typeof obj[p]) t+=usatAuth.objectString(obj[p], pfx+Array(3+w).join(' '))
                else t+=obj[p]
                sep='\n'+pfx
            }
            return t
        },
        signinDoUasSignIn: function () {
            usatAj.showDebug('signinDoUasSignIn: ');
            jQuery("#uas_navigation").append('<span class="loading"></span>');
            var data=jQuery('#uas_signin_screen_form').serialize().replace(/\w+=(\&|$)/g, '').replace(/\&$/, '');
            data+= '&cachedefeat='+new Date().getTime();
            usatAj.ajax(usatAuth.parms.doSignIn+'?'+data, function (txt) {
                usatAj.showDebug('signinDoUasSignIn\'s ajax callback');
                eval(txt);
                jQuery("#uas_navigation").find(".loading").remove();
                /*if (usatAuth.signedIn())
                usatAuth.runHandlers('loginHandlers');*/
            }, function () { usatAuth.errorNotify('failed to contact web server to sign you in') });
        },
        // callbacks
        UasRegistrationCallback: function (response) {
            // currently done in uasRegister
        },
        SignInCallback: function (response) {
            var signedIn=true;
            usatAj.showDebug('signinDoUasSignIn\'s usatAuth.SignInCallback');
            if (response.success) {
                usatAuth.updateCookie({ Status: 'Signed In' });
                jQuery.colorbox.close();
                usatAuth.em.thirdPartyHandlers={};
                usatAuth.getControlBlock();
                /////////// moved from signinDoUasSignIn. webkit test
                usatAuth.runHandlers('loginHandlers');

            } else {
                usatAuth.updateCookie({ Status: 'Signed Out' });
                signedIn=false;
                if (response.authType=="uas") {
                    usatAuth.errorNotify(response.message, "#uas_signin_failure");
                }
            }
            return signedIn;
        },
        FormElementDefaults: function (override, pairs) {
            for (var key in pairs) {
                var it=jQuery('#'+key);
                var val=pairs[key];

                if (val&&val!='0') {
                    if (override||!it.val()) {
                        it.val(val);
                    }
                }
            }
        },
        GigyaRegisterCallback: function (gigyaObject) {
            usatAj.showDebug('GigyaRegisterCallback: ', gigyaObject);
            var nick=gigyaObject.user.nickname||gigyaObject.user.loginProviderUID.replace(/http:\/\/.*\/(..*)/, RegExp.$1);
            usatAuth.FormElementDefaults(true, {
                uas_username: nick // +' ('+gigyaObject.provider+')'
                , uas_email: gigyaObject.user.email
                , uas_birthyear: gigyaObject.user.birthYear
                , uas_country: gigyaObject.user.country
                , uas_gender: gigyaObject.user.gender
                , uas_zip: gigyaObject.user.zip
            });
            usatAuth.FormElementDefaults(true, {
                uas_authtype: gigyaObject.provider,
                uas_g_u_id: gigyaObject.UID,
                uas_g_signature: gigyaObject.signature,
                uas_g_timestamp: gigyaObject.timestamp
            });
            usatAuth.runHandlers('thirdPartyHandlers');
        },
        GigyaLoginCallback: function (gigyaObject) {
            usatAj.showDebug('GigyaLoginCallback: ', gigyaObject);
            usatAuth.updateCookie({
                Email: gigyaObject.user.email
                , Status: 'Signed Out'
                , RememberMe: 'Y'
                , UserID: ''
                , BrowserTimeout: new Date().getTime()
                , AuthType: gigyaObject.provider
            });
            var data=usatAuth.nameValuePairs({
                uas_authtype: gigyaObject.provider,
                uas_g_u_id: gigyaObject.UID,
                uas_g_signature: gigyaObject.signature,
                uas_g_timestamp: gigyaObject.timestamp,
                uas_email: gigyaObject.user.email
            });
            // usatAj.pajax(usatAuth.parms.doGigyaSignIn, data, usatAuth.UasFromGigyaLoginCallback);
            usatAj.pajax(usatAuth.parms.doSignIn, data, function (txt) {
                usatAj.showDebug('GigyaLoginCallback\'s pajax callback');
                var isRegistered=eval(txt);
                if (!isRegistered) {
                    jQuery("#uasSigninToRegister").trigger("click");
                    usatAuth.GigyaLoginToRegister(gigyaObject);
                }
		/* not needed: on successful signin, pajax will have run usatAuth.SignInCallback()
                else if (usatAuth.signedIn())
                    usatAuth.runHandlers('loginHandlers');
		    */
            }, function () { usatAuth.errorNotify('failed to contact web server to sign you in with '+gigyaObject.provider) });
            jQuery('#uas_rememberme').val(0); // try to let user know that we are ignoring rememberme for partner authentication
            usatAuth.runHandlers('thirdPartyHandlers');
        },
        GigyaLoginToRegister: function (gigyaObject) {
            var oid=jQuery("#oid_option");
            setTimeout(function () {
                if (oid.length>0) {
                    usatAuth.GigyaRegisterCallback(gigyaObject);
                }
                else {
                    usatAuth.GigyaLoginToRegister(gigyaObject);
                }
            }, 500);
        },
        GigyaConvertCallback: function (gigyaObject) {
            usatAj.showDebug('GigyaConvertCallback: ', gigyaObject);
            var nick=gigyaObject.user.nickname||gigyaObject.user.loginProviderUID.replace(/http:\/\/.*\/(..*)/, RegExp.$1);
            var data=usatAuth.nameValuePairs({
                uas_authtype: gigyaObject.provider,
                uas_g_u_id: gigyaObject.UID,
                uas_g_signature: gigyaObject.signature,
                uas_g_timestamp: gigyaObject.timestamp,
                uas_email: gigyaObject.user.email
            });

            usatAuth.FormElementDefaults(true, {
                uas_authtype: gigyaObject.provider,
                uas_g_u_id: gigyaObject.UID,
                uas_g_signature: gigyaObject.signature,
                uas_g_timestamp: gigyaObject.timestamp,
                uas_userid: usatAuth.usatinfo.UserID
            });

            usatAuth.doConvert(true);

            jQuery('#uas_rememberme').val(0); // try to let user know that we are ignoring rememberme for partner authentication
            usatAuth.runHandlers('thirdPartyHandlers');
        },
        UasFromGigyaLoginCallback: function (txt) {
            usatAj.showDebug('UasFromGigyaLoginCallback: ', txt);
            var response=eval(txt);
            usatAuth.updateCookie();
            if (response.success) {
                usatAuth.updateCookie({ Status: 'Signed In' });
                usatAuth.runHandlers('loginHandlers');
                usatAuth.em.thirdPartyHandlers={};
                jQuery.colorbox.close();
                usatAuth.em.thirdPartyHandlers={};
                usatAuth.getControlBlock();
            } else {
                usatAuth.errorNotify(response.message, "#uas_signin_failure");
            }
        },
        signinSendPasswordReminder: function () {
            usatAj.showDebug('signinSendPasswordReminder: ');
            /* Send password reminder: Check login credentials. */
            jQuery("userMessage").innerHTML="";
            reminderEmail=jQuery("LoginEmail").value;

            /* Send reminder email */
            jQuery("userMessage").style.display="block";
            urAhah("urLogInReminder.ashx?Rand="+new Date().getTime()+"&LoginEmail="+reminderEmail, 'userMessage', 'Sending reminder...', usatAuth.signinPasswordReminderWasSent);
            return false;
        },
        signinPasswordReminderWasSent: function (responseData) {
            usatAj.showDebug('signinPasswordReminderWasSent: ', responseData);
            if (responseData=="Reminder email sent.") {
                urAhah("urMsgEmailPwd.htm", 'USATRegister', null, function () { rogueFlashHack(1); });
            }
        },
        signinRegisterEventHandlers: function () {
            usatAj.showDebug('signinRegisterEventHandlers: ');
            // set up event handlers on signin form
            jQuery("#colorbox .simplemodal-close").click(function () {
                usatAj.showDebug('signinRegisterEventHandlers .simplemodal-close click event handler');
                jQuery.colorbox.close();
                usatAuth.em.thirdPartyHandlers={};
                return false;
            });
            jQuery('#uas_password').keypress(function (e) {
                if (e.which==13) {
                    e.preventDefault();
                    jQuery(this).blur();
                    jQuery('#uas_uas_signin').focus().click();
                }
            });
            jQuery("#uas_uas_signin").click(function () {
                jQuery("#uas_signin_screen_form").submit();
                return false;
            });
            jQuery("#uas_signin_screen_form").submit(function () {
                var email=jQuery('#uas_email');

                if (!email.val().match(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/)) {
                    usatAuth.errorNotify("Please enter a valid email address", "#uas_signin_failure");
                    email.focus();
                }
                else if (jQuery('#uas_password').val()=='') {
                    usatAuth.errorNotify("Please enter a password", "#uas_signin_failure");
                }
                else {
                    usatAuth.signinDoUasSignIn();
                }
                return false;
            });
            usatAuth.retrieve('#uasSigninRegister', 'uasRegister.aspx');
            usatAuth.retrieve('#uasSigninToRegister', 'uasRegister.aspx?signin=1');
        },
        postZag: function (zagData) {
            var data=usatAuth.nameValuePairs(zagData);
            var gender=0;
            if (data.uas_gender.match(/f/i)) {
                gender=1;
            }
            var formatted={
                cou: data.uas_country,
                fem: gender,
                ind: data.uas_industry,
                job: data.uas_jobtitle,
                siz: data.uas_jobsize,
                yob: data.uas_birthyear,
                zip: data.uas_zip,
                gdt: 0
            }
            usatAj.ajax(usatAuth.parms.postZag+'?'+jQuery.param(formatted), function () { });
        },
        end: {}
    };
})(jQuery);

if(typeof PageManager=="undefined"){if(typeof Array.prototype.forEach=="undefined"){Array.prototype.forEach=function(b){var a=this.length;if(typeof b!="function"){throw new TypeError()}var d=arguments[1];for(var c=0;c<a;c++){if(!(c in this)){continue}b.call(d,this[c],c,this)}}}var PageManager=function(){this.publisher_id=null;this.item_id=null;this.page_id=null;this.state={};this.stateStack=[];var a=this;var r=0;var y="";var e=8;function m(z){return l(g(x(z),z.length*e))}function k(z){return p(g(x(z),z.length*e))}function f(z){return v(g(x(z),z.length*e))}function d(z,A){return l(h(z,A))}function i(z,A){return p(h(z,A))}function o(z,A){return v(h(z,A))}function b(){return m("abc")=="a9993e364706816aba3e25717850c26c9cd0d89d"}function g(M,G){M[G>>5]|=128<<(24-G%32);M[((G+64>>9)<<4)+15]=G;var N=Array(80);var L=1732584193;var K=-271733879;var J=-1732584194;var I=271733878;var H=-1009589776;for(var D=0;D<M.length;D+=16){var F=L;var E=K;var C=J;var B=I;var z=H;for(var A=0;A<80;A++){if(A<16){N[A]=M[D+A]}else{N[A]=q(N[A-3]^N[A-8]^N[A-14]^N[A-16],1)}var O=t(t(q(L,5),w(A,K,J,I)),t(t(H,N[A]),n(A)));H=I;I=J;J=q(K,30);K=L;L=O}L=t(L,F);K=t(K,E);J=t(J,C);I=t(I,B);H=t(H,z)}return Array(L,K,J,I,H)}function w(A,z,C,B){if(A<20){return(z&C)|((~z)&B)}if(A<40){return z^C^B}if(A<60){return(z&C)|(z&B)|(C&B)}return z^C^B}function n(z){return(z<20)?1518500249:(z<40)?1859775393:(z<60)?-1894007588:-899497514}function h(B,E){var D=x(B);if(D.length>16){D=g(D,B.length*e)}var z=Array(16),C=Array(16);for(var A=0;A<16;A++){z[A]=D[A]^909522486;C[A]=D[A]^1549556828}var F=g(z.concat(x(E)),512+E.length*e);return g(C.concat(F),512+160)}function t(z,C){var B=(z&65535)+(C&65535);var A=(z>>16)+(C>>16)+(B>>16);return(A<<16)|(B&65535)}function q(z,A){return(z<<A)|(z>>>(32-A))}function x(C){var B=Array();var z=(1<<e)-1;for(var A=0;A<C.length*e;A+=e){B[A>>5]|=(C.charCodeAt(A/e)&z)<<(32-e-A%32)}return B}function v(B){var C="";var z=(1<<e)-1;for(var A=0;A<B.length*32;A+=e){C+=String.fromCharCode((B[A>>5]>>>(32-e-A%32))&z)}return C}function l(B){var A=r?"0123456789ABCDEF":"0123456789abcdef";var C="";for(var z=0;z<B.length*4;z++){C+=A.charAt((B[z>>2]>>((3-z%4)*8+4))&15)+A.charAt((B[z>>2]>>((3-z%4)*8))&15)}return C}function p(C){var B="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";var E="";for(var A=0;A<C.length*4;A+=3){var D=(((C[A>>2]>>8*(3-A%4))&255)<<16)|(((C[A+1>>2]>>8*(3-(A+1)%4))&255)<<8)|((C[A+2>>2]>>8*(3-(A+2)%4))&255);for(var z=0;z<4;z++){if(A*8+z*6>C.length*32){E+=y}else{E+=B.charAt((D>>6*(3-z))&63)}}}return E}String.prototype.lsplit=function(A,z){var B=this.split(A);return B.slice(0,z-1).concat(B.length>=z?B.slice(z-1).join(A):[])};function c(){this.getValue=function(z){return null};this.setValue=function(z,A){};return this}function u(){this.getValue=function(z){return window.localStorage.getItem(z)};this.setValue=function(z,A){try{window.localStorage.setItem(z,A)}catch(B){}};return this}function s(){var C="trc_cookie_storage";var G=new Object();var A=document.cookie.split(/;\s+/);for(var D=0;D<A.length;D++){var F=A[D].lsplit("=",2);var H=unescape(F[0]),z=unescape(F[1]);if(H==C){var I=z.split("|");for(var B=0;B<I.length;B++){var F=I[B].split("=");G[unescape(F[0])]=unescape(F[1])}break}}function E(){var K=new Array();for(var L in G){if(G.hasOwnProperty(L)&&G[L]!=null){K[K.length]=escape(L)+"="+escape(G[L])}}var J=new Date(new Date().getTime()+(365*86400000));document.cookie=C+"="+escape(K.join("|"))+";path=/;expires="+J.toUTCString()}this.getValue=function(J){return G.hasOwnProperty(J)?G[J]:null};this.setValue=function(J,K){G[J]=K;E()};return this}function j(A){if(!A){throw new Error("Invalid URL!")}this.href=A;var z=A.lsplit("#",2);this.hash=(z.length>1)?"#"+z.pop():"";A=z[0];z=A.lsplit("?",2);this.search=(z.length>1)?"?"+z.pop():"";A=z[0];z=A.lsplit("://",2);this.protocol=(z.length>1)?z.shift()+":":"";A=z[0];z=A.lsplit("/",2);this.pathname=(z.length>1)?"/"+z.pop():"/";A=z[0];z=A.lsplit("@",2);this.auth=(z.length>1)?z.shift():"";A=z[0];z=A.lsplit(":",2);this.port=(z.length>1)?parseInt(z.pop()):0;this.host=z[0];this.toString=function(){return this.protocol+"//"+(this.auth?this.auth+"@":"")+this.host+(this.port?":"+this.port:"")+this.pathname+this.search};return this}this.getLocalStorageImplemenation=function(){if(this.state.privateStorageImpl!=null){return this.state.privateStorageImpl}try{if(window.localStorage instanceof Storage){return this.state.privateStorageImpl=new u()}}catch(z){}try{if(document.cookie){return this.state.privateStorageImpl=new s()}}catch(z){}return this.state.privateStorageImpl=new c()};this.trcParseParams=function(C){if(!C||a.item_id){return}var B=C.split("&");for(var z=0;z<B.length;z++){var A=B[z].lsplit("=",2);switch(unescape(A[0])){case"item_id":a.item_id=unescape(A[1]);break;case"publisher_id":a.publisher_id=unescape(A[1]);break}}};this.trcGetPublisherParams=function(){var z=document.getElementsByTagName("script");for(var C=0;C<z.length;C++){var B=z[C].src.split("taboolasyndication.com/libtrc/")[1];if(B){if(z[C].src.search(/taboolasyndication.com.*page_management/)>=0){B=B.split("?")[0];var A=B.split("/");a.page_id=A[0];if(A.length>2){a.page_id+="/"+A[1]}a.trcParseParams(z[C].src.split("?")[1])}}}};this.getPageData=function(){if(a.page_id!=null){return a.page_id}var z=Array.prototype.slice.call(arguments);if((z.length<2)&&(a.page_id==null)){a.trcGetPublisherParams();a.page_id=m(window.location.href+a.publisher_id+a.item_id);return a.page_id}if(z[1]!=null){a.publisher_id=z[1]}if(z[0]!=null){a.item_id=z[0];if(a.page_id==null){a.page_id=m(window.location.href+a.publisher_id+a.item_id)}return a.page_id}else{return null}};this.storeValue=function(z,A){this.storePublisherValue("taboola global",z,A)};this.getValue=function(z){return this.getPublisherValue("taboola global",z)};this.storePublisherValue=function(A,z,B){if(B==null||B==undefined){return}this.getLocalStorageImplemenation().setValue(A+":"+z,B)};this.getPublisherValue=function(A,z){return this.getLocalStorageImplemenation().getValue(A+":"+z)};this.sortByLength=function(A,z){return A.domain.lenth-z.domain.length};this.setDomainConfiguration=function(B){function A(H){if(window.DOMParser){var I=new DOMParser();return I.parseFromString(H,"text/xml")}xmlDoc=new ActiveXObject("Microsoft.XMLDOM");xmlDoc.async=false;xmlDoc.validateOnParse=false;if(!xmlDoc.loadXML(H)){throw"XMLParsing failed"}return xmlDoc}try{var G=A(B);if(G.documentElement.tagName!="domains"||G.getElementsByTagName("domain").length<1){throw"Invalid configuration document: "+B}var z=G.getElementsByTagName("domain");this.state.m_publisherDomains={host:[],path:[],query:[]};for(var C=0;C<z.length;C++){var D=z[C];var F=this.state.m_publisherDomains[D.getAttribute("type")];if(!(F instanceof Array)){throw"Invalid domain type in configuration: "+D.getAttribute("type")}F.push({domain:D.text?D.text:D.textContent,keep:D.getAttribute("keep")?true:false,staging:D.getAttribute("staging")?true:false})}}catch(E){this.state.m_publisherDomains={}}};this.matchOn=function(C,z,A){if(!C||C.length<1){return[]}if(C.matching){return C.matching.slice(0)}C.matching=[];for(var B=0;B<C.length;B++){if(z(A,C[B].domain)){C.matching.push(C[B])}}return C.matching.slice(0)};this.getMatchingHosts=function(){return this.matchOn(this.state.m_publisherDomains.host,function(z,A){return(z.slice(z.length-A.split(".").length).join(".")==A)},window.location.host.split("."))},this.getMatchingPaths=function(){return this.matchOn(this.state.m_publisherDomains.path,function(A,z){return(A.slice(0,z.split("/").length).join("/")==z)},window.location.pathname.split("/"))};this.getMatchingQuery=function(){return this.matchOn(this.state.m_publisherDomains.query,function(C,G){var F=G.split("&");for(var B=0;B<F.length;B++){var E=F[B].split("=");var D=false;for(var A=0;A<C.length;A++){var z=C[A].split("=");D=D||(unescape(E[0])==unescape(z[0])&&unescape(E[1])==unescape(z[1]))}if(!D){return false}}return true},window.location.search.replace(/^\?/,"").split("&"))};this.isEmbeddedView=function(){return this.state.m_publisherDomains.host&&this.state.m_publisherDomains.host.length&&this.getMatchingHosts().length<=0&&(window.location.host.search(/taboola\w*.com$/)<0)};this.isStagingView=function(){if(this.isEmbeddedView()){return false}return(function(){for(var z=0;z<arguments.length;z++){if((function(A){while(A.length>0){if(A.shift().staging){return true}}})(arguments[z])){return true}}return false})(this.getMatchingHosts(),this.getMatchingPaths(),this.getMatchingQuery())};this.fixRecommendationURL=function(A){function L(N,T){var S=N.substring(1).split("/").reverse();var R=T.substring(1).split("/");var Q="";for(var P=0;P<R.length&&P<S.length;P++){for(var O=0;O<S.length;O++){if(P-O<0){Q="/"+R.slice(0,P+1).join("/");break}if(S[O]!=R[P-O]){break}}}return T.substring(Q.length)}function F(P){var N={};for(var O=0;O<P.length;O++){kv=P[O].lsplit("=",2);N[kv[0]]=kv[1]}return N}var z;try{z=new j(A)}catch(G){return A}var H=null;var I=this.getMatchingHosts().sort(this.sortByLength);if(I.length<1){return A}while(I.length>0&&!I[0].keep){I.shift()}if(I.length>0){z.host=window.location.host}var M=this.getMatchingPaths().sort(this.sortByLength);while(M.length>0&&!M[0].keep){M.shift()}if(M.length>0){z.pathname=M[0].domain+L(M[0].domain,z.pathname)}var E=this.getMatchingQuery();var C=z.search.replace(/^\?/,"").split("&");if(C[0]==""){C.shift()}for(var D=0;D<E.length;D++){var J=F(E[D].domain.split("&"));for(var D=0;D<C.length;D++){var K=C[D].lsplit("=",2).shift();var B=J[K];if(typeof B!="undefined"){C[D]=K+"="+B;delete J[K]}}for(var K in J){C.push(K+"="+J[K])}}z.search=(C.length>0)?"?"+C.join("&"):"";return z.toString()};this.additionalDispatchParams=function(){if(this.state.moreDispatchParams.length==0){return""}return"&"+this.state.moreDispatchParams.join("&")};this.getCurrentURL=function(){var B=new j(window.location.href);var C=[],A=[];B.search.replace(/^\?/,"").split(/&/).forEach(function(D){if(!D){return}if(D.search("trc_")==0||D=="taboola-debug"){A.push(D)}else{C.push(D)}});B.search=C.length>0?"?"+C.join("&"):"";var z=new String(B.toString());z.filtered=A;return z};this.initState=function(){if(typeof this.state=="undefined"){this.state={}}this.state.privateStorageImpl=null;this.state.m_publisherDomains={host:[],path:[],query:[]};this.state.moreDispatchParams=[]};this.pushState=function(){this.stateStack.push(this.state);delete this.state;this.initState()};this.popState=function(){if(this.stateStack.length>0){this.state=this.stateStack.pop()}};this.initState();this.state.moreDispatchParams=this.getCurrentURL().filtered;return this};PageManager.getImpl=function(){if(typeof window.PageManagerImpl=="undefined"){window.PageManagerImpl=new PageManager()}return window.PageManagerImpl};PageManager.getPageData=function(){var a=Array.prototype.slice.call(arguments);return PageManager.getImpl().getPageData.apply(null,a)};PageManager.storeValue=function(a,b){return PageManager.getImpl().storeValue(a,b)};PageManager.storePublisherValue=function(b,a,c){return PageManager.getImpl().storePublisherValue(b,a,c)};PageManager.getValue=function(a){return PageManager.getImpl().getValue(a)};PageManager.getPublisherValue=function(b,a){return PageManager.getImpl().getPublisherValue(b,a)};PageManager.setDomainConfiguration=function(a){return PageManager.getImpl().setDomainConfiguration(a)};PageManager.isEmbeddedView=function(){return PageManager.getImpl().isEmbeddedView()};PageManager.isStagingView=function(){return PageManager.getImpl().isStagingView()};PageManager.fixRecommendationURL=function(a){return PageManager.getImpl().fixRecommendationURL(a)};PageManager.additionalDispatchParams=function(){return PageManager.getImpl().additionalDispatchParams()};PageManager.getCurrentURL=function(){return PageManager.getImpl().getCurrentURL()};PageManager.pushState=function(){return PageManager.getImpl().pushState()};PageManager.popState=function(){return PageManager.getImpl().popState()}};
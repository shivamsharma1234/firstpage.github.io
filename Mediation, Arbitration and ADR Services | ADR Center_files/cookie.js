/*!
 * Copyright (c) 20015, differens.it
 * This is not open source
 */

(function () {

    var COOKIE_NAME = "cns-cookie";
    var BANNER_ID = "cnotice_bnr";

//Utility-----------------------------------------------------------------------
    function cn_setCookie(cname, cvalue, exdays) {
        exdays = typeof exdays !== 'undefined' ? exdays : 365;
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
    }

    function cn_getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ')
                c = c.substring(1);
            if (c.indexOf(name) == 0)
                return c.substring(name.length, c.length);
        }
        return null;
    }

    function cn_hasClass(ele, cls) {
        return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    }

    function cn_addClass(ele, cls) {
        if (!cn_hasClass(ele, cls))
            ele.className += " " + cls;
    }

    function cn_removeClass(ele, cls) {
        if (cn_hasClass(ele, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            ele.className = ele.className.replace(reg, ' ');
        }
    }

    function cn_existElement(ele) {
        if (typeof (ele) != 'undefined' && ele != null) {
            return true;
        }
        return false;
    }

    function cn_addEventListener(ele, ev, hand) {
        if (ele.addEventListener) {
            ele.addEventListener(ev, hand);
        } else if (document.attachEvent) {
            ele.attachEvent("on" + ev, hand);
        }
    }

    function cn_removeEventListener(ele, ev, hand) {
        if (ele.removeEventListener) {
            ele.removeEventListener(ev, hand);
        } else if (document.attachEvent) {
            ele.detachEvent("on" + ev, hand);
        }
    }

    function cn_getElementsByClassName(cn) {

        if (document.getElementsByClassName) {
            return document.getElementsByClassName(cn);
        }

        for (var r = [], e = document.getElementsByTagName('*'), i = e.length; i--; ) {
            if ((' ' + e[i].className + ' ').indexOf(' ' + cn + ' ') > -1) {
                r.push(e[i]);
            }
        }
        return r;
    }

//-----------------------------------------------------------------------

    function cn_setBanner(show) {
        show = typeof show !== 'undefined' ? show : false;
        br = document.getElementById(BANNER_ID);
        by = document.getElementsByTagName("body")[0];

        if (typeof br === "undefined" || br==null) {
            return;
        }

        if (show && br.style.display == "block" || !show && br.style.display == "none") {
            return;
        }

        if (show) {
            br.style.display = "block";
            by.style["margin-top"] = br.offsetHeight + "px";
            _cn_registerBannerCheker();
        } else {
            br.style.display = "none";
            by.style["margin-top"] = 0 + "px";
            clearInterval(_cn_BannerChekerInterval);
        }
    }

    var _cn_BannerChekerInterval;
    function _cn_registerBannerCheker() {
        var chekHandler;

        chekHandler = function (e) {
            if (cn_getCookie(COOKIE_NAME) != null) {
                cn_setBanner(false);
            } else {
                clearInterval(chekHandler);
            }
        };
        chekInterval = setInterval(chekHandler, 300);
    }


    function cn_NoCookieClass(add) {
        add = typeof add !== 'undefined' ? add : false;
        body = document.getElementsByTagName("body")[0];
        if (add) {
            cn_addClass(body, "cen-no-cookie");
        } else {
            cn_removeClass(body, "cen-no-cookie");
        }
    }


    function cn_activateIframe() {
        var iframes = cn_getElementsByClassName("cen-iframe");

        for (i = 0; i < iframes.length; i++) {
            iframe = iframes[i];
            src = iframe.attributes[ 'data-ce-src' ].value;
            iframe.src = src;
        }
    }

    function cn_activateScript() {
        var scripts = cn_getElementsByClassName('cen-script'),
                n = scripts.length,
                documentFragment = document.createDocumentFragment(),
                i, y, s, attrib, el;

        for (i = 0; i < n; i++) {

            s = document.createElement('script');
            s.type = 'text/javascript';
            for (y = 0; y < scripts[i].attributes.length; y++) {
                attrib = scripts[i].attributes[y];
                if (attrib.specified) {
                    if ((attrib.name != 'type') && (attrib.name != 'class')) {
                        s.setAttribute(attrib.name, attrib.value);
                    }
                }
            }

            try {
                s.innerHTML = scripts[i].innerHTML;
            }
            catch (err) {//fix ie8
                s.text = scripts[i].innerHTML;
            }

            if ((s.getAttribute('src') !== null) && (s.getAttribute('src') !== '')) {
                documentFragment.insertBefore(s, documentFragment.firstChild);
            } else {
                documentFragment.appendChild(s);
            }


        }

        document.body.appendChild(documentFragment);
    }


    function cn_registerIteration() {

        if (cn_getCookie(COOKIE_NAME) != null) {
            return;
        }

        var scrollHandler, clickHandler;

        scrollHandler = function (e) {//scroll window

            scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;
            if (Math.abs(scrollTop) > 40) {

                cn_setBanner(false);
                if (cn_getCookie(COOKIE_NAME) != "N") {
                    cn_NoCookieClass(false);
                    cn_onTCookieOK();
                }
                cn_removeEventListener(window, 'scroll', scrollHandler);
                cn_removeEventListener(document, 'click', clickHandler);

            }
            ;
        };
        cn_addEventListener(window, 'scroll', scrollHandler);


        var clickHandler = function (e) {//click on document

            node = e.target;

            if (e.clientX == 0 && e.clientY == 0) {
                return;//fake clik??? 
            }

            while (node != null) {
                if (typeof node.id != 'undefined' && node.id == BANNER_ID) {
                    return;
                }
                node = node.parentNode;
            }

            cn_setBanner(false);
            if (cn_getCookie(COOKIE_NAME) != "N") {
                cn_NoCookieClass(false);
                cn_onTCookieOK();
            }
            cn_removeEventListener(window, 'scroll', scrollHandler);
            cn_removeEventListener(document, 'click', clickHandler);
        };
        cn_addEventListener(document, 'click', clickHandler);
    }


    function cn_registerOkBtn() {

        if (cn_getCookie(COOKIE_NAME) != null) {
            return;
        }

        var cnotice_btn = cn_getElementsByClassName("cnotice_btn");
        for (i = 0; i < cnotice_btn.length; i++) {
            cn_addEventListener(cnotice_btn[i], "click", function (e) {
                cn_setBanner(false);
                cn_NoCookieClass(false);
                cn_onTCookieOK();
                e.preventDefault();
            });
        }
    }


    function cn_registerCheckbox() {

        var cnotice_ckb = document.getElementById("cnotice_ckb");
        if (cn_existElement(cnotice_ckb))
        {
            if (cn_getCookie(COOKIE_NAME) == "Y" || cn_getCookie(COOKIE_NAME) == null) {
                cnotice_ckb.checked = true;
            } else {
                cnotice_ckb.checked = false;
            }

            cn_addEventListener(cnotice_ckb, "click", function (e) {

                if (cnotice_ckb.checked) {
                    cn_setCookie(COOKIE_NAME, "Y");
                } else {
                    cn_setCookie(COOKIE_NAME, "N");
                }
                window.location.href = window.location.href;
            });
            return true;
        }

        return false;
    }

//-----init---------------------------------------------------------------------

    if (cn_registerCheckbox()) {

    } else {
        if (cn_getCookie(COOKIE_NAME) == null) {
            cn_NoCookieClass(true);
            cn_setBanner(true);
            cn_registerIteration();
            cn_registerOkBtn();
        } else if (cn_getCookie(COOKIE_NAME) == 'Y') {
            cn_NoCookieClass(false);
            cn_setBanner(false);
            cn_activateIframe();
            cn_activateScript();
        } else if (cn_getCookie(COOKIE_NAME) == 'N') {
            cn_NoCookieClass(true);
        }
    }




//-----event---------------------------------------------------------------------

    function cn_onTCookieOK() {
        cn_setCookie(COOKIE_NAME, "Y");
        cn_activateIframe();
        cn_activateScript();


    }

}());
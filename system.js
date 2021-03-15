var ext = function() {
    var debug = 0;
    var extid = chrome.runtime.id;
    var domains;
    this.popup = function() {
        $(document).ready(function() {
            domains = getStorage('domains') || [];
            chrome.tabs.getSelected(function(tab) {
                var tabid = tab.id;
                var domain = getDomain(tab.url);
                var icon = tab.favIconUrl ? tab.favIconUrl : 'img/tab.png';
                if (!domain && (typeof tab.pendingUrl) != 'undefined') {
                    domain = getDomain(tab.pendingUrl);
                }
                if (domain) {
                    $('#popup .domain .icon').html('<img src="' + icon + '">');
                    $('#popup .domain .url').html(domain);
                    if (domains.indexOf(domain) > -1) {
                        $('#popup .copy').removeClass('off').addClass('on');
                        $('#popup .copy .tips').html(l('crackTips'));
                    } else {
                        $('#popup .copy').removeClass('on').addClass('off');
                        $('#popup .copy .tips').html(l('crackTips'));
                    }
                    $('#popup .copy').on('mouseover mouseout', '', function(event) {
                        var turn = $('#popup .copy').hasClass('on') ? 'off' : 'on';
                        if (event.type == "mouseover") {
                            if (turn == 'on') {
                                $('#popup .copy .tips').html(l('enableTips'));
                            } else {
                                $('#popup .copy .tips').html(l('disableTips'));
                            }
                        } else if (event.type == "mouseout") {
                            $('#popup .copy .tips').html(l('crackTips'));
                        }
                    });
                    $('#popup .copy').on('click', '', function() {
                        var turn = $('#popup .copy').hasClass('on') ? 'off' : 'on';
                        chrome.runtime.sendMessage({ type: "copy", turn: turn }, function(res) {
                            if (turn == 'on') {
                                $('#popup .copy').removeClass('off').addClass('on');
                            } else {
                                $('#popup .copy').removeClass('on').addClass('off');
                            }
                            $('#popup .copy .tips').html(l('crackTips'));
                        });
                    });
                } else {
                    $('#popup .copy').removeClass('on').addClass('off');
                    $('#popup .copy .tips').html(l('cannotTips'));
                }
            });
            document.oncontextmenu = function() {
                if (!debug) { return false; }
            };
            $('#popup .option').on('click', function() {
                opentab('option.html', true, true);
            });
        });
        var refreshTab = function() {
            chrome.tabs.getSelected(function(tab) {
                if (tab.id > -1) {
                    chrome.tabs.reload(tab.id);
                }
            });
        };
    };
    this.option = function() {
        domains = getStorage('domains') || [];
        var html = '';
        domains.forEach(function(dm) {
            html = '<li class="list-group-item"><span class="badge" title="' + l('delete') + '"><i class="glyphicon glyphicon-remove"></i></span> <a href="http://' + dm + '" target="_blank">' + dm + '</a></li>';
            $('#option .domains .list-group').append(html);
        });
        $('#option .domains .alert').html('<strong>' + l('tips') + '</strong> ' + l('domainListsTips'));
        $('#option .nav .domainLists').html(l('domainLists'));
        $('#option .nav .rate').html(l('rate'));
        $('#option .main .panel-heading').html(l('domainLists'));

        $('#option .domains .list-group').on('click', '.badge', function() {
            var _li = $(this).parent('li');
            var domain = _li.text();
            var index = domains.indexOf(domain);
            domains.splice(index, 1);
            setStorage('domains', domains);
            _li.remove();
        });
    };
    this.background = function() {
        $(document).ready(function() {
            domains = getStorage('domains') || [];
            chrome.runtime.onMessage.addListener(function(message, sender, reply) {
                var status = 1;
                if (message.type == 'copy') {
                    chrome.tabs.getSelected(function(tab) {
                        var tabid = tab.id;
                        var domain = getDomain(tab.url);
                        if (message.turn == 'on') {
                            turn('on', tabid, domain);
                        } else {
                            turn('off', tabid, domain);
                        }
                    });
                } else if (message.type == 'reload') {
                    window.location.reload();
                }
                reply({ status: status });
            });
            chrome.tabs.onSelectionChanged.addListener(function(tabId, selectInfo) {
                try {
                    chrome.tabs.get(tabId, function(tab) {
                        var domain = getDomain(tab.url);
                        var icon = 'img/ico19.png';
                        if (!inDomains(domain)) {
                            icon = 'img/ico19_disable.png';
                        }
                        chrome.browserAction.setIcon({
                            path: icon,
                            tabId: tabId
                        });
                    });
                } catch (error) {
                    log(error);
                }
            });
            chrome.tabs.onUpdated.addListener(function(tabid, info, tab) {
                var domain = getDomain(info.url || tab.url);
                if (inDomains(domain)) {
                    if (info.status == 'complete') {
                        turn('on', tabid, domain);
                    }
                } else {
                    setIcon('off', tabid);
                }
            });
            document.write('<script async src="https://www.googletagmanager.com/gtag/js?id=UA-69816681-2"></script>');
            window.dataLayer = window.dataLayer || [];

            function gtag() { dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', 'UA-69816681-2');
            gtag('event', 'background', { 'extid': extid });
        });
        var turn = function(type, tabid, domain) {
            if (!domain) { return false; }
            domains = getStorage('domains') || [];
            var index = domains.indexOf(domain);
            if (type == 'on') {

                if (index == -1) {
                    domains.push(domain);
                }
                var src = chrome.runtime.getURL('js/code.js');
                var code = "var script = document.createElement('script');script.src = '" + src + "';document.body.appendChild(script);"
                var script = { code: code, allFrames: true };
                try {
                    setIcon(type, tabid);
                    chrome.tabs.executeScript(tabid, script);
                } catch (error) {
                    log(error);
                }

            } else {
                setIcon(type, tabid);
                if (index > -1) {
                    domains.splice(index, 1);
                }
                chrome.tabs.reload(tabid);
            }
            setStorage('domains', domains);
        };
        var inDomains = function(domain) {
            domains = getStorage('domains') || [];
            var index = domains.indexOf(domain);
            return index === -1 ? false : true;
        };
        var setIcon = function(type, tabid) {
            if (type == 'on') {
                chrome.browserAction.setIcon({
                    path: 'img/ico19.png',
                    tabId: tabid
                });
            } else {
                chrome.browserAction.setIcon({
                    path: 'img/ico19_disable.png',
                    tabId: tabid
                });
            }
        };
    };
    var opentab = function(url, unique, selected) {
        var current = 0;
        if (url == '') { return false; }
        if (unique !== false) { unique = true; }
        if (selected !== false) { selected = true; }
        var permissions = chrome.app.getDetails()['permissions'];
        var permis = permissions.indexOf('tabs') > -1 ? true : false;
        if (permis && unique === true) {
            chrome.tabs.getAllInWindow(null, function(tabs) {
                for (var i = 0; i < tabs.length; i++) {
                    if (tabs[i].url == url) {
                        chrome.tabs.update(tabs[i].id, { selected: true });
                        return true;
                    }
                }
                chrome.tabs.create({ url: url, selected: true });
                return true;
            });
        } else {
            chrome.tabs.create({ url: url, selected: selected });
            return true;
        }
    };
    var getDomain = function(url) {
        if (!url) { return false; }
        url = url.toLowerCase()
        var scheme = url.split("://")[0];
        if (scheme != "http" && scheme != "https") {
            return false;
        }
        var e = url.split("://")[1].split("/")[0].split(":")[0];
        var k = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
        if (k.test(e)) {
            if (RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256) {
                if (RegExp.$1 == 192 && RegExp.$2 == 168) {
                    return false
                }
                if (RegExp.$1 == 10) {
                    return false
                }
                return e
            } else {
                return false
            }
        } else {
            if (e.substr(0, 4) == "www.") {
                e = e.substr(4)
            }
            return e
        }
    };
    var getUrlParam = function(key, url) {
        var reg = new RegExp("(/?|^|&)" + key + "=([^&]*)(&|$)");
        var r = url.substr(1).match(reg);
        if (r != null) {
            return decodeURIComponent(r[2]);
        }
        return null;
    };
    var getStorage = function(key) {
        result = null;
        if (typeof(window.localStorage['e__' + key]) !== "undefined") {
            result = JSON.parse(de(window.localStorage['e__' + key]));
        }
        return result;
    };
    var setStorage = function(key, val) {
        return window.localStorage['e__' + key] = en(JSON.stringify(val));
    };
    var clearStorage = function(key) {
        window.localStorage.removeItem('e__' + key);
    };
    var log = function(text) {
        debug && console.log(text);
    };
    var l = function(id) {
        return chrome.i18n.getMessage(id);
    };
    var en = function(input) {
        var output = "";
        if (!input) { return output; }
        var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = utf16to8(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output + b64.charAt(enc1) + b64.charAt(enc2) + b64.charAt(enc3) + b64.charAt(enc4);
        }
        return output;
    };
    var de = function(input) {
        var output = "";
        if (!input) { return output; }
        var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = b64.indexOf(input.charAt(i++));
            enc2 = b64.indexOf(input.charAt(i++));
            enc3 = b64.indexOf(input.charAt(i++));
            enc4 = b64.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = utf8to16(output);
        return output;
    };
    var utf16to8 = function(str) {
        var out, i, len, c;
        out = "";
        len = str.length;
        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F)) {
                out += str.charAt(i);
            } else if (c > 0x07FF) {
                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            } else {
                out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            }
        }
        return out;
    };
    var utf8to16 = function(str) {
        var out, i, len, c;
        var char2, char3;
        out = "";
        len = str.length;
        i = 0;
        while (i < len) {
            c = str.charCodeAt(i++);
            switch (c >> 4) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    // 0xxxxxxx
                    out += str.charAt(i - 1);
                    break;
                case 12:
                case 13:
                    // 110x xxxx 10xx xxxx
                    char2 = str.charCodeAt(i++);
                    out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                    break;
                case 14:
                    // 1110 xxxx 10xx xxxx 10xx xxxx
                    char2 = str.charCodeAt(i++);
                    char3 = str.charCodeAt(i++);
                    out += String.fromCharCode(((c & 0x0F) << 12) |
                        ((char2 & 0x3F) << 6) |
                        ((char3 & 0x3F) << 0));
                    break;
            }
        }
        return out;
    };
};
var e = new ext();
e.popup();
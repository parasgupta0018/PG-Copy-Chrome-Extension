chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.storage.sync.get("domains", ({ domains }) => {
        var domain = getDomain(tabs[0].url);
        if (domains) {
            var result = inDomains(domains, domain)
            var mainParent = $(this).parent('.toggle-btn');
            if (result) {

                $('#toggle_btn').addClass('active');
                document.getElementById("toggle").checked = true
                $('#note').show();
                document.getElementById('btn_text').innerText = "Click to switch to defaults.";
                var domain = getDomain(tabs[0].url);
                chrome.tabs.sendMessage(tabs[0].id, { todo: "enableEvents" });
                chrome.browserAction.setIcon({ path: 'img/enabler.png' })
                chrome.browserAction.setTitle({ title: "PG Copy - Enabled" })

            } else {
                $('#toggle_btn').removeClass('active');
                document.getElementById("toggle").checked = false
                document.getElementById('btn_text').innerText = "Click to enable all events.";
                $('#note').hide();
                chrome.browserAction.setIcon({ path: 'img/disabler.png' })
                chrome.browserAction.setTitle({ title: "PG Copy - Disabled" })
            }
        }
    });
})

function inDomains(domains, domain) {
    var index = domains.indexOf(domain);
    return index === -1 ? false : true;
}


$('#toggle').click(function() {
    var mainParent = $(this).parent('.toggle-btn');

    if ($('#toggle_btn').find('input.cb-value').is(':checked')) {
        $('#toggle_btn').addClass('active');
        $('#note').show();
        document.getElementById('btn_text').innerText = "Click to switch to defaults.";
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { todo: "enableEvents" });
            chrome.browserAction.setIcon({ path: 'img/enabler.png' })
            chrome.browserAction.setTitle({ title: "PG Copy - Enabled" })
            var domain = getDomain(tabs[0].url);
            chrome.storage.sync.get("domains", ({ domains }) => {
                if (domains) {
                    var result = inDomains(domains, domain)
                    if (!result) {
                        domains.push(domain)
                    }
                } else {
                    var domains = []
                    domains.push(domain)
                }
                chrome.storage.sync.set({ domains })
            });
        })

    } else {
        $('#toggle_btn').removeClass('active');
        document.getElementById('btn_text').innerText = "Click to enable all events.";
        $('#note').hide();
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.browserAction.setIcon({ path: 'img/disabler.png' })
            chrome.browserAction.setTitle({ title: "PG Copy - Disabled" })
            var domain = getDomain(tabs[0].url);
            chrome.storage.sync.get("domains", ({ domains }) => {
                if (domains) {
                    var result = inDomains(domains, domain)
                    if (result) {
                        var index = domains.indexOf(domain);
                        domains.splice(index, 1);
                    }
                }
                chrome.storage.sync.set({ domains })
            });
            chrome.tabs.sendMessage(tabs[0].id, { todo: "disableEvents" });
        })


    }

})


chrome.storage.onChanged.addListener(function(changes, storageName) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var domain = getDomain(tabs[0].url);
        var domains = changes.domains.newValue
        var result = inDomains(domains, domain)
        if (result) {
            var mainParent = $(this).parent('.toggle-btn');
            $('#toggle_btn').addClass('active');
            document.getElementById("toggle").checked = true
            $('#note').show();
            document.getElementById('btn_text').innerText = "Click to switch to defaults.";
            var domain = getDomain(tabs[0].url);
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { todo: "enableEvents" });
                chrome.browserAction.setIcon({ path: 'img/enabler.png' })
                chrome.browserAction.setTitle({ title: "PG Copy - Enabled" })
            })
        } else {
            $('#toggle_btn').removeClass('active');
            document.getElementById("toggle").checked = false
            document.getElementById('btn_text').innerText = "Click to enable all events.";
            $('#note').hide();
            chrome.browserAction.setIcon({ path: 'img/disabler.png' })
            chrome.browserAction.setTitle({ title: "PG Copy - Disabled" })
        }
    })
})

chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { id: tabs[0].id, todo: "getID" });
})

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
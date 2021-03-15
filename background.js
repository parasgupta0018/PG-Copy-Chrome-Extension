// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var tabId = tabs[0].id;
    try {
        chrome.tabs.get(tabId, function(tab) {
            var domain = getDomain(tab.url);
            chrome.storage.sync.get("domains", ({ domains }) => {
                if (domains) {
                    var index = domains.indexOf(domain);
                    // console.log(index)
                    if (index == -1) {
                        chrome.browserAction.setIcon({ path: 'img/disabler.png' })
                        chrome.browserAction.setTitle({ title: "PG Copy - Disabled" })
                    } else {
                        chrome.browserAction.setIcon({ path: 'img/enabler.png' })
                        chrome.browserAction.setTitle({ title: "PG Copy - Enabled" })
                        chrome.tabs.sendMessage(tabs[0].id, { todo: "enableEvents" });
                    }
                } else {
                    chrome.browserAction.setIcon({ path: 'img/disabler.png' })
                    chrome.browserAction.setTitle({ title: "PG Copy - Disabled" })
                }
            })
        })
    } catch (err) {
        console.log(err)
    }
})
chrome.browserAction.onClicked.addListener((currentTab) => {
    try {
        var tabId = currentTab.id;
        chrome.tabs.get(tabId, function(tab) {
            var domain = getDomain(tab.url);
            chrome.storage.sync.get("domains", ({ domains }) => {
                if (domains) {
                    var index = domains.indexOf(domain);
                    // console.log(index)
                    if (index == -1) {
                        chrome.browserAction.setIcon({ path: 'img/disabler.png' })
                        chrome.browserAction.setTitle({ title: "PG Copy - Disabled" })
                    } else {
                        chrome.browserAction.setIcon({ path: 'img/enabler.png' })
                        chrome.browserAction.setTitle({ title: "PG Copy - Enabled" })
                        chrome.tabs.sendMessage(tabId, { todo: "enableEvents" });
                    }
                } else {
                    chrome.browserAction.setIcon({ path: 'img/disabler.png' })
                    chrome.browserAction.setTitle({ title: "PG Copy - Disabled" })
                }
            })
        })
    } catch (err) {
        console.log(err)
    }
});

chrome.tabs.onActivated.addListener(function(newTab) {
    try {
        var tabId = newTab.tabId;
        chrome.tabs.get(tabId, function(tab) {
            var domain = getDomain(tab.url);
            chrome.storage.sync.get("domains", ({ domains }) => {
                if (domains) {
                    var index = domains.indexOf(domain);
                    // console.log(index)
                    if (index == -1) {
                        chrome.browserAction.setIcon({ path: 'img/disabler.png' })
                        chrome.browserAction.setTitle({ title: "PG Copy - Disabled" })
                    } else {
                        chrome.browserAction.setIcon({ path: 'img/enabler.png' })
                        chrome.browserAction.setTitle({ title: "PG Copy - Enabled" })
                        chrome.tabs.sendMessage(tabId, { todo: "enableEvents" });
                    }
                } else {
                    chrome.browserAction.setIcon({ path: 'img/disabler.png' })
                    chrome.browserAction.setTitle({ title: "PG Copy - Disabled" })
                }
            })
        })
    } catch (err) {
        console.log(err)
    }
});

chrome.tabs.onSelectionChanged.addListener(function(tabId, selectInfo) {
    try {
        chrome.tabs.get(tabId, function(tab) {
            var domain = getDomain(tab.url);
            chrome.storage.sync.get("domains", ({ domains }) => {
                if (domains) {
                    var index = domains.indexOf(domain);
                    // console.log(index)
                    if (index == -1) {
                        chrome.browserAction.setIcon({ path: 'img/disabler.png' })
                        chrome.browserAction.setTitle({ title: "PG Copy - Disabled" })
                    } else {
                        chrome.browserAction.setIcon({ path: 'img/enabler.png' })
                        chrome.browserAction.setTitle({ title: "PG Copy - Enabled" })
                        chrome.tabs.sendMessage(tabId, { todo: "enableEvents" });
                    }
                } else {
                    chrome.browserAction.setIcon({ path: 'img/disabler.png' })
                    chrome.browserAction.setTitle({ title: "PG Copy - Disabled" })
                }
            })
        })
    } catch (err) {
        console.log(err)
    }
});
chrome.tabs.onUpdated.addListener(function(tabid) {
    try {
        chrome.tabs.get(tabid, function(tab) {
            var domain = getDomain(tab.url);
            chrome.storage.sync.get("domains", ({ domains }) => {
                if (domains) {
                    var index = domains.indexOf(domain);
                    // console.log(index)
                    if (index == -1) {
                        chrome.browserAction.setIcon({ path: 'img/disabler.png' })
                        chrome.browserAction.setTitle({ title: "PG Copy - Disabled" })
                    } else {
                        chrome.browserAction.setIcon({ path: 'img/enabler.png' })
                        chrome.browserAction.setTitle({ title: "PG Copy - Enabled" })
                        chrome.tabs.sendMessage(tabid, { todo: "enableEvents" });
                    }
                } else {
                    chrome.browserAction.setIcon({ path: 'img/disabler.png' })
                    chrome.browserAction.setTitle({ title: "PG Copy - Disabled" })
                }
            })
        })
    } catch (err) {
        console.log(err)
    }
});
// }


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
var supportedTypes = ['.csv', '.xls', '.json', '.xlsx'];

var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

chrome.contextMenus.create({
    "title": "Send to Vizydrop",
    "contexts": ["link"],
    "onclick": function (e) {
        // var host = e.pageUrl;
        var url = (e.linkUrl || '');
        var predicate = function (suffix) {
            return (url.indexOf('#') < 0) && endsWith(url, suffix);
        };
        var isSupported = supportedTypes.some(predicate);
        if (isSupported) {
            var vizyUrl = '/autourl/?url=' + encodeURI(url);
            chrome.tabs.create({"url": ["https://vizydrop.com", vizyUrl].join('')});
        } else {
            alert('Link must be CSV, JSON, XLS or XLSX format!');
        }
    }
});

function callback(tabId) {

    chrome.tabs.sendMessage(
        tabId,
        {cmd: "get-data-links"},
        function (response) {
            chrome.browserAction.setBadgeText({tabId: tabId, text: String(response.result.length)});
        });
}

chrome.tabs.onCreated.addListener(function (tab) {
    callback(tab.id);
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    callback(tabId);
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
    callback(activeInfo.tabId);
});

var supportedTypes = ['.csv', '.xls', '.json'];

var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

chrome.contextMenus.create({
    "title": "Send to Vizydrop",
    "contexts": ["link"],
    "onclick": function (e) {
        // var host = e.pageUrl;
        var url = (e.linkUrl || '');
        var predicate = endsWith.bind(null, url);
        var isSupported = supportedTypes.some(predicate);
        if (isSupported) {
            chrome.tabs.create({"url": ["http://vzdrp:8080", "?url=", encodeURI(url)].join('')});
        } else {
            alert('Link must be CSV, JSON or XLS format!');
        }
    }
});

chrome.tabs.onActivated.addListener(function callback(activeInfo) {

    // (activeInfo.tabId)
    // (activeInfo.windowId)

    var tabId = activeInfo.tabId;

    chrome.tabs.sendMessage(
        tabId,
        {cmd: "get-data-links"},
        function (response) {
            chrome.browserAction.setBadgeText({tabId: tabId, text: String(response.result.length)});
        });
});
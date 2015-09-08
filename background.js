chrome.contextMenus.create({
    "title": "Send to Vizydrop",
    "contexts": ["link"],
    "onclick": function (e) {
        // var host = e.pageUrl;
        if (e.linkUrl) {
            chrome.tabs.create({
                "url": ["http://vzdrp:8080", "?url=", encodeURI(e.linkUrl)].join('')
            });
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
            chrome.browserAction.setBadgeText({
                tabId: tabId,
                text: String(response.result.length)
            });
        });
});
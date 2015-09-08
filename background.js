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
function doInCurrentTab(tabCallback) {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabArray) {
        tabCallback(tabArray[0].id);
    });
}

var template = function (item) {
    return [
        '<div class="vizydrop-extension-popup__sources__item">',
        '   <div class="vizydrop-extension-popup__sources__file-type">' + item.type + '</div>',
        '   <div class="vizydrop-extension-popup__sources__file-name">',
        '       ' + item.text + '(' + item.file + ')',
        '       <div class="vizydrop-icon-next"></div>',
        '   </div>',
        '</div>'
    ].join('');
};

doInCurrentTab(function (tabId) {
    chrome.tabs.sendMessage(
        tabId,
        {cmd: "get-data-links"},
        function (response) {
            document
                .querySelector('.vizydrop-extension-popup__sources')
                .innerHTML = response.result.map(template).join('');
        });
});
function doInCurrentTab(tabCallback) {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabArray) {
        tabCallback(tabArray[0].id);
    });
}

var template = function (item) {
    return [
        '<div class="vizydrop-extension-popup__sources__item">',
        '   <div class="vizydrop-extension-popup__sources__file-type">',
        '       <a class="vizydrop-extension-popup__sources__download-file" href="' + item.url + '" target="_blank" title="Download file">' + item.type + '</a>',
        '   </div>',
        '   <div class="vizydrop-extension-popup__sources__file-name">',
        '       ' + item.text + '(' + item.file + ')',
        '       <div class="vizydrop-icon-next" data-url="' + item.url + '" title="Create chart"></div>',
        '   </div>',
        '</div>'
    ].join('');
};

doInCurrentTab(function (tabId) {
    chrome.tabs.sendMessage(
        tabId,
        {cmd: "get-data-links"},
        function (response) {

            var len = response.result.length;

            var title = ((len > 0) ?
                ("We have found " + len + " source(s) on the page") :
                ("We have not found any source(s) on the page"));

            document
                .querySelector('.vizydrop-extension-popup__title')
                .innerText = title;

            document
                .querySelector('.vizydrop-extension-popup__sources')
                .innerHTML = response.result.map(template).join('');
        });
});

document.addEventListener('click', function (e) {
    var target = e.target;
    if (target.classList.contains('vizydrop-icon-next')) {
        var url = target.getAttribute('data-url');
        var vizyUrl = '/autourl/?url=' + encodeURI(url);
        chrome.tabs.create({"url": ["https://vizydrop.com", vizyUrl].join('')});
    }
});
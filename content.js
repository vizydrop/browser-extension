chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {

    if (msg.cmd && (msg.cmd === "get-data-links")) {

        var endsWith = function(str, suffix) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        };

        var sel = document.querySelectorAll('a');
        var len = sel.length;
        var links = [];
        for (var i = 0; i < len; i++) {
            links.push(sel[i]);
        }

        var res = links
            .filter(function (a) {
                var href = (a.getAttribute('href') || '');
                return ['.csv', '.xls', '.json'].some(function (suffix) {
                    return endsWith(href, suffix);
                });
            })
            .map(function (a) {
                var href = (a.getAttribute('href'));
                var parts = href.split('/');
                var file = parts[parts.length - 1];
                return {
                    file: (file),
                    text: (a.innerText || a.getAttribute('title')),
                    type: (file.split('.').pop()),
                    url: href
                };
            });

        sendResponse({result: res});
    }
});
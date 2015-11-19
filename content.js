chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {

    if (msg.cmd && (msg.cmd === "get-data-links")) {

        var endsWith = function(str, suffix) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        };

        var links = [].slice.call(document.querySelectorAll('a'));

        var res = links
            .filter(function (a) {
                var href = (a.getAttribute('href') || '');
                return ['.csv', '.xls', '.json', '.xlsx'].some(function (suffix) {
                    return (href.indexOf('#') < 0) && endsWith(href, suffix);
                });
            })
            .map(function (a) {
                var href = a.href;
                var parts = href.split('/');
                var file = parts[parts.length - 1];
                return {
                    file: (file),
                    text: (a.innerText || a.getAttribute('title')),
                    type: (file.split('.').pop()),
                    url: href
                };
            })
            .reduce(function (memo, item) {
                var url = item.url;
                var index = (memo
                    .map(function (row) {
                        return row.url;
                    })
                    .indexOf(url));
                return memo.concat((index === -1) ? [item] : []);
            }, []);

        sendResponse({result: res});
    }
});
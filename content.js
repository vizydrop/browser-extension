(function () {

    var getApplicablePageLinks = function () {
        var endsWith = function (str, suffix) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        };

        var links = [].slice.call(document.querySelectorAll('a'));

        return (links
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
            }, []));
    };

    var throttle = function(func, wait, options) {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        if (!options) options = {};
        var later = function() {
            previous = options.leading === false ? 0 : (new Date());
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        };

        return function() {
            var now = (new Date());
            if (!previous && options.leading === false) previous = now;
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                previous = now;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    };

    chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
        if (msg.cmd && (msg.cmd === 'get-data-links')) {
            sendResponse({result: getApplicablePageLinks()});
        }
    });

    document.addEventListener(
        'DOMSubtreeModified',
        throttle(
            function () {
                chrome.runtime.sendMessage(
                    {type: 'set-data-links', result: getApplicablePageLinks()},
                    function (response) {
                        // TODO: do something afterwards?
                    });
            },
            500));
})();
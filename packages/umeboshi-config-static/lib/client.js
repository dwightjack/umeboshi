(function () {

    function subscribe(url, callback) {
        let source = new window.EventSource(url);

        source.onmessage = function (e) {
            callback(e);
        };

        source.onerror = function (e) {
            if (source.readyState == window.EventSource.CLOSED) return;

            console.log('sse error', e);
        };

        return source.close.bind(source);
    }

    subscribe('/channel/ssr-server', ({ data, event }) => {
        console.log(event, data);
        if (event === 'reload') {
            window.location.reload();
        }
    });

}());
/* eslint-env es6: false, browser */
/* eslint-disable prefer-arrow-callback, no-console, one-var, one-var-declaration-per-line, no-var, func-names */
(function(win) {
    var src;

    function subscribe(url) {
        var source = new win.EventSource(url);

        source.onerror = function(e) {
            if (source.readyState === win.EventSource.CLOSED) return;
            console.warn('sse error', e);
        };

        return source;
    }

    src = subscribe('{{HOST}}/channel/ssr-server');
    src.addEventListener('reload', function reload() {
        win.location.reload();
    });

    src.addEventListener('attached', function() {
        console.log('Client attached to SSR server...');
    });
})(window);
/* eslint-enable prefer-arrow-callback, no-console, one-var, one-var-declaration-per-line, no-var, func-names */

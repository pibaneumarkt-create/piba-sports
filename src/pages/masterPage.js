// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world

function fixScroll() {
    document.querySelectorAll('[id^=”bgLayers_”]').forEach(function(el) {
        el.style.overflow = 'visible';
        el.style.overflowX = 'hidden';
    });
    var ids = ['SITE_PAGES', 'SITE_ROOT', 'masterPage'];
    ids.forEach(function(id) {
        var el = document.getElementById(id);
        if (el) {
            el.style.overflow = 'visible';
            el.style.overflowX = 'hidden';
        }
    });
}

$w.onReady(function () {
    fixScroll();
    setTimeout(fixScroll, 500);
    setTimeout(fixScroll, 1500);
});

window.BLOG_POSTS = window.BLOG_POSTS || {};

(function() {
    const posts = [
        "assets/js/posts/s&box.js",
        "assets/js/posts/roslyn.js",
        "assets/js/posts/acorn2d.js",
        "assets/js/posts/gmod.js",
        "assets/js/posts/mario.js",
        "assets/js/posts/mmo.js",
        "assets/js/posts/towerdefence.js",
        "assets/js/posts/01.js"
    ];

    posts.forEach(src => {
        document.write(`<script src="${src}"></script>`);
    });
})();

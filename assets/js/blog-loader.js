(function() {
  function getPostId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('post');
  }

  function setBlogContent(post) {
    if (!document.getElementById('blog-title') || !document.getElementById('blog-meta') || !document.getElementById('blog-content')) {
      console.error('Blog elements not found in the document.');
      return;
    }

    if (!post) {
      document.getElementById('blog-title').textContent = 'Post Not Found';
      document.getElementById('blog-meta').textContent = '';
      document.getElementById('blog-content').innerHTML = '<p>Sorry, this blog post does not exist.</p>';
      document.getElementById('header').style.backgroundImage = '';
      document.title = 'Not Found | Joshua Mobley';
      return;
    }
    document.getElementById('blog-title').textContent = post.title;
    document.getElementById('blog-meta').textContent = `By ${post.author} | ${post.date}`;
    const contentElement = document.getElementById('blog-content');
    contentElement.innerHTML = marked.parse(post.content);
    Prism.highlightAll();
    document.getElementById('header').style.backgroundImage = `url('${post.headerImage}')`;
    document.getElementById('header').setAttribute('aria-label', `Header background image for ${post.title}`);
    document.title = post.title + ' | Joshua Mobley';
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', post.description);
  }

  document.addEventListener('DOMContentLoaded', function() {
    var postId = getPostId();
    var post = window.BLOG_POSTS && window.BLOG_POSTS[postId];
    setBlogContent(post);
  });
})();

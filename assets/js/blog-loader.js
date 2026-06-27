(function() {
  function loadBlogPost(postId) {
    const post = window.BLOG_POSTS[postId];
    const blogContentElement = document.getElementById('blog-content');
    const blogTitleElement = document.getElementById('blog-title');
    const blogMetaElement = document.getElementById('blog-meta');
    const headerElement = document.getElementById('header');

    if (post && blogContentElement && blogTitleElement && blogMetaElement && headerElement) {
        document.title = `${post.title} | Joshua Mobley`;
        blogTitleElement.textContent = post.title;
        blogMetaElement.textContent = `Posted on ${post.date}`;
        headerElement.style.backgroundImage = `url('${post.headerImage}')`;

        blogContentElement.dataset.markdown = post.content;
        renderMarkdown(blogContentElement, post.content);
        generateTableOfContents(blogContentElement);
        addEditFunctionality(blogContentElement);
    } else {
        if (blogTitleElement) blogTitleElement.textContent = 'Post Not Found';
        if (blogMetaElement) blogMetaElement.textContent = '';
        if (blogContentElement) blogContentElement.innerHTML = '<div style="text-align:center;padding:2em;"><h2>Sorry, this blog post could not be found.</h2><p>The link may be broken or the post has been removed. <a href=\'index.html#blog\'>Return to the blog list</a>.</p></div>';
        document.title = 'Post Not Found | Joshua Mobley';
    }
}

function renderMarkdown(element, markdown) {
    if (window.marked && window.Prism) {
        const htmlContent = marked.parse(markdown, { breaks: true });
        element.innerHTML = htmlContent;
        setTimeout(() => Prism.highlightAllUnder(element), 0);
    } else {
        console.error("marked.js or Prism.js not loaded");
        element.innerHTML = "<p>Error rendering content (Markdown library not found).</p>";
    }
}

function generateTableOfContents(contentElement) {
    const tocList = document.getElementById('toc-list');
    if (!tocList) return;

    tocList.innerHTML = '';
    const headers = contentElement.querySelectorAll('h1, h2');

    if (headers.length === 0) {
        const sidebar = document.querySelector('.blog-sidebar');
        if (sidebar) sidebar.style.display = 'none';
        return;
    }

    headers.forEach((header) => {
        const text = header.textContent;
        const id = text.toLowerCase().replace(/[^\w]+/g, '-');
        header.id = id;

        const li = document.createElement('li');
        li.classList.add(`toc-${header.tagName.toLowerCase()}`);
        const a = document.createElement('a');
        a.href = `#${id}`;
        a.textContent = text;
        
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.getElementById(id);
            if (target) {
                // Find the absolute top position of the element relative to the document
                const rect = target.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const absoluteTargetTop = rect.top + scrollTop;
                
                window.scrollTo({
                    top: absoluteTargetTop - 110, // Increased offset to clear nav better
                    behavior: 'smooth'
                });
                history.pushState(null, null, `#${id}`);
            }
        });

        li.appendChild(a);
        tocList.appendChild(li);
    });

    // Add scroll spy for TOC
    window.addEventListener('scroll', () => {
        let current = '';
        headers.forEach(header => {
            // Check position relative to the viewport
            const rect = header.getBoundingClientRect();
            // If the header is near the top of the viewport
            if (rect.top <= 130) {
                current = header.id;
            }
        });

        const links = tocList.querySelectorAll('a');
        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

function addEditFunctionality(contentElement) {
    if (window.location.hostname !== 'localhost' && window.location.protocol !== 'file:') {
      return;
    }
    contentElement.addEventListener('click', function handleClick(event) {
        if (contentElement.querySelector('#markdown-editor-textarea')) {
            return;
        }

        const currentMarkdown = contentElement.dataset.markdown || '';

        const editorTextarea = document.createElement('textarea');
        editorTextarea.id = 'markdown-editor-textarea'; 
        editorTextarea.value = currentMarkdown;

        contentElement.innerHTML = '';
        contentElement.appendChild(editorTextarea);
        editorTextarea.focus();

        function autoResizeTextarea() {
            editorTextarea.style.height = 'auto';
            editorTextarea.style.height = editorTextarea.scrollHeight + 'px';
        }

        editorTextarea.addEventListener('input', autoResizeTextarea);
        autoResizeTextarea();

        editorTextarea.addEventListener('blur', function handleBlur() {
            const newMarkdown = editorTextarea.value;
            contentElement.dataset.markdown = newMarkdown;
            renderMarkdown(contentElement, newMarkdown);
        }, { once: true });

        editorTextarea.addEventListener('click', function(e) {
            e.stopPropagation();
        });

    });
}

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('post');

    if (postId) {
        loadBlogPost(postId);
    } else {
        document.getElementById('blog-title').textContent = 'No Post Specified';
    }
});
})();

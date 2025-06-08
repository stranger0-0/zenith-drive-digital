document.addEventListener('DOMContentLoaded', function () {
    const API_URL = "https://public-api.wordpress.com/rest/v1.1/sites/zenithdrivedigital.wordpress.com/posts";
    const POSTS_PER_PAGE = 6;
    let currentPage = 1;

    // Fetch blog posts
    async function fetchBlogPosts(page = 1) {
        try {
            document.getElementById('blog-posts').innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            `;

            const url = `${API_URL}?number=${POSTS_PER_PAGE}&page=${page}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            displayBlogPosts(data.posts);
            const totalPages = Math.ceil(data.found / POSTS_PER_PAGE);
            setupPagination(totalPages, page);
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('blog-posts').innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="alert alert-danger">Failed to load posts. Try refreshing.</div>
                </div>
            `;
        }
    }

    // Display posts
    function displayBlogPosts(posts) {
        const postsContainer = document.getElementById('blog-posts');

        if (!posts || posts.length === 0) {
            postsContainer.innerHTML = `
                <div class="col-12 text-center py-5">
                    <p>No posts found.</p>
                </div>
            `;
            return;
        }

        let postsHTML = '';

        posts.forEach(post => {
            // Use featured_image, fallback to first attachment URL, fallback to placeholder
            const imageUrl = post.featured_image ||
                (post.attachments && Object.values(post.attachments)[0]?.URL) ||
                'https://via.placeholder.com/600x400?text=No+Image';

            const cleanExcerpt = post.excerpt.replace(/<[^>]+>/g, '').substring(0, 150);

            postsHTML += `
                <div class="col-md-6 col-lg-4 mb-4">
                    <article class="blog-post h-100">
                        <img src="${imageUrl}" alt="${post.title}" class="post-image">
                        <div class="post-content">
                            <h2 class="post-title"><a href="post.html?id=${post.ID}">${post.title}</a></h2>
                            <div class="post-meta">Posted on ${new Date(post.date).toLocaleDateString()}</div>
                            <p class="post-excerpt">${cleanExcerpt}...</p>
                            <a href="post.html?id=${post.ID}" class="read-more">Read More →</a>
                        </div>
                    </article>
                </div>
            `;
        });

        postsContainer.innerHTML = postsHTML;
    }

    // Setup pagination
    function setupPagination(totalPages, currentPage) {
        const paginationContainer = document.getElementById('pagination');

        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let paginationHTML = '<ul class="pagination justify-content-center">';

        if (currentPage > 1) {
            paginationHTML += `
                <li class="page-item">
                    <a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a>
                </li>
            `;
        }

        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }

        if (currentPage < totalPages) {
            paginationHTML += `
                <li class="page-item">
                    <a class="page-link" href="#" data-page="${currentPage + 1}">Next</a>
                </li>
            `;
        }

        paginationHTML += '</ul>';
        paginationContainer.innerHTML = paginationHTML;

        document.querySelectorAll('.page-link').forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const page = parseInt(this.getAttribute('data-page'));
                if (page !== currentPage) {
                    currentPage = page;
                    fetchBlogPosts(page);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        });
    }

    // Initial load
    fetchBlogPosts(currentPage);
});

document.addEventListener('DOMContentLoaded', function() {
    const postId = new URLSearchParams(window.location.search).get('id');
    
    if (!postId) {
        document.getElementById('single-post').innerHTML = `
            <div class="alert alert-danger">Post not found.</div>
        `;
        return;
    }
    
    // ✅ CORRECT WORDPRESS.COM API URL
    const API_URL = `https://public-api.wordpress.com/rest/v1.1/sites/zenithdrivedigital.wordpress.com/posts/${postId}?_embed`;
    
    fetch(API_URL)
        .then(response => {
            if (!response.ok) throw new Error("Post not found");
            return response.json();
        })
        .then(post => {
            console.log("Post data:", post); // Debug
            displayPost(post);
        })
        .catch(error => {
            console.error("API Error:", error);
            document.getElementById('single-post').innerHTML = `
                <div class="alert alert-danger">Error: ${error.message}</div>
            `;
        });


    function displayPost(post) {
    // 1. Handle missing featured image
    const imageUrl = post.featured_image || 'images/placeholder.jpg';
    
    // 2. Add error handling for broken images
    const imageHTML = `
    `;

    // 3. Sanitize cont
    // ent (optional but recommended)
    const content = post.content || '<p>No content available</p>';
    
    const postHTML = `
        <div class="post-header">
            <h1>${post.title}</h1>
            <div class="post-meta">
                ${new Date(post.date).toLocaleDateString()}
            </div>
        </div>
        ${imageHTML}
        <div class="post-content">${content}</div>
    `;
    
    document.getElementById('single-post').innerHTML = postHTML;
}
});
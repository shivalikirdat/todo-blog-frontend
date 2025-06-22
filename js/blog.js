// Load posts on page load
document.addEventListener('DOMContentLoaded', function () {
    loadPosts();

    // Handle new post submission
    document.getElementById('postForm').addEventListener('submit', function (e) {
        e.preventDefault();
        addPost();
    });
});

// Load posts from LocalStorage
function loadPosts() {
    const postsList = document.getElementById('postsList');
    postsList.innerHTML = '';

    const posts = JSON.parse(localStorage.getItem('posts')) || [];

    posts.reverse().forEach((post, index) => {
        const postCard = document.createElement('div');
        postCard.className = 'post-card';

        postCard.innerHTML = `
            <div class="post-title">${post.title}</div>
            <div class="post-content">${post.content.substring(0, 100)}...</div>
            <div class="post-actions">
                <button class="btn btn-secondary btn-sm" onclick="viewPost(${index})">View</button>
                <button class="btn btn-warning btn-sm" onclick="editPost(${index})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deletePost(${index})">Delete</button>
            </div>
        `;
        postsList.appendChild(postCard);
    });
}

// Add new post
function addPost() {
    const title = document.getElementById('postTitle').value.trim();
    const content = document.getElementById('postContent').value.trim();

    if (!title || !content) return;

    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.push({
        title: title,
        content: content,
        created_at: new Date().toISOString()
    });

    localStorage.setItem('posts', JSON.stringify(posts));
    document.getElementById('postForm').reset();
    loadPosts();
}

// View full post (simple alert for now)
function viewPost(index) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const post = posts[index];
    alert(`Title: ${post.title}\n\n${post.content}`);
}

// Edit post
function editPost(index) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const post = posts[index];

    const newTitle = prompt('Edit Title:', post.title);
    const newContent = prompt('Edit Content:', post.content);

    if (newTitle && newContent) {
        posts[index].title = newTitle;
        posts[index].content = newContent;
        localStorage.setItem('posts', JSON.stringify(posts));
        loadPosts();
    }
}

// Delete post
function deletePost(index) {
    if (confirm('Are you sure you want to delete this post?')) {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts.splice(index, 1);
        localStorage.setItem('posts', JSON.stringify(posts));
        loadPosts();
    }
}

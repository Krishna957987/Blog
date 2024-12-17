document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const clearSearchBtn = document.getElementById('clear-search');
    const info = document.getElementById('Info');

    window.addEventListener("load", () => {
        loadinfo();
    });

    function loadinfo() {
        fetch("/recent-post", { method: "GET" })
            .then((res) => res.json())
            .then((data) => {
                console.log(data, "hello");
                info.innerHTML = ""; // Clear the existing list
                data.forEach((session) => {
                    const studyItem = document.createElement("div");
                    studyItem.className = "study-item";
                    studyItem.innerHTML = `
                        <div class="study-banner">
                            <img src="${session.banner}" alt="Banner Image" class="banner-img">
                        </div>
                        <h3 class="study-title">${session.title}</h3>
                        <p class="study-date">Date: ${session.date}</p>
                        <p class="study-notes">${session.info}</p>
                        <button onclick="updateBlog(${session.id})">Update</button>
                        <button onclick="deleteBlog(${session.id})">Delete</button>
                    `;
                    info.appendChild(studyItem);
                });
            })
            .catch((error) => {
                console.error("Error fetching blog post:", error);
            });
    }

    searchInput.addEventListener('input', filterPosts);

    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearSearchBtn.style.display = 'none';
        showAllPosts();
    });

    function filterPosts() {
        const filter = searchInput.value.toLowerCase();
        const blogPosts = document.querySelectorAll('.study-item');

        blogPosts.forEach(post => {
            const title = post.querySelector('.study-title').textContent.toLowerCase();
            if (title.includes(filter)) {
                post.classList.remove('hidden');
            } else {
                post.classList.add('hidden');
            }
        });

        // Show clear button when input is not empty
        

    function showAllPosts() {
        const blogPosts = document.querySelectorAll('.study-item');
        blogPosts.forEach(post => post.classList.remove('hidden'));
    }

    window.updateBlog = function(blogId) {
        window.location.href = `/editor.html?blogId=${blogId}`;
    };

    window.deleteBlog = function(blogId) {
        fetch(`/delete-blog/${blogId}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(response => {
                console.log(response.message);
                loadinfo();
            })
            .catch(error => console.error('Error deleting blog post:', error));
    };
};})

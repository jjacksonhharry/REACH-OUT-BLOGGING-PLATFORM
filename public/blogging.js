document.getElementById('headerImage').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.getElementById('imagePreview');
            img.src = e.target.result;
            img.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');

    if (blogId) {
        try {
            const response = await fetch(`http://localhost:3000/api/user/blogs/${blogId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const blog = await response.json();
                document.getElementById('title').value = blog.title;
                document.getElementById('content').value = blog.content;
                // If you want to show the existing image preview
                const img = document.getElementById('imagePreview');
                img.src = `/uploads/${blog.image}`;
                img.style.display = 'block';
            } else {
                document.getElementById('message').textContent = 'Error loading blog for editing';
            }
        } catch (error) {
            console.error('Error fetching blog:', error);
            document.getElementById('message').textContent = 'Error fetching blog';
        }
    }

    document.getElementById('blogForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        const imageFile = document.getElementById('headerImage').files[0];

        if (!title || !content) {
            document.getElementById('message').textContent = 'Please fill out all fields.';
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (imageFile) {
            formData.append('headerImage', imageFile);
        }

        const url = blogId ? `http://localhost:3000/api/user/blogs/${blogId}` : 'http://localhost:3000/api/blogs';
        const method = blogId ? 'PUT' : 'POST';

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(url, {
                method: method,
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Server response:', data); // Log the server response for debugging
                document.getElementById('message').textContent = data.message;
                document.getElementById('blogForm').reset(); // Reset form after successful submission

                // Redirect to userblogs.html or wherever appropriate after editing
                window.location.href = 'userblogs.html';
            } else {
                const errorData = await response.json();
                console.error('Error submitting blog:', errorData);
                document.getElementById('message').textContent = `Error: ${errorData.message}`;
            }
        } catch (error) {
            console.error('Error submitting blog:', error);
            document.getElementById('message').textContent = 'Error submitting blog';
        }
    });
});

document.addEventListener('DOMContentLoaded', async function() {
const blogContainer = document.getElementById('blogContainer');

try {
    const response = await fetch('http://localhost:3000/api/blogs', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Error fetching blogs');
    }

    const blogs = await response.json();

    if (blogs.length === 0) {
        blogContainer.innerHTML = '<p>No blogs found.</p>';
    } else {
        blogs.forEach(blog => {
            const blogCard = document.createElement('div');
            blogCard.classList.add('card');

            blogCard.innerHTML = `
                <a href="viewblogs.html?id=${blog._id}" class="blog-link">
                    <div class="thumb" style="background-image: url(/uploads/${blog.image});"></div>
                    <article>
                        <h1>${blog.title}</h1>
                        <p>${blog.content.substring(0, 100)}...</p>
                        <span>${new Date(blog.createdAt).toLocaleDateString()}</span>
                        <p>By: ${blog.user && blog.user.username ? blog.user.username : 'Unidentified'}</p>
                    </article>
                </a>
            `;

            blogContainer.prepend(blogCard);
        });
    }
} catch (error) {
    console.error('Error fetching blogs:', error);
    blogContainer.innerHTML = '<p>Error fetching blogs. Please try again later.</p>';
}
});
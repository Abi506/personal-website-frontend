import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { blogUrl } from '../apiUrl';
import './blog.css';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogUrl, setNewBlogUrl] = useState('');
  const [showAddBlogForm, setShowAddBlogForm] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null); // Store blog ID to delete

  // Fetch blogs from the backend
  const fetchBlogs = async () => {
    try {
      const response = await axios.get(blogUrl); // Update with correct backend URL
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs', error);
    }
  };

  // Add a new blog
  const addBlog = async () => {
    try {
      const response = await axios.post(`${blogUrl}/add`, {
        title: newBlogTitle,
        link: newBlogUrl,
      });
      setBlogs([...blogs, response.data]); // Add to the existing list of blogs
      setNewBlogTitle('');
      setNewBlogUrl('');
      setShowAddBlogForm(false); // Hide form after adding
    } catch (error) {
      console.error('Error adding blog', error);
    }
  };

  // Handle 'Read Blog' click (Open in new tab)
  const handleReadBlog = (link) => {
    window.open(link, '__blank'); // Open the blog link in a new tab
  };

  // Handle the delete action when user clicks on 'Delete' button
  const handleDeleteClick = (blogId) => {
    setBlogToDelete(blogId); // Set the blog ID for deletion
    setShowConfirmDelete(true); // Show the confirmation dialog
  };

  // Confirm deletion
  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${blogUrl}/${blogToDelete}`); // Delete the blog
      setBlogs(blogs.filter((blog) => blog._id !== blogToDelete)); // Remove the deleted blog from state
      setShowConfirmDelete(false); // Close the confirmation dialog
      setBlogToDelete(null); // Reset the blog to delete
    } catch (error) {
      console.error('Error deleting blog', error);
    }
  };

  // Cancel deletion
  const handleCancelDelete = () => {
    setShowConfirmDelete(false); // Close the confirmation dialog without deleting
    setBlogToDelete(null); // Reset the blog to delete
  };

  useEffect(() => {
    fetchBlogs(); // Fetch blogs when the component mounts
  }, []);

  return (
    <div className="container mt-4">
      <h2>Blog Management</h2>

      {/* Add Blog Button */}
      <button
        onClick={() => setShowAddBlogForm(!showAddBlogForm)}
        className="btn btn-danger mt-4"
      >
        {showAddBlogForm ? 'Cancel' : 'Add New Blog'}
      </button>

      {/* Add Blog Form */}
      {showAddBlogForm && (
        <div className="mt-4">
          <h3>Add a New Blog</h3>
          <input
            type="text"
            className="form-control"
            placeholder="Blog Title"
            value={newBlogTitle}
            onChange={(e) => setNewBlogTitle(e.target.value)}
          />
          <input
            type="url"
            className="form-control mt-3"
            placeholder="Blog URL"
            value={newBlogUrl}
            onChange={(e) => setNewBlogUrl(e.target.value)}
          />
          <button onClick={addBlog} className="btn btn-secondary mt-3">
            Add Blog
          </button>
        </div>
      )}

      {/* Display Blogs */}
      <div className="row mt-4">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div className="col-md-4 mb-4" key={blog._id}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{blog.title}</h5>
                  <a
                    href="#"
                    onClick={() => handleReadBlog(blog.link)}
                    className="btn btn-primary"
                  >
                    Read Blog
                  </a>
                  <button
                    onClick={() => handleDeleteClick(blog._id)}
                    className="btn btn-danger ml-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No blogs available</p>
        )}
      </div>

      {/* Confirmation Popup for Delete */}
      {showConfirmDelete && (
        <div className="confirm-delete-popup">
          <div className="popup-content">
            <h5>Are you sure you want to delete this blog?</h5>
            <button onClick={handleConfirmDelete} className="btn btn-danger">
              Yes, Delete
            </button>
            <button onClick={handleCancelDelete} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;

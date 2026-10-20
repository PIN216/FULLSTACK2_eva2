import React, { useContext } from 'react';
import { BlogService } from '../services/blogService';
import { StoreContext } from '../context/StoreContext';
import { BlogCard } from '../components/tienda/BlogCard';

export const BlogsView = () => {
  const blogs = BlogService.getBlogs();
  const { setSelectedBlogId, setCurrentView } = useContext(StoreContext);

  return (
    <div className="container py-4">
      <h2 className="fw-bold text-brown mb-4">Nuestros Artículos y Noticias</h2>
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {blogs.map(blog => (
          <div className="col" key={blog.id}>
            <BlogCard blog={blog} onSelect={(id) => { setSelectedBlogId(id); setCurrentView('detalle_blog'); }} />
          </div>
        ))}
      </div>
    </div>
  );
};

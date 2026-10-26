import React, { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { BlogService } from '../../services/blogService';

export const DetalleBlog = () => {
  const { selectedBlogId, setCurrentView } = useContext(StoreContext);
  const blog = BlogService.getBlogById(selectedBlogId) || BlogService.getBlogs()[0];

  return (
    <div className="container py-5">
      <div className="card shadow-sm border-0 p-5 mx-auto" style={{ maxWidth: '800px' }}>
        <h2 className="fw-bold text-brown brand-font mb-3">{blog.titulo}</h2>
        <p className="lead text-muted">{blog.resumen}</p>
        <hr />
        <p className="fs-6 lh-lg">{blog.contenido}</p>
        <button className="btn btn-outline-secondary mt-4" onClick={() => setCurrentView('blogs')}>Volver a Blogs</button>
      </div>
    </div>
  );
};

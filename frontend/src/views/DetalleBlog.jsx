import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import { BlogService } from '../services/blogService';

export const DetalleBlog = () => {
  const { selectedBlogId, setCurrentView } = useContext(StoreContext);
  const blog = BlogService.getBlogById(selectedBlogId) || BlogService.getBlogs()[0];

  return (
    <div className="container py-5">
      <div className="card shadow-sm border-0 p-4 p-md-5 mx-auto" style={{ maxWidth: '800px' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="badge bg-warning text-dark px-3 py-2">Artículo #{blog.id}</span>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => setCurrentView('blogs')}>
            <i className="bi bi-arrow-left me-1"></i> Volver a Blogs
          </button>
        </div>
        <h2 className="fw-bold text-brown brand-font mb-3">{blog.titulo}</h2>
        <p className="lead text-muted">{blog.resumen}</p>
        <hr className="my-4" />
        <p className="fs-6 lh-lg text-secondary" style={{ whiteSpace: 'pre-line' }}>{blog.contenido}</p>
        <div className="mt-4 pt-3 border-top d-flex justify-content-between">
          <button className="btn btn-primary-custom" onClick={() => setCurrentView('blogs')}>
            Ver todos los artículos
          </button>
          <button className="btn btn-outline-primary" onClick={() => setCurrentView('home')}>
            Ir a la Tienda
          </button>
        </div>
      </div>
    </div>
  );
};


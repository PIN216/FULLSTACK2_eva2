import React from 'react';

export const BlogCard = ({ blog, onSelect }) => (
  <div className="card h-100 shadow-sm border-0 p-3">
    <h5 className="fw-bold text-brown">{blog.titulo}</h5>
    <p className="text-muted small flex-grow-1">{blog.resumen}</p>
    <button className="btn btn-sm btn-outline-primary mt-2" onClick={() => onSelect(blog.id)}>Leer artículo</button>
  </div>
);

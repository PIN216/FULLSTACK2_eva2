import React from 'react';

export const BlogCard = ({ blog }) => {
  return (
    <div className="card h-100 shadow-sm border-0">
      <div className="card-body">
        <h5 className="card-title fw-bold">{blog?.titulo || 'Título del Blog'}</h5>
        <p className="card-text text-muted">{blog?.resumen || 'Resumen de la publicación...'}</p>
      </div>
    </div>
  );
};
import { Link } from 'react-router-dom';
import type { Post } from '../types';

export function PostCard({
  post,
  authorName = 'estudiante',
}: {
  post: Post;
  authorName?: string;
}) {
  const firstLetter = (authorName || 'E').charAt(0).toUpperCase();
  const commentsCount = Array.isArray(post.Comments) ? post.Comments.length : 0;

  const firstImage =
    Array.isArray(post.imagen) &&
      post.imagen.length > 0 &&
      typeof post.imagen[0] === 'object'
      ? post.imagen[0].imageUrl
      : null;

  return (
    <div className="card card-unahur p-3 shadow-sm">
      {/* Cabecera de autor */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center gap-2">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
            style={{ width: '36px', height: '36px', backgroundColor: '#5c3d88' }}
          >
            {firstLetter}
          </div>
          <div>
            <h6 className="mb-0 fw-semibold text-dark" style={{ fontSize: '0.95rem' }}>
              {authorName}
            </h6>
            <small className="text-muted" style={{ fontSize: '0.75rem' }}>
              @{authorName}
            </small>
          </div>
        </div>
        <span className="text-muted">...</span>
      </div>

      {/* Descripcion de la publicacion */}
      <p className="text-dark mb-3" style={{ fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>
        {post.description}
      </p>

      {/* Imagenes asociadas */}
      {firstImage && (
        <div className="mb-3 rounded overflow-hidden bg-dark" style={{ maxHeight: '300px' }}>
          <img
            src={firstImage}
            alt="Contenido de publicación"
            className="w-100 object-fit-cover"
            style={{ height: '240px' }}
          />
        </div>
      )}

      {/* Etiquetas */}
      {Array.isArray(post.tags) && post.tags.length > 0 && (
        <div className="d-flex flex-wrap gap-1 mb-3">
          {post.tags.map((tag, index) => {
            if (typeof tag !== 'object' || tag === null) return null;
            return (
              <span
                key={tag.id || index}
                className="badge bg-secondary"
                style={{ fontSize: '0.75rem' }}
              >
                #{tag.name}
              </span>
            );
          })}
        </div>
      )}

      {/* Pie de tarjeta (comentarios y ver mas) */}
      <div className="d-flex align-items-center justify-content-between pt-2 border-top">
        <small className="text-muted">
          {commentsCount} {commentsCount === 1 ? 'comentario' : 'comentarios'}
        </small>
        <Link to={`/post/${post.id}`} className="btn btn-unahur-primary btn-sm px-3">
          Ver más
        </Link>
      </div>
    </div>
  );
}
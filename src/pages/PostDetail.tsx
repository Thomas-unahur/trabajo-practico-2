import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getImagesByPost, getPostById } from "../services/postService";
import { createComment, getCommentsByPost } from "../services/commentService";
import { getUserById } from "../services/userService";
import type { Comment, Post, PostImage } from "../types";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [authorName, setAuthorName] = useState<string>("estudiante");
  const [images, setImages] = useState<PostImage[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [content, setContent] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const postId = Number(id);
    if (!id || Number.isNaN(postId)) {
      setError("ID de publicación inválido.");
      setLoading(false);
      return;
    }

    async function cargarDetalle() {
      setLoading(true);
      setError(null);
      try {
        const [postData, imagesData, commentsData] = await Promise.all([
          getPostById(postId),
          getImagesByPost(postId),
          getCommentsByPost(postId),
        ]);

        setPost(postData);
        setImages(imagesData);
        setComments(commentsData.filter((c) => c.visible !== false));

        const authorId = postData.UserId ?? postData.userId;
        if (postData.User?.nickName) {
          setAuthorName(postData.User.nickName);
        } else if (authorId) {
          getUserById(Number(authorId))
            .then((userData) => setAuthorName(userData.nickName))
            .catch(() => {});
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "No se pudo cargar la publicación."
        );
      } finally {
        setLoading(false);
      }
    }

    cargarDetalle();
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!content.trim()) {
      setFormError("El comentario no puede estar vacío.");
      return;
    }
    if (!user) return;

    setSubmitting(true);
    try {
      const nuevoComentario = await createComment({
        content: content.trim(),
        userId: Number(user.id),
        postId: Number(id),
      });

      try {
        const updatedComments = await getCommentsByPost(Number(id));
        setComments(updatedComments.filter((c) => c.visible !== false));
      } catch {
        setComments((prev) => [
          { ...nuevoComentario, User: nuevoComentario.User ?? user },
          ...prev,
        ]);
      }
      setContent("");
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Error al enviar el comentario."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="post-detail-container">
        <div className="card card-unahur post-detail-card text-center py-5">
          <div className="spinner-border text-secondary mx-auto mb-2" role="status" />
          <small className="text-muted">Cargando publicación...</small>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="post-detail-container">
        <div className="card card-unahur post-detail-card text-center py-4">
          <p className="text-danger mb-3">{error || "Publicación no encontrada."}</p>
          <button
            type="button"
            className="btn btn-unahur-primary btn-sm px-4"
            onClick={() => navigate("/")}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="post-detail-container">
      <button
        type="button"
        className="btn btn-outline-light btn-sm mb-3"
        onClick={() => navigate(-1)}
      >
        ← Volver
      </button>

      {/* Publicación */}
      <article className="card card-unahur post-detail-card mb-4">
        <div className="d-flex align-items-center gap-3 mb-3">
          <div className="post-detail-avatar">
            {authorName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h5 className="mb-0 fw-bold">{authorName}</h5>
            <small className="text-muted">@{authorName}</small>
          </div>
        </div>

        <p className="post-detail-description mb-3">{post.description}</p>

        {post.tags?.length > 0 && (
          <div className="d-flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag) => (
              <span key={tag.id} className="badge bg-secondary">
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        {images.length > 0 && (
          <div className="post-detail-gallery mt-3">
            {images.map((img) => (
              <div key={img.id} className="post-detail-image-wrapper">
                <img
                  src={img.imageUrl}
                  alt="Imagen de la publicación"
                  className="post-detail-image"
                />
              </div>
            ))}
          </div>
        )}

        <div className="d-flex align-items-center justify-content-between pt-3 mt-3 border-top">
          <small className="text-muted">
            {comments.length} {comments.length === 1 ? "comentario" : "comentarios"}
          </small>
        </div>
      </article>

      {/* Comentarios y formulario */}
      <section className="card card-unahur comments-section-card">
        <h5 className="fw-bold mb-3">Comentarios ({comments.length})</h5>

        <div className="comment-form-block mb-4">
          {isAuthenticated && user ? (
            <form onSubmit={handleSubmit}>
              <label htmlFor="comment-content" className="form-label fw-semibold">
                Comentar como @{user.nickName}
              </label>

              <textarea
                id="comment-content"
                className={`form-control comment-textarea mb-2 ${formError ? "is-invalid" : ""
                  }`}
                rows={3}
                placeholder="Escribí tu comentario..."
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  if (formError) setFormError(null);
                }}
                disabled={submitting}
              />

              {formError && (
                <div className="invalid-feedback d-block mb-2">{formError}</div>
              )}

              <div className="d-flex justify-content-end">
                <button
                  type="submit"
                  className="btn btn-unahur-primary btn-sm px-4"
                  disabled={submitting}
                >
                  {submitting ? "Publicando..." : "Comentar"}
                </button>
              </div>
            </form>
          ) : (
            <div className="d-flex justify-content-between align-items-center">
              <span className="small text-muted">
                Iniciá sesión para dejar un comentario.
              </span>
              <Link to="/login" className="btn btn-unahur-primary btn-sm px-3">
                Ingresar
              </Link>
            </div>
          )}
        </div>

        {comments.length === 0 ? (
          <p className="text-muted small mb-0 text-center">
            No hay comentarios todavía.
          </p>
        ) : (
          <div className="comments-list">
            {comments.map((comment) => {
              const autor =
                comment.User?.nickName ||
                (typeof comment.idUser === "object" && comment.idUser !== null
                  ? comment.idUser.nickName
                  : "estudiante");

              return (
                <div key={comment.id} className="comment-item">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <div className="comment-avatar">
                      {autor.charAt(0).toUpperCase()}
                    </div>
                    <span className="fw-semibold small">@{autor}</span>
                  </div>
                  <p className="comment-content">{comment.content}</p>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
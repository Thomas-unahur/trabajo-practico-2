import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getPostsByUser } from "../services/postService";
import type { Post } from "../types";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    async function cargarMisPublicaciones() {
      setLoading(true);
      setError(null);
      try {
        const data = await getPostsByUser(Number(user!.id));
        setPosts(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "No se pudieron cargar tus publicaciones."
        );
      } finally {
        setLoading(false);
      }
    }

    cargarMisPublicaciones();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  const userInitial = (user.nickName || "U").charAt(0).toUpperCase();

  return (
    <div className="profile-container">
      {/* Cabecera de usuario */}
      <section className="card card-unahur profile-header-card mb-4">
        <div className="d-flex justify-content-between align-items-center profile-header-content">
          <div className="d-flex align-items-center gap-3">
            <div className="profile-avatar">{userInitial}</div>
            <div>
              <h4 className="mb-1 fw-bold">@{user.nickName}</h4>
              <span className="profile-stat-pill">
                {posts.length}{" "}
                {posts.length === 1 ? "publicación" : "publicaciones"}
              </span>
            </div>
          </div>

          <div className="d-flex gap-2">
            <Link
              to="/create-post"
              className="btn btn-unahur-primary btn-sm px-3"
            >
              Nueva publicación
            </Link>
            <button
              type="button"
              className="btn btn-outline-danger btn-sm px-3"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </section>

      {/* Listado de publicaciones del usuario */}
      <section>
        <h5 className="fw-bold mb-3">Mis publicaciones</h5>

        {loading ? (
          <div className="card card-unahur profile-post-item text-center py-5">
            <div className="spinner-border text-secondary mx-auto mb-2" role="status" />
            <small className="text-muted">Cargando publicaciones...</small>
          </div>
        ) : error ? (
          <div className="card card-unahur profile-post-item text-center py-4">
            <p className="text-danger mb-0">{error}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="card card-unahur profile-post-item text-center py-4">
            <p className="text-muted mb-3">
              Todavía no creaste ninguna publicación.
            </p>
            <div>
              <Link
                to="/create-post"
                className="btn btn-unahur-primary btn-sm px-4"
              >
                Crear primera publicación
              </Link>
            </div>
          </div>
        ) : (
          <div className="profile-posts-list">
            {posts.map((post) => {
              const visibleCommentsCount = Array.isArray(post.Comments)
                ? post.Comments.filter((c) => c?.visible !== false).length
                : 0;

              return (
                <article
                  key={post.id}
                  className="card card-unahur profile-post-item"
                >
                  <p className="profile-post-description mb-3">
                    {post.description}
                  </p>

                  <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                    <small className="text-muted">
                      {visibleCommentsCount}{" "}
                      {visibleCommentsCount === 1
                        ? "comentario visible"
                        : "comentarios visibles"}
                    </small>
                    <Link
                      to={`/post/${post.id}`}
                      className="btn btn-unahur-primary btn-sm px-3"
                    >
                      Ver más
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
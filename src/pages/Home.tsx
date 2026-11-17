import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PostCard } from '../components/PostCard';
import { getPosts } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import type { Post } from '../types';
import styles from './Home.module.css';

export default function Home() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    useEffect(() => {
        getPosts()
            .then((data) => {
                setPosts(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError('No se pudieron cargar las publicaciones recientes.');
                setLoading(false);
            });
    }, []);

    const availableTags = Array.from(
        new Map(
            posts
                .flatMap((post) => post.tags || [])
                .map((tag) => [tag.name.toLowerCase(), tag])
        ).values()
    );

    const filteredPosts = posts.filter((post) => {
        const authorNick =
            typeof post.idUser === 'object' && post.idUser !== null
                ? post.idUser.nickName
                : '';

        const matchesSearch =
            post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            authorNick.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesTag = selectedTag
            ? post.tags?.some((t) => t.name.toLowerCase() === selectedTag.toLowerCase())
            : true;

        return matchesSearch && matchesTag;
    });

    // Contar cuantos posts pertenecen al usuario logueado
    const userPostsCount = isAuthenticated && user
        ? posts.filter((post) => {
            const authorId = typeof post.idUser === 'object' && post.idUser !== null ? post.idUser.id : post.idUser;
            return authorId === user.id;
          }).length
        : 0;

    return (
        <div className={`container ${styles.pageContainer}`}>
            {/* El banner de bienvenida solo se muestra si no esta autenticado */}
            {!isAuthenticated && (
                <div className={`card p-4 mb-4 text-center border-0 shadow-sm ${styles.bannerCard}`}>
                    <h3 className={`fw-bold mb-2 ${styles.bannerTitle}`}>🎓 Bienvenidos a UnaHur Anti-Social Net</h3>
                    <p className="text-muted mb-2 fst-italic">
                        "La red oficial donde la comunidad universitaria comparte apuntes, proyectos y sobrevive a los finales en equipo."
                    </p>
                    <div className="d-flex justify-content-center gap-3 flex-wrap small text-muted">
                        <span>⚡ Dato curioso: El 99% de los bugs se resuelven tomando mate.</span>
                        <span>🚀 Estado del sistema: 100% Activo</span>
                    </div>
                </div>
            )}

            <div className="row g-4">
                {/* columna izquierda: Si esta logueado muestra su perfil, sino "sobre nosotros" */}
                <div className="col-12 col-lg-3">
                    {isAuthenticated ? (
                        <div className={`card p-3 mb-3 ${styles.cardUnahur}`}>
                            <div className={styles.avatarContainer}>
                                <div className={styles.avatarLarge}>
                                    {user?.nickName ? user.nickName.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <p className={styles.userName}>@{user?.nickName || 'estudiante'}</p>
                            </div>
                            <div className={styles.profileStats}>
                                <div className={styles.statItem}>
                                    <p className={styles.statNumber}>{userPostsCount}</p>
                                    <p className={styles.statLabel}>Posts</p>
                                </div>
                                <div className={styles.statItem}>
                                    <Link to="/profile" className="text-decoration-none text-dark">
                                        <p className={styles.statNumber} style={{ fontSize: '0.85rem' }}>Mi Perfil</p>
                                        <p className={styles.statLabel}>Ver cuenta</p>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={`card p-3 mb-3 ${styles.cardUnahur}`}>
                            <h6 className={`fw-bold mb-3 ${styles.cardTitle}`}>Sobre nosotros</h6>
                            <ul className="list-unstyled mb-0 d-flex flex-column gap-2 small text-muted">
                                <li className="d-flex align-items-center gap-2">
                                    <span>🛡️</span>
                                    <span>UnaHur Anti-Social Net</span>
                                </li>
                                <li className="d-flex align-items-center gap-2">
                                    <span>🏛️</span>
                                    <span>Comunidad Universitaria</span>
                                </li>
                                <li className="d-flex align-items-center gap-2">
                                    <span>💻</span>
                                    <span>React, TS & Bootstrap</span>
                                </li>
                            </ul>
                        </div>
                    )}

                    <div className={`card p-3 ${styles.cardUnahur}`}>
                        <h6 className={`fw-bold mb-2 small text-uppercase ${styles.cardTitle}`}>Actividad de red</h6>
                        <div className="d-flex justify-content-between align-items-center small text-muted">
                            <span>Publicaciones totales</span>
                            <span className="badge bg-secondary rounded-pill">{posts.length}</span>
                        </div>
                    </div>
                </div>

                {/* columna central: feed de publicaciones recientes + buscador */}
                <div className="col-12 col-lg-6">
                    {isAuthenticated ? (
                        <div
                            className={`card p-3 mb-3 ${styles.cardUnahur}`}
                            onClick={() => navigate('/create-post')}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="d-flex align-items-center gap-3">
                                <div className={styles.avatarSmall}>
                                    {user?.nickName ? user.nickName.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <input
                                    type="text"
                                    readOnly
                                    className={`form-control ${styles.composerInput}`}
                                    placeholder={`¿Qué estás pensando, @${user?.nickName || 'estudiante'}?`}
                                />
                                <button type="button" className={`btn btn-sm px-3 flex-shrink-0 ${styles.btnPrimary}`}>
                                    Postear
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className={`card p-4 mb-3 text-center ${styles.cardUnahur}`}>
                            <h6 className={`fw-bold mb-1 ${styles.cardTitle}`}>Sumate a la comunidad UnaHur</h6>
                            <p className="small text-muted mb-3">
                                Iniciá sesión para crear publicaciones, dejar comentarios y etiquetar contenido.
                            </p>
                            <div className="d-flex justify-content-center gap-2">
                                <Link to="/login" className={`btn btn-sm px-4 ${styles.btnSecondaryCard}`}>
                                    Ingresar
                                </Link>
                                <Link to="/register" className={`btn btn-sm px-4 ${styles.btnPrimary}`}>
                                    Registrarse
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Barra de busqueda en el feed */}
                    <div className="d-flex gap-2 mb-3 align-items-center">
                        <input
                            type="text"
                            className={`form-control form-control-sm ${styles.composerInput}`}
                            placeholder="🔍 Buscar en las publicaciones..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {selectedTag && (
                            <button
                                type="button"
                                className="btn btn-sm btn-secondary text-white d-flex align-items-center gap-1 flex-shrink-0"
                                onClick={() => setSelectedTag(null)}
                            >
                                <span>#{selectedTag}</span>
                                <span>✕</span>
                            </button>
                        )}
                    </div>

                    {/* Renderizado del feed segun estado */}
                    {loading ? (
                        <div className={`card p-5 text-center ${styles.cardUnahur}`}>
                            <div className="spinner-border text-secondary mx-auto mb-2" role="status" />
                            <small className="text-muted">Cargando publicaciones recientes...</small>
                        </div>
                    ) : error ? (
                        <div className={`card p-4 text-center border-danger ${styles.cardUnahur}`}>
                            <p className="text-danger mb-0 small">{error}</p>
                        </div>
                    ) : filteredPosts.length === 0 ? (
                        <div className={`card p-5 text-center ${styles.cardUnahur}`}>
                            <p className="fw-semibold mb-1">No hay publicaciones disponibles todavía.</p>
                            <p className="text-muted small mb-0">Sé el primero en compartir algo con la facultad.</p>
                        </div>
                    ) : (
                        <div className="d-flex flex-column gap-3">
                            {filteredPosts.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>
                    )}
                </div>

                {/* columna derecha: etiquetas interactivas y usuarios */}
                <div className="col-12 col-lg-3">
                    <div className={`card p-3 mb-3 ${styles.cardUnahur}`}>
                        <h6 className={`fw-bold mb-3 ${styles.cardTitle}`}>Usuarios registrados</h6>
                        <div className="d-flex flex-column gap-2">
                            <div className="d-flex align-items-center gap-2">
                                <div className={styles.avatarSmall}>T</div>
                                <span className="small text-dark">@thomas</span>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <div className="avatarSmall" style={{ width: '32px', height: '32px', backgroundColor: '#5c3d88', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>P</div>
                                <span className="small text-dark">@pepe</span>
                            </div>
                        </div>
                    </div>

                    <div className={`card p-3 ${styles.cardUnahur}`}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className={`fw-bold mb-0 ${styles.cardTitle}`}>Etiquetas</h6>
                            {selectedTag && (
                                <button
                                    type="button"
                                    className="btn btn-link btn-sm p-0 text-decoration-none text-muted"
                                    onClick={() => setSelectedTag(null)}
                                >
                                    Limpiar
                                </button>
                            )}
                        </div>

                        {availableTags.length === 0 ? (
                            <p className="small text-muted mb-0">Sin etiquetas registradas.</p>
                        ) : (
                            <div className="d-flex flex-wrap gap-2">
                                {availableTags.map((tag) => {
                                    const isActive = selectedTag?.toLowerCase() === tag.name.toLowerCase();
                                    return (
                                        <button
                                            key={tag.id}
                                            type="button"
                                            onClick={() => setSelectedTag(isActive ? null : tag.name)}
                                            className={`badge px-2 py-2 ${isActive ? styles.tagActive : styles.tagInactive}`}
                                        >
                                            #{tag.name}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
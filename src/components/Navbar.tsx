import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';

export function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-dark ${styles.navbarUnahur} py-3 shadow-sm`}>
      <div className="container-fluid px-4">
        {/* Logo */}
        <Link to="/" className={`navbar-brand ${styles.brandContainer}`}>
          <span className={styles.brandBadge}>H</span>
          <span className={styles.brandText}>unahur</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#basic-navbar-nav"
          aria-controls="basic-navbar-nav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="basic-navbar-nav">
          <div className={styles.navContainer}>
            <NavLink to="/" className={`nav-link ${styles.navLinkItem}`}>
              Inicio
            </NavLink>

            {isAuthenticated ? (
              <>
                <NavLink to="/create-post" className={`nav-link ${styles.navLinkItem}`}>
                  Publicar
                </NavLink>
                <NavLink to="/profile" className={`nav-link ${styles.navLinkItem}`}>
                  Perfil
                </NavLink>
                <button
                  onClick={handleLogout}
                  className={`btn btn-outline-light btn-sm ms-lg-2 px-3 ${styles.logoutBtn}`}
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={`nav-link ${styles.navLinkItem}`}>
                  Iniciar sesión
                </NavLink>
                <NavLink to="/register" className={`btn btn-sm px-3 ms-lg-2 ${styles.primaryBtn}`}>
                  Registrarse
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
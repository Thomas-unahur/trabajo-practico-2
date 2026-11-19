import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';

export function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    closeMenu();
    logout();
    navigate('/login');
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-dark ${styles.navbarUnahur} py-3 shadow-sm`}>
      <div className="container-fluid px-4">
        {/* Logo */}
        <Link to="/" className={`navbar-brand ${styles.brandContainer}`} onClick={closeMenu}>
          <span className={styles.brandBadge}>H</span>
          <span className={styles.brandText}>UnaHur Anti-Social Net</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-controls="basic-navbar-nav"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id="basic-navbar-nav">
          <div className={styles.navContainer}>
            <NavLink to="/" className={`nav-link ${styles.navLinkItem}`} onClick={closeMenu}>
              Inicio
            </NavLink>

            {isAuthenticated ? (
              <>
                <NavLink to="/create-post" className={`nav-link ${styles.navLinkItem}`} onClick={closeMenu}>
                  Publicar
                </NavLink>
                <NavLink to="/profile" className={`nav-link ${styles.navLinkItem}`} onClick={closeMenu}>
                  Perfil
                </NavLink>
                <button
                  onClick={handleLogout}
                  className={`btn btn-sm ${styles.logoutBtn}`}
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={`nav-link ${styles.navLinkItem}`} onClick={closeMenu}>
                  Iniciar sesión
                </NavLink>
                <NavLink to="/register" className={`btn btn-sm ${styles.primaryBtn}`} onClick={closeMenu}>
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
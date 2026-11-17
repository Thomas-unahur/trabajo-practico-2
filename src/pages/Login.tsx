import { useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUsers } from "../services/userService";

// La API no maneja contraseñas: para el TP todos los usuarios usan la misma
const PASSWORD_FIJA = "123456";

function Login() {
  // Formulario controlado: cada input tiene su estado
  const [nickName, setNickName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  // enviado: se pone en true al primer intento, para recién ahí marcar los campos vacíos en rojo
  const [enviado, setEnviado] = useState<boolean>(false);
  const [cargando, setCargando] = useState<boolean>(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Si ya hay una sesión iniciada no tiene sentido mostrar el login
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function manejarEnvio(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); // evita que el formulario recargue la página
    setEnviado(true);
    setError("");

    // 1) Campos obligatorios
    if (nickName.trim() === "" || password === "") {
      setError("Completá el nickName y la contraseña.");
      return;
    }

    setCargando(true);
    try {
      // 2) Buscamos el nickName entre los usuarios que devuelve la API
      const usuarios = await getUsers();
      const usuarioEncontrado = usuarios.find((usuario) => usuario.nickName === nickName.trim());

      if (!usuarioEncontrado) {
        setError("No existe ningún usuario con ese nickName.");
        return;
      }

      // 3) La contraseña se valida acá en el front
      if (password !== PASSWORD_FIJA) {
        setError("La contraseña es incorrecta.");
        return;
      }

      // 4) Todo bien: guardamos el usuario en el contexto y vamos al inicio
      login(usuarioEncontrado);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("No se pudo conectar con el servidor. Revisá que la API esté funcionando.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Iniciar sesión</h1>
        <p className="auth-subtitle">Entrá con tu nickName para ver las publicaciones.</p>

        {error && (
          <div className="alert alert-danger auth-alert" role="alert">
            {error}
          </div>
        )}

        {/* noValidate: las validaciones las hacemos nosotros en manejarEnvio */}
        <form onSubmit={manejarEnvio} noValidate>
          <div className="mb-3">
            <label htmlFor="nickName" className="form-label">
              NickName
            </label>
            <input
              type="text"
              id="nickName"
              className={enviado && nickName.trim() === "" ? "form-control is-invalid" : "form-control"}
              placeholder="Ej: luna"
              value={nickName}
              onChange={(e) => setNickName(e.target.value)}
            />
            <div className="invalid-feedback">El nickName es obligatorio.</div>
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className={enviado && password === "" ? "form-control is-invalid" : "form-control"}
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="invalid-feedback">La contraseña es obligatoria.</div>
          </div>

          <button type="submit" className="btn btn-primary btn-auth" disabled={cargando}>
            {cargando ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="auth-hint">
          Contraseña de prueba: <strong>123456</strong>
        </p>
        <p className="auth-link">
          ¿No tenés cuenta? <Link to="/register">Registrate</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

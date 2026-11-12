import { useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createUser } from "../services/userService";

function Register() {
  // Formulario controlado: cada input tiene su estado
  const [nickName, setNickName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  // enviado: se pone en true al primer intento, para recién ahí marcar los campos con error
  const [enviado, setEnviado] = useState<boolean>(false);
  const [cargando, setCargando] = useState<boolean>(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Si ya hay una sesión iniciada no tiene sentido registrarse
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // El email tiene que tener al menos un @ (validación simple)
  const emailInvalido = email.trim() === "" || !email.includes("@");

  async function manejarEnvio(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); // evita que el formulario recargue la página
    setEnviado(true);
    setError("");

    // 1) Los dos campos son obligatorios
    if (nickName.trim() === "" || email.trim() === "") {
      setError("Completá el nickName y el email.");
      return;
    }

    if (emailInvalido) {
      setError("El email no es válido.");
      return;
    }

    setCargando(true);
    try {
      // 2) POST /users con { nickName, email }
      const nuevoUsuario = await createUser({
        nickName: nickName.trim(),
        email: email.trim(),
      });

      // 3) Si se creó bien, lo dejamos logueado y vamos al inicio
      login(nuevoUsuario);
      navigate("/");
    } catch (err) {
      console.error(err);
      if (err instanceof TypeError) {
        // fetch tira TypeError cuando ni siquiera puede llegar al servidor
        setError("No se pudo conectar con el servidor. Revisá que la API esté funcionando.");
      } else if (err instanceof Error) {
        // Acá llega el mensaje del backend. Si el nickName ya existe responde "No se pudo crear el usuario"
        setError(err.message + ". Probá con otro nickName, puede que ya esté en uso.");
      }
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Crear cuenta</h1>
        <p className="auth-subtitle">Registrate para empezar a publicar.</p>

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
              placeholder="Ej: estrella"
              value={nickName}
              onChange={(e) => setNickName(e.target.value)}
            />
            <div className="invalid-feedback">El nickName es obligatorio.</div>
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className={enviado && emailInvalido ? "form-control is-invalid" : "form-control"}
              placeholder="Ej: estrella@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="invalid-feedback">Ingresá un email válido.</div>
          </div>

          <button type="submit" className="btn btn-primary btn-auth" disabled={cargando}>
            {cargando ? "Creando cuenta..." : "Registrarme"}
          </button>
        </form>

        <p className="auth-link">
          ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;

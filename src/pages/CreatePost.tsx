import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { Tag, User } from "../types";
import { createPost, createPostImage } from "../services/postService";
import { getTags } from "../services/tagService";

export default function CreatePost() {
  const navigate = useNavigate();

  // obtencion del usuario en sesion
  const [user] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? (JSON.parse(stored) as User) : null;
    } catch {
      return null;
    }
  });

  // estados controlados del formulario
  const [description, setDescription] = useState<string>("");
  const [imageUrls, setImageUrls] = useState<string[]>([""]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  // estados para la carga de etiquetas desde la API
  const [tags, setTags] = useState<Tag[]>([]);
  const [loadingTags, setLoadingTags] = useState<boolean>(true);
  const [tagsError, setTagsError] = useState<string | null>(null);

  // estados de envio y feedback visual
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [descriptionTouched, setDescriptionTouched] = useState<boolean>(false);

  // cargar al montar la vista (useEffect) el listado de etiquetas disponibles
  useEffect(() => {
    let estaMontado = true;

    async function fetchTags() {
      setLoadingTags(true);
      setTagsError(null);
      try {
        const fetchedTags = await getTags();
        if (estaMontado) {
          setTags(fetchedTags);
        }
      } catch (err: any) {
        if (estaMontado) {
          setTagsError(
            err.message || "No se pudieron cargar las etiquetas disponibles."
          );
        }
      } finally {
        if (estaMontado) {
          setLoadingTags(false);
        }
      }
    }

    fetchTags();

    return () => {
      estaMontado = false;
    };
  }, []);

  // manejadores para la lista dinámica de URLs de imágenes
  const handleImageUrlChange = (index: number, value: string) => {
    setImageUrls((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleAddImageUrl = () => {
    setImageUrls((prev) => [...prev, ""]);
  };

  const handleRemoveImageUrl = (indexToRemove: number) => {
    setImageUrls((prev) => {
      const updated = prev.filter((_, idx) => idx !== indexToRemove);
      // mantiene siempre al menos un campo disponible
      return updated.length === 0 ? [""] : updated;
    });
  };

  // manejador para la selección múltiple de IDs de etiquetas
  const handleToggleTag = (tagId: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  // manejador de envío del formulario
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setDescriptionTouched(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    // validacion: la descripcion no puede estar vacía
    const trimmedDescription = description.trim();
    if (!trimmedDescription) {
      setErrorMessage("La descripción de la publicación es obligatoria.");
      return;
    }

    // Validacion de usuario autenticado
    if (!user || !user.id) {
      setErrorMessage(
        "Debes tener una sesión iniciada para poder crear una publicación."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // ejecutar createPost con description, userId y tags/tagIds
      const createdPost = await createPost({
        description: trimmedDescription,
        userId: user.id,
        tagIds: selectedTagIds,
      });

      // por cada URL de imagen NO vacía ingresada, ejecutar createPostImage
      const validImageUrls = imageUrls
        .map((url) => url.trim())
        .filter((url) => url.length > 0);

      if (validImageUrls.length > 0) {
        await Promise.all(
          validImageUrls.map((url) =>
            createPostImage({
              url,
              postId: createdPost.id,
            })
          )
        );
      }

      // mostrar confirmación y redirigir a /profile
      setSuccessMessage(
        "¡Publicación creada con éxito! Redirigiendo a tu perfil..."
      );

      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (err: any) {
      setErrorMessage(
        err.message || "Ocurrió un error inesperado al crear la publicación."
      );
      setIsSubmitting(false);
    }
  };

  const isDescriptionInvalid = descriptionTouched && !description.trim();

  // filtrar URLs validas para previsualizacion en vivo
  const previewUrls = imageUrls.map((u) => u.trim()).filter((u) => u.length > 0);

  return (
    <div className="create-post-container py-4">
      <div className="create-post-card">
        {/* cabecera de la tarjeta */}
        <div className="create-post-header">
          <div className="create-post-icon-wrapper">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
              <path
                fillRule="evenodd"
                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
              />
            </svg>
          </div>
          <div>
            <h2 className="create-post-title">Crear Nueva Publicación</h2>
            <p className="create-post-subtitle">
              Comparte pensamientos, imágenes y etiquetas con la comunidad UnaHur
            </p>
          </div>
        </div>

        {/* identificador de autor en sesion */}
        {user && (
          <div className="create-post-author-bar">
            <span className="create-post-author-label">Publicando como:</span>
            <span className="badge bg-primary text-white create-post-author-badge">
              @{user.nickName}
            </span>
          </div>
        )}

        {/* alerta de confirmacion exitosa */}
        {successMessage && (
          <div
            className="alert alert-success d-flex align-items-center mb-4"
            role="alert"
          >
            <svg
              className="bi flex-shrink-0 me-2"
              width="20"
              height="20"
              role="img"
              aria-label="Success:"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
            </svg>
            <div>{successMessage}</div>
          </div>
        )}

        {/* alerta de error */}
        {errorMessage && (
          <div
            className="alert alert-danger d-flex align-items-center mb-4"
            role="alert"
          >
            <svg
              className="bi flex-shrink-0 me-2"
              width="20"
              height="20"
              role="img"
              aria-label="Danger:"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
            </svg>
            <div>{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* campo: descripcion obligatoria */}
          <div className="mb-4">
            <label htmlFor="post-description" className="form-label fw-bold">
              Descripción <span className="text-danger">*</span>
            </label>
            <textarea
              id="post-description"
              className={`form-control create-post-textarea ${isDescriptionInvalid ? "is-invalid" : ""
                }`}
              rows={4}
              placeholder="¿Qué estás pensando hoy? Escribí tu publicación acá..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => setDescriptionTouched(true)}
              disabled={isSubmitting}
            />
            {isDescriptionInvalid && (
              <div className="invalid-feedback">
                Por favor, escribí una descripción para tu publicación.
              </div>
            )}
            <div className="form-text text-end">
              {description.length} caracteres
            </div>
          </div>

          {/* campo: URLs de imagenes dinamicas */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="form-label fw-bold mb-0">
                Imágenes asociadas <span className="text-muted fw-normal">(opcional)</span>
              </label>
              <span className="badge bg-light text-secondary border">
                {imageUrls.filter((u) => u.trim().length > 0).length} ingresada(s)
              </span>
            </div>
            <p className="form-text mt-0 mb-3 text-muted">
              Agrega una o más URLs de imágenes para ilustrar tu publicación.
            </p>

            <div className="image-urls-list">
              {imageUrls.map((url, index) => (
                <div key={index} className="image-url-row mb-2">
                  <div className="input-group">
                    <span className="input-group-text bg-white text-muted">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                        <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z" />
                      </svg>
                    </span>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://ejemplo.com/imagen.jpg"
                      value={url}
                      onChange={(e) =>
                        handleImageUrlChange(index, e.target.value)
                      }
                      disabled={isSubmitting}
                      aria-label={`URL de imagen ${index + 1}`}
                    />
                    {imageUrls.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-remove-image"
                        onClick={() => handleRemoveImageUrl(index)}
                        disabled={isSubmitting}
                        title="Quitar este campo"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="btn btn-outline-primary btn-sm btn-add-image mt-2"
              onClick={handleAddImageUrl}
              disabled={isSubmitting}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="me-1"
                viewBox="0 0 16 16"
              >
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
              </svg>
              Agregar otra imagen
            </button>

            {/* vista previa de imágenes ingresadas */}
            {previewUrls.length > 0 && (
              <div className="image-previews-container mt-3">
                <span className="image-previews-label">Vista previa:</span>
                <div className="image-previews-grid">
                  {previewUrls.map((url, i) => (
                    <div key={i} className="image-preview-item">
                      <img
                        src={url}
                        alt={`Previsualización ${i + 1}`}
                        className="image-preview-thumbnail"
                        onError={(e) => {
                          // si la imagen falla al cargar, se aplica/muestra un placeholder amigable
                          (e.target as HTMLImageElement).src =
                            "https://placehold.co/120x90/e9ecef/6c757d?text=Error+URL";
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* campo: Selector interactivo de etiquetas */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="form-label fw-bold mb-0">
                Etiquetas <span className="text-muted fw-normal">(opcional)</span>
              </label>
              <span className="badge bg-light text-primary border">
                {selectedTagIds.length} seleccionada(s)
              </span>
            </div>
            <p className="form-text mt-0 mb-3 text-muted">
              Selecciona una o más etiquetas para clasificar tu posteo.
            </p>

            {loadingTags && (
              <div className="d-flex align-items-center py-2 text-muted">
                <div
                  className="spinner-border spinner-border-sm me-2 text-primary"
                  role="status"
                >
                  <span className="visually-hidden">Cargando etiquetas...</span>
                </div>
                <span>Cargando etiquetas disponibles...</span>
              </div>
            )}

            {tagsError && (
              <div className="alert alert-warning py-2 mb-2" role="alert">
                <small>{tagsError}</small>
              </div>
            )}

            {!loadingTags && tags.length > 0 && (
              <div className="tags-selector-wrapper">
                {tags.map((tag) => {
                  const isSelected = selectedTagIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      className={`tag-chip ${isSelected ? "selected" : ""}`}
                      onClick={() => handleToggleTag(tag.id)}
                      disabled={isSubmitting}
                      aria-pressed={isSelected}
                    >
                      {isSelected ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          fill="currentColor"
                          className="me-1"
                          viewBox="0 0 16 16"
                        >
                          <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                        </svg>
                      ) : (
                        <span className="tag-hash me-1">#</span>
                      )}
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            )}

            {!loadingTags && tags.length === 0 && !tagsError && (
              <p className="text-muted fst-italic">
                No hay etiquetas registradas en el sistema.
              </p>
            )}
          </div>

          {/* botones de accion */}
          <div className="create-post-actions pt-3 border-top d-flex justify-content-between align-items-center">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="btn btn-primary btn-publish px-4 py-2 fw-bold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Publicando...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="me-2"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                  </svg>
                  Publicar ahora
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

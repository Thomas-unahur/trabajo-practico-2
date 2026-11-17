import type { Tag } from "../types";
import { API_BASE_URL } from "./postService";

/**
 * GET /tags
 * obtiene el listado completo de etiquetas disponibles en el sistema.
 */
export async function getTags(): Promise<Tag[]> {
  const respuesta = await fetch(`${API_BASE_URL}/tags`);

  if (!respuesta.ok) {
    throw new Error(
      `No se pudieron obtener las etiquetas. Código: ${respuesta.status}`
    );
  }

  const tags: Tag[] = await respuesta.json();
  return tags;
}

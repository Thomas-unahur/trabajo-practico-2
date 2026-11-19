import type { Post, PostImage } from "../types";

// URL base de la API del BackEnd (por defecto se usa el provisto por la catedra en puerto 3001).
// si en el proyecto se centraliza en apiClient, se comparte la misma direccion.
export const API_BASE_URL = "http://localhost:3001";

/**
 * datos requeridos para dar de alta una nueva publicacion.
 */
export interface CreatePostData {
  description: string;
  userId: number | string;
  tagIds?: number[];
  tags?: number[];
}

/**
 * datos requeridos para asociar una imagen a una publicacion.
 */
export interface CreatePostImageData {
  url: string;
  postId: number | string;
}

/**
 * GET /posts
 * obtener la lista completa de publicaciones recientes.
 */
export async function getPosts(): Promise<Post[]> {
  const respuesta = await fetch(`${API_BASE_URL}/posts`);

  if (!respuesta.ok) {
    throw new Error(
      `No se pudieron obtener las publicaciones. Código: ${respuesta.status}`
    );
  }

  const posts: Post[] = await respuesta.json();
  return posts;
}

/**
 * GET /posts/:id
 * Obtiene el detalle de una publicación específica por su ID.
 */
export async function getPostById(id: number): Promise<Post> {
  const respuesta = await fetch(`${API_BASE_URL}/posts/${id}`);

  if (!respuesta.ok) {
    throw new Error(
      `No se pudo encontrar la publicación con ID ${id}. Código: ${respuesta.status}`
    );
  }

  const post: Post = await respuesta.json();
  return post;
}

/**
 * GET /posts?userId=xxx
 * obtiene las publicaciones creadas por un usuario especifico.
 * se asegura el filtrado por post.userId === userId por si el backend retorna todas.
 */
export async function getPostsByUser(userId: number): Promise<Post[]> {
  const respuesta = await fetch(`${API_BASE_URL}/posts?userId=${userId}`);

  if (!respuesta.ok) {
    throw new Error(
      `No se pudieron obtener las publicaciones del usuario ${userId}. Código: ${respuesta.status}`
    );
  }

  const posts: Post[] = await respuesta.json();

  // asegura el filtrado en memoria en caso de que el backend no filtre por query param
  if (Array.isArray(posts) && posts.some((p) => p.userId !== undefined && p.userId !== userId)) {
    return posts.filter((p) => p.userId === userId);
  }

  return posts;
}

/**
 * POST /posts
 * crea una nueva publicacion enviando description, userId y las etiquetas seleccionadas.
 */
export async function createPost(data: CreatePostData): Promise<Post> {
  // se envian tagIds y tags para garantizar compatibilidad con la especificación del backend
  const payload = {
    description: data.description,
    userId: data.userId,
    tagIds: data.tagIds ?? data.tags ?? [],
    tags: data.tagIds ?? data.tags ?? [],
  };

  const respuesta = await fetch(`${API_BASE_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const resultado = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      resultado.error ||
      resultado.message ||
      `Error al crear la publicación. Código: ${respuesta.status}`
    );
  }

  return resultado as Post;
}

/**
 * GET /postimages/post/:postId
 * obtiene la lista de imagenes asociadas a una publicacion especifica.
 */
export async function getImagesByPost(postId: number): Promise<PostImage[]> {
  const respuesta = await fetch(`${API_BASE_URL}/postimages/post/${postId}`);

  if (!respuesta.ok) {
    throw new Error(
      `No se pudieron obtener las imágenes de la publicación ${postId}. Código: ${respuesta.status}`
    );
  }

  const images: PostImage[] = await respuesta.json();
  return images;
}

/**
 * POST /postimages
 * asocia una URL de imagen a una publicacion ya creada.
 */
export async function createPostImage(data: CreatePostImageData): Promise<PostImage> {
  const respuesta = await fetch(`${API_BASE_URL}/postimages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: data.url,
      postId: data.postId,
    }),
  });

  const resultado = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      resultado.error ||
      resultado.message ||
      `Error al asociar la imagen a la publicación. Código: ${respuesta.status}`
    );
  }

  return resultado as PostImage;
}

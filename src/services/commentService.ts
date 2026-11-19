import { API_BASE_URL, handleApiResponse } from "./apiClient";
import type { Comment, CreateCommentData } from "../types";

/**
 * GET /comments/post/:postId
 * Obtiene todos los comentarios de una publicación específica, ordenados por fecha de creación (más recientes primero).
 */
export async function getCommentsByPost(postId: number): Promise<Comment[]> {
    const response = await fetch(`${API_BASE_URL}/comments/post/${postId}`);
    return handleApiResponse<Comment[]>(
        response,
        `No se pudieron obtener los comentarios de la publicación ${postId}.`
    );
}
/**
 * POST /comments
 * Crea un nuevo comentario asociado a un usuario y una publicación.
 */
export async function createComment(data: CreateCommentData): Promise<Comment> {
    const response = await fetch(`${API_BASE_URL}/comments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            content: data.content,
            userId: data.userId,
            postId: data.postId,
        }),
    });
    return handleApiResponse<Comment>(
        response,
        "No se pudo publicar el comentario."
    );
}
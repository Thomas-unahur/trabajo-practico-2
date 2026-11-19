// Dirección de la API del BackEnd (la que provee la cátedra).
// Si la API corre en otro puerto, se cambia solamente acá.
export const API_BASE_URL = "http://localhost:3001";


export async function handleApiResponse<T>(
    response: Response,
    fallbackErrorMessage = "Error en la solicitud al servidor."
): Promise<T> {
    const contentType = response.headers.get("content-type") ?? "";
    const isJson = contentType.includes("application/json");
    const payload = isJson ? await response.json().catch(() => null) : null;

    if (!response.ok) {
        const backendMessage =
            payload && typeof payload === "object"
                ? (payload as { error?: string; message?: string }).error ||
                (payload as { error?: string; message?: string }).message
                : null;

        throw new Error(
            backendMessage || `${fallbackErrorMessage} Código: ${response.status}`
        );
    }

    return payload as T;
}
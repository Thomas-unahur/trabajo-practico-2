# UnaHur Anti-Social Net – FrontEnd

Aplicación web FrontEnd desarrollada en **React + TypeScript** para la red social **UnaHur Anti-Social Net** (Construcción de Interfaces de Usuario - UNAHUR).

## Descripción del proyecto

Permite navegar el feed de publicaciones recientes, visualizar el detalle de cada posteo junto con sus imágenes, etiquetas y comentarios visibles, registrarse, iniciar sesión (con persistencia en `localStorage` y estado global mediante `useContext`), consultar el perfil de usuario con sus publicaciones y crear nuevas publicaciones con múltiples URLs de imágenes y etiquetas.

## Instrucciones para correr en local

1. Clonar y levantar primero la API provista por la cátedra (`https://github.com/lucasfigarola/backend-api`).

2. Instalar las dependencias del proyecto FrontEnd:
   ```bash
   npm install
   ```

3. Iniciar el servidor de desarrollo (configurado en el puerto `5173` para coincidir con la política CORS del BackEnd):
   ```bash
   npm run dev
   ```

4. Abrir en el navegador:
   ```text
   http://localhost:5173
   ```

## URL de la API utilizada

- **URL base por defecto:** `http://localhost:3001` (configurable en `src/services/apiClient.ts` según el puerto configurado en la API local).
- **Repositorio de la API utilizada:** `https://github.com/lucasfigarola/backend-api`

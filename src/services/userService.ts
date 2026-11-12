import { API_BASE_URL } from "./apiClient";
import type { User } from "../types";

// Datos que pide la API para crear un usuario nuevo
interface NuevoUsuario {
  nickName: string;
  email: string;
}

// GET /users: trae la lista completa de usuarios
export async function getUsers(): Promise<User[]> {
  const respuesta = await fetch(API_BASE_URL + "/users");

  if (!respuesta.ok) {
    throw new Error("No se pudieron traer los usuarios. Error: " + respuesta.status);
  }

  const data: User[] = await respuesta.json();
  return data;
}

// GET /users/:id: trae un solo usuario por su id
export async function getUserById(id: number): Promise<User> {
  const respuesta = await fetch(`${API_BASE_URL}/users/${id}`);

  if (!respuesta.ok) {
    throw new Error("No se encontró el usuario. Error: " + respuesta.status);
  }

  const data: User = await respuesta.json();
  return data;
}

// POST /users: crea un usuario nuevo con nickName y email
export async function createUser(data: NuevoUsuario): Promise<User> {
  const respuesta = await fetch(API_BASE_URL + "/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const resultado = await respuesta.json();

  // Si el backend rechaza el alta (por ejemplo, porque el nickName ya existe)
  // manda el motivo en "error": "No se pudo crear el usuario"
  if (!respuesta.ok) {
    throw new Error(resultado.error || "No se pudo crear el usuario");
  }

  return resultado;
}

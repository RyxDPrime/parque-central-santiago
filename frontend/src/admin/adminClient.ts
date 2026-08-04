const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";
const TOKEN_KEY = "pcs_admin_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function isLoggedIn(): boolean {
  return Boolean(getToken());
}

async function parseErrorMessage(res: Response): Promise<string> {
  const payload = await res.json().catch(() => null);
  return payload?.error ?? `Error (${res.status})`;
}

export async function login(username: string, password: string): Promise<void> {
  const res = await fetch(`${API_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    throw new Error(await parseErrorMessage(res));
  }
  const data = (await res.json()) as { token: string };
  setToken(data.token);
}

export async function listEntity<T>(entityPath: string): Promise<T[]> {
  const res = await fetch(`${API_URL}/${entityPath}`);
  if (!res.ok) throw new Error(await parseErrorMessage(res));
  return res.json() as Promise<T[]>;
}

export async function createEntity<T>(entityPath: string, data: unknown): Promise<T> {
  const res = await fetch(`${API_URL}/${entityPath}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
  return res.json() as Promise<T>;
}

export async function updateEntity<T>(entityPath: string, id: number, data: unknown): Promise<T> {
  const res = await fetch(`${API_URL}/${entityPath}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
  return res.json() as Promise<T>;
}

export async function deleteEntity(entityPath: string, id: number): Promise<void> {
  const res = await fetch(`${API_URL}/${entityPath}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
}

export interface ContactMessage {
  id: number;
  nombre: string;
  email: string;
  telefono: string | null;
  asunto: string | null;
  mensaje: string;
  emailEnviado: boolean;
  createdAt: string;
}

export async function listMessages(): Promise<ContactMessage[]> {
  const res = await fetch(`${API_URL}/mensajes`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
  return res.json() as Promise<ContactMessage[]>;
}

export async function deleteMessage(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/mensajes/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
}

export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_URL}/uploads`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
  const data = (await res.json()) as { url: string };
  // El backend devuelve una ruta relativa a su propio dominio (distinto al
  // del frontend en producción), así que se guarda la URL absoluta.
  const backendOrigin = new URL(API_URL).origin;
  return `${backendOrigin}${data.url}`;
}

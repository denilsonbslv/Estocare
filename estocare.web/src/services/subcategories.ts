const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Representa os dados de uma subcategoria.
 */
export interface Subcategory {
  id: number;
  name: string;
  categoryId: number;
  categoryName?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO para criar uma nova subcategoria.
 */
export interface CreateSubcategoryDto {
  name: string;
  categoryId: number;
}

/**
 * DTO para atualizar uma subcategoria existente.
 */
export interface UpdateSubcategoryDto {
  id: number;
  name: string;
}

/**
 * Obtém todas as subcategorias.
 *
 * @returns Uma lista de subcategorias.
 * @throws Error em caso de falha na requisição.
 */
export async function getAllSubcategories(): Promise<Subcategory[]> {
  const res = await fetch(`${BASE_URL}/api/subcategory`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Erro ao obter subcategorias.");
  }

  return await res.json();
}

/**
 * Obtém uma subcategoria pelo ID.
 *
 * @param id - ID da subcategoria.
 * @returns Os dados da subcategoria correspondente.
 * @throws Error se a subcategoria não for encontrada.
 */
export async function getSubcategoryById(id: number): Promise<Subcategory> {
  const res = await fetch(`${BASE_URL}/api/subcategory/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Subcategoria não encontrada.");
    }
    throw new Error("Erro ao buscar subcategoria.");
  }

  return await res.json();
}

/**
 * Cria uma nova subcategoria.
 *
 * @param data - Dados da nova subcategoria.
 * @returns A subcategoria criada.
 * @throws Error em caso de falha na criação.
 */
export async function createSubcategory(data: CreateSubcategoryDto): Promise<Subcategory> {
  const res = await fetch(`${BASE_URL}/api/subcategory`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Categoria associada não encontrada.");
    }
    if (res.status === 409) {
      throw new Error("Subcategoria já existe.");
    }
    throw new Error("Erro ao criar subcategoria.");
  }

  return await res.json();
}

/**
 * Atualiza os dados de uma subcategoria existente.
 *
 * @param id - ID da subcategoria a ser atualizada.
 * @param data - Dados atualizados da subcategoria.
 * @returns A subcategoria atualizada.
 * @throws Error em caso de falha na atualização.
 */
export async function updateSubcategory(
  id: number,
  data: UpdateSubcategoryDto
): Promise<Subcategory> {
  const res = await fetch(`${BASE_URL}/api/subcategory/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Subcategoria não encontrada.");
    }
    throw new Error("Erro ao atualizar subcategoria.");
  }

  return await res.json();
}

/**
 * Exclui logicamente uma subcategoria.
 *
 * @param id - ID da subcategoria a ser excluída.
 * @throws Error em caso de falha na exclusão.
 */
export async function deleteSubcategory(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/subcategory/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Subcategoria não encontrada.");
    }
    throw new Error("Erro ao excluir subcategoria.");
  }
}

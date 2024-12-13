/**
 * Este módulo provê funções para interagir com a API de categorias do sistema Estocare.
 * Aqui, concentramos as operações de CRUD (Create, Read, Update, Delete) em um único local,
 * mantendo a lógica de acesso à API separada da camada de apresentação (componentes e páginas).
 *
 * Benefícios desta abordagem:
 * - Facilita manutenções futuras e mudanças na estrutura da API.
 * - Centraliza tratamento de erros, parse de dados e autenticação.
 * - Facilita testes unitários (mockar fetch aqui é mais simples do que em componentes).
 *
 * Uso:
 *  - Importar as funções em componentes/páginas do Next.js e chamá-las conforme necessário.
 *  - Exemplo: `const categories = await getAllCategories();`
 *
 * Futuras melhorias:
 *  - Implementar autenticação (incluir token no header).
 *  - Adicionar caching (Client-Side) ou utilizar Server Components para SSR/SSG.
 *  - Refinar o tratamento de erros e responses, possivelmente criando uma camada de abstração.
 */

export interface Category {
    /** ID único da categoria */
    id: number;
    /** Nome da categoria */
    name: string;
    /** Data/hora de criação da categoria */
    createdAt: string;
    /** Data/hora da última atualização da categoria */
    updatedAt: string;
  }
  
  export interface CreateCategoryDto {
    /** Nome da nova categoria a ser criada */
    name: string;
  }
  
  export interface UpdateCategoryDto {
    /** Novo nome da categoria a ser atualizada */
    name: string;
  }
  
  /**
   * A URL base da API é definida via variável de ambiente para facilitar a troca entre
   * diferentes ambientes (desenvolvimento, produção, etc.) sem alterar o código.
   * Certifique-se de definir NEXT_PUBLIC_API_URL em seu arquivo .env.
   */
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  
  /**
   * Busca todas as categorias disponíveis (não deletadas) da API.
   *
   * @returns Lista de categorias do tipo `Category`.
   * @throws Error caso a requisição falhe ou não retorne status 200.
   */
  export async function getAllCategories(): Promise<Category[]> {
    const res = await fetch(`${BASE_URL}/api/category`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    if (!res.ok) {
      // Caso a resposta não seja bem-sucedida, lançamos um erro genérico.
      // Podemos aprimorar posteriormente tratando diferentes códigos HTTP.
      throw new Error("Erro ao buscar categorias");
    }
  
    return await res.json();
  }
  
  /**
   * Busca uma categoria específica pelo ID.
   *
   * @param id - ID da categoria a ser buscada.
   * @returns A categoria encontrada.
   * @throws Error caso a categoria não seja encontrada (status 404) ou haja erro no servidor.
   */
  export async function getCategoryById(id: number): Promise<Category> {
    const res = await fetch(`${BASE_URL}/api/category/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error("Categoria não encontrada");
      }
      throw new Error("Erro ao buscar a categoria");
    }
  
    return await res.json();
  }
  
  /**
   * Cria uma nova categoria no sistema.
   *
   * @param data - Objeto contendo o nome da nova categoria.
   * @returns A categoria criada, incluindo ID, datas de criação e atualização.
   * @throws Error caso a categoria já exista (409) ou ocorra erro interno no servidor.
   */
  export async function createCategory(data: CreateCategoryDto): Promise<Category> {
    const res = await fetch(`${BASE_URL}/api/category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  
    if (!res.ok) {
      if (res.status === 409) {
        // Categoria já existente
        throw new Error("Categoria já existe");
      }
      throw new Error("Erro ao criar categoria");
    }
  
    return await res.json();
  }
  
  /**
   * Atualiza os dados de uma categoria já existente.
   *
   * @param id - ID da categoria a ser atualizada.
   * @param data - Objeto contendo o novo nome da categoria.
   * @returns A categoria atualizada.
   * @throws Error caso a categoria não seja encontrada (404) ou ocorra erro interno no servidor.
   */
  export async function updateCategory(id: number, data: UpdateCategoryDto): Promise<Category> {
    const res = await fetch(`${BASE_URL}/api/category/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error("Categoria não encontrada para atualização");
      }
      throw new Error("Erro ao atualizar categoria");
    }
  
    return await res.json();
  }
  
  /**
   * Exclui logicamente uma categoria, marcando-a como deletada em vez de removê-la fisicamente.
   *
   * @param id - ID da categoria a ser excluída.
   * @returns void (em caso de sucesso).
   * @throws Error caso a categoria não seja encontrada (404) ou ocorra erro interno no servidor.
   */
  export async function deleteCategory(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/category/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error("Categoria não encontrada para exclusão");
      }
      throw new Error("Erro ao excluir categoria");
    }
  }
  
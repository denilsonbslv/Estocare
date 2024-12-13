using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using System.Collections.Generic;
using Estocare.Web.Models.DTOs;

namespace Estocare.Web.Services
{
    /// <summary>
    /// Serviço para gerenciar operações relacionadas a categorias.
    /// </summary>
    public class CategoryService
    {
        private readonly HttpClient _httpClient;

        /// <summary>
        /// Construtor do CategoryService.
        /// </summary>
        /// <param name="httpClient">Instância do HttpClient configurada para acessar a API.</param>
        public CategoryService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        /// <summary>
        /// Obtém todas as categorias.
        /// </summary>
        /// <returns>Lista de categorias.</returns>
        public async Task<List<CategoryDto>> GetAllCategoriesAsync()
        {
            return await _httpClient.GetFromJsonAsync<List<CategoryDto>>("api/category");
        }

        /// <summary>
        /// Obtém uma categoria pelo ID.
        /// </summary>
        /// <param name="id">ID da categoria.</param>
        /// <returns>Dados da categoria.</returns>
        public async Task<CategoryDto> GetCategoryByIdAsync(int id)
        {
            return await _httpClient.GetFromJsonAsync<CategoryDto>($"api/category/{id}");
        }

        /// <summary>
        /// Cria uma nova categoria.
        /// </summary>
        /// <param name="createCategoryDto">Dados da nova categoria.</param>
        /// <returns>Dados da categoria criada.</returns>
        public async Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto createCategoryDto)
        {
            var response = await _httpClient.PostAsJsonAsync("api/category", createCategoryDto);
            response.EnsureSuccessStatusCode();

            return await response.Content.ReadFromJsonAsync<CategoryDto>();
        }

        /// <summary>
        /// Atualiza uma categoria existente.
        /// </summary>
        /// <param name="id">ID da categoria a ser atualizada.</param>
        /// <param name="updateCategoryDto">Dados da categoria a serem atualizados.</param>
        /// <returns>Dados da categoria atualizada.</returns>
        public async Task<CategoryDto> UpdateCategoryAsync(int id, UpdateCategoryDto updateCategoryDto)
        {
            var response = await _httpClient.PutAsJsonAsync($"api/category/{id}", updateCategoryDto);
            response.EnsureSuccessStatusCode();

            return await response.Content.ReadFromJsonAsync<CategoryDto>();
        }

        /// <summary>
        /// Exclui logicamente uma categoria.
        /// </summary>
        /// <param name="id">ID da categoria a ser excluída.</param>
        public async Task DeleteCategoryAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"api/category/{id}");
            response.EnsureSuccessStatusCode();
        }
    }
}

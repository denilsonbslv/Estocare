using Estocare.Api.DTOs;
using Estocare.Infrastructure.Data;
using Estocare.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.Annotations;

namespace Estocare.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<CategoryController> _logger;

        public CategoryController(AppDbContext context, ILogger<CategoryController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Obtém todas as categorias.
        /// </summary>
        /// <returns>Lista de categorias.</returns>
        [HttpGet]
        [SwaggerOperation(Summary = "Lista todas as categorias", Description = "Obtém uma lista de todas as categorias disponíveis.")]
        [SwaggerResponse(200, "Categorias obtidas com sucesso.")]
        [SwaggerResponse(500, "Erro interno no servidor.")]
        public async Task<IActionResult> GetAll()
        {
            _logger.LogInformation("Iniciando busca por todas as categorias.");
            try
            {
                var categories = await _context.Categories
                    .Where(c => !c.IsDeleted)
                    .Select(c => new CategoryDto
                    {
                        Id = c.Id,
                        Name = c.Name,
                        CreatedAt = c.CreatedAt,
                        UpdatedAt = c.UpdatedAt
                    })
                    .ToListAsync();

                _logger.LogInformation("Busca concluída com sucesso. Total de categorias: {Count}", categories.Count);
                return Ok(categories);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar categorias.");
                return StatusCode(500, new { Message = "Erro interno no servidor. Por favor, tente novamente mais tarde." });
            }
        }

        /// <summary>
        /// Obtém uma categoria pelo ID.
        /// </summary>
        /// <param name="id">ID da categoria.</param>
        /// <returns>Dados da categoria.</returns>
        [HttpGet("{id}")]
        [SwaggerOperation(Summary = "Busca uma categoria pelo ID", Description = "Obtém os dados de uma categoria específica.")]
        [SwaggerResponse(200, "Categoria obtida com sucesso.")]
        [SwaggerResponse(404, "Categoria não encontrada.")]
        [SwaggerResponse(500, "Erro interno no servidor.")]
        public async Task<IActionResult> GetById(int id)
        {
            _logger.LogInformation("Iniciando busca da categoria com ID: {CategoryId}", id);
            try
            {
                var category = await _context.Categories
                    .Where(c => c.Id == id && !c.IsDeleted)
                    .Select(c => new CategoryDto
                    {
                        Id = c.Id,
                        Name = c.Name,
                        CreatedAt = c.CreatedAt,
                        UpdatedAt = c.UpdatedAt
                    })
                    .FirstOrDefaultAsync();

                if (category == null)
                {
                    _logger.LogWarning("Categoria com ID {CategoryId} não encontrada.", id);
                    return NotFound(new { Message = "Categoria não encontrada." });
                }

                _logger.LogInformation("Categoria com ID {CategoryId} encontrada.", id);
                return Ok(category);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar categoria com ID: {CategoryId}", id);
                return StatusCode(500, new { Message = "Erro interno no servidor. Por favor, tente novamente mais tarde." });
            }
        }

        /// <summary>
        /// Cria uma nova categoria.
        /// </summary>
        /// <param name="dto">Dados da categoria a ser criada.</param>
        /// <returns>Categoria criada ou mensagem de erro.</returns>
        [HttpPost]
        [SwaggerOperation(Summary = "Cria uma nova categoria", Description = "Adiciona uma nova categoria ao sistema.")]
        [SwaggerResponse(201, "Categoria criada com sucesso.")]
        [SwaggerResponse(409, "Categoria já existe.")]
        [SwaggerResponse(500, "Erro interno no servidor.")]
        [HttpPost]
        public async Task<IActionResult> Create(CreateCategoryDto dto)
        {
            _logger.LogInformation("Iniciando criação de categoria.");
            try
            {
                // Normalizar o nome para minúsculas e verificar
                var existingCategory = await _context.Categories
                    .Where(c => c.Name.ToLower() == dto.Name.ToLower() && !c.IsDeleted)
                    .FirstOrDefaultAsync();

                if (existingCategory != null)
                {
                    _logger.LogWarning("Tentativa de criar categoria já existente: {CategoryName}", dto.Name);
                    return Conflict(new { Message = "Categoria já existe." });
                }

                var category = new Category
                {
                    Name = dto.Name,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Categories.Add(category);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Categoria criada com sucesso: {CategoryName}", category.Name);
                return CreatedAtAction(nameof(GetById), new { id = category.Id }, category);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao criar categoria.");
                return StatusCode(500, new { Message = "Erro interno no servidor. Por favor, tente novamente mais tarde." });
            }
        }


        /// <summary>
        /// Atualiza uma categoria existente.
        /// </summary>
        /// <param name="id">ID da categoria a ser atualizada.</param>
        /// <param name="dto">Dados atualizados da categoria.</param>
        /// <returns>Dados da categoria atualizada.</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateCategoryDto dto)
        {
            _logger.LogInformation("Iniciando atualização da categoria com ID: {CategoryId}", id);
            try
            {
                // Buscar a categoria no banco
                var category = await _context.Categories.FindAsync(id);
                if (category == null || category.IsDeleted)
                {
                    _logger.LogWarning("Categoria com ID {CategoryId} não encontrada ou está excluída.", id);
                    return NotFound(new { Message = "Categoria não encontrada." });
                }

                // Atualizar os dados
                category.Name = dto.Name;
                category.UpdatedAt = DateTime.UtcNow;

                // Salvar as alterações no banco
                await _context.SaveChangesAsync();

                _logger.LogInformation("Categoria com ID {CategoryId} atualizada com sucesso.", id);

                // Retornar o DTO atualizado
                var result = new CategoryDto
                {
                    Id = category.Id,
                    Name = category.Name,
                    CreatedAt = category.CreatedAt,
                    UpdatedAt = category.UpdatedAt
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao atualizar categoria com ID: {CategoryId}", id);
                return StatusCode(500, new { Message = "Erro interno no servidor. Por favor, tente novamente mais tarde." });
            }
        }


        /// <summary>
        /// Marca uma categoria como excluída.
        /// </summary>
        /// <param name="id">ID da categoria a ser excluída.</param>
        /// <returns>Resultado da operação.</returns>
        [HttpDelete("{id}")]
        [SwaggerOperation(Summary = "Exclui uma categoria logicamente", Description = "Marca uma categoria como excluída sem removê-la do banco.")]
        [SwaggerResponse(204, "Categoria excluída com sucesso.")]
        [SwaggerResponse(404, "Categoria não encontrada.")]
        [SwaggerResponse(500, "Erro interno no servidor.")]
        public async Task<IActionResult> Delete(int id)
        {
            _logger.LogInformation("Iniciando exclusão lógica da categoria com ID: {CategoryId}", id);
            try
            {
                var category = await _context.Categories.FindAsync(id);
                if (category == null)
                {
                    _logger.LogWarning("Categoria com ID {CategoryId} não encontrada.", id);
                    return NotFound(new { Message = "Categoria não encontrada." });
                }

                category.IsDeleted = true;
                category.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logger.LogInformation("Categoria com ID {CategoryId} marcada como excluída.", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao excluir logicamente a categoria com ID: {CategoryId}", id);
                return StatusCode(500, new { Message = "Erro interno no servidor. Por favor, tente novamente mais tarde." });
            }
        }
    }
}

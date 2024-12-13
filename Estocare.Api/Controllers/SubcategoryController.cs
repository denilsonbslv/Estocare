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
    public class SubcategoryController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<SubcategoryController> _logger;

        public SubcategoryController(AppDbContext context, ILogger<SubcategoryController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Lista todas as subcategorias.
        /// </summary>
        /// <returns>Lista de subcategorias.</returns>
        [HttpGet]
        [SwaggerOperation(Summary = "Lista todas as subcategorias", Description = "Obtém uma lista de todas as subcategorias disponíveis.")]
        [SwaggerResponse(200, "Subcategorias obtidas com sucesso.")]
        [SwaggerResponse(500, "Erro interno no servidor.")]
        public async Task<IActionResult> GetAll()
        {
            _logger.LogInformation("Iniciando busca por todas as subcategorias.");
            try
            {
                var subcategories = await _context.Subcategories.Include(sc => sc.Category).ToListAsync();
                _logger.LogInformation("Busca concluída com sucesso. Total de subcategorias: {Count}", subcategories.Count);
                return Ok(subcategories);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar subcategorias.");
                return StatusCode(500, new { Message = "Erro interno no servidor. Por favor, tente novamente mais tarde." });
            }
        }

        /// <summary>
        /// Busca uma subcategoria pelo ID.
        /// </summary>
        /// <param name="id">ID da subcategoria.</param>
        /// <returns>Dados da subcategoria.</returns>
        [HttpGet("{id}")]
        [SwaggerOperation(Summary = "Busca uma subcategoria pelo ID", Description = "Obtém os dados de uma subcategoria específica.")]
        [SwaggerResponse(200, "Subcategoria obtida com sucesso.")]
        [SwaggerResponse(404, "Subcategoria não encontrada.")]
        [SwaggerResponse(500, "Erro interno no servidor.")]
        public async Task<IActionResult> GetById(int id)
        {
            _logger.LogInformation("Iniciando busca da subcategoria com ID: {SubcategoryId}", id);
            try
            {
                var subcategory = await _context.Subcategories.Include(sc => sc.Category).FirstOrDefaultAsync(sc => sc.Id == id);
                if (subcategory == null)
                {
                    _logger.LogWarning("Subcategoria com ID {SubcategoryId} não encontrada.", id);
                    return NotFound(new { Message = "Subcategoria não encontrada." });
                }

                _logger.LogInformation("Subcategoria com ID {SubcategoryId} encontrada.", id);
                return Ok(subcategory);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar subcategoria com ID: {SubcategoryId}", id);
                return StatusCode(500, new { Message = "Erro interno no servidor. Por favor, tente novamente mais tarde." });
            }
        }

        /// <summary>
        /// Cria uma nova subcategoria.
        /// </summary>
        /// <param name="dto">Dados da subcategoria a ser criada.</param>
        /// <returns>Subcategoria criada ou mensagem de erro.</returns>
        [HttpPost]
        [SwaggerOperation(Summary = "Cria uma nova subcategoria", Description = "Adiciona uma nova subcategoria ao sistema.")]
        [SwaggerResponse(201, "Subcategoria criada com sucesso.")]
        [SwaggerResponse(404, "Categoria associada não encontrada.")]
        [SwaggerResponse(409, "Subcategoria já existe.")]
        [SwaggerResponse(500, "Erro interno no servidor.")]
        public async Task<IActionResult> Create(CreateSubcategoryDto dto)
        {
            _logger.LogInformation("Iniciando criação de subcategoria.");
            try
            {
                // Verificar se a categoria associada existe
                var category = await _context.Categories.FindAsync(dto.CategoryId);
                if (category == null)
                {
                    _logger.LogWarning("Tentativa de criar subcategoria para uma categoria inexistente: {CategoryId}", dto.CategoryId);
                    return NotFound(new { Message = "Categoria associada não encontrada." });
                }

                // Verificar se a subcategoria já existe
                var existingSubcategory = await _context.Subcategories
                    .FirstOrDefaultAsync(sc => sc.Name.ToLower() == dto.Name.ToLower() && sc.CategoryId == dto.CategoryId && !sc.IsDeleted);

                if (existingSubcategory != null)
                {
                    _logger.LogWarning("Tentativa de criar subcategoria já existente: {SubcategoryName}", dto.Name);
                    return Conflict(new { Message = "Subcategoria já existe nesta categoria." });
                }

                // Criar a nova subcategoria
                var subcategory = new Subcategory
                {
                    Name = dto.Name,
                    CategoryId = dto.CategoryId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Subcategories.Add(subcategory);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Subcategoria criada com sucesso: {SubcategoryName}", subcategory.Name);
                return CreatedAtAction(nameof(GetById), new { id = subcategory.Id }, subcategory);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao criar subcategoria.");
                return StatusCode(500, new { Message = "Erro interno no servidor. Por favor, tente novamente mais tarde." });
            }
        }

        /// <summary>
        /// Atualiza uma subcategoria existente.
        /// </summary>
        /// <param name="id">ID da subcategoria a ser atualizada.</param>
        /// <param name="subcategory">Dados atualizados da subcategoria.</param>
        /// <returns>Resultado da operação.</returns>
        [HttpPut("{id}")]
        [SwaggerOperation(Summary = "Atualiza uma subcategoria", Description = "Atualiza os dados de uma subcategoria existente.")]
        [SwaggerResponse(204, "Subcategoria atualizada com sucesso.")]
        [SwaggerResponse(404, "Subcategoria não encontrada.")]
        [SwaggerResponse(500, "Erro interno no servidor.")]
        public async Task<IActionResult> Update(int id, Subcategory subcategory)
        {
            _logger.LogInformation("Iniciando atualização da subcategoria com ID: {SubcategoryId}", id);
            try
            {
                if (id != subcategory.Id)
                {
                    _logger.LogWarning("ID da URL ({UrlId}) não corresponde ao ID do corpo ({BodyId}).", id, subcategory.Id);
                    return BadRequest(new { Message = "ID inconsistente." });
                }

                var existingSubcategory = await _context.Subcategories.FindAsync(id);
                if (existingSubcategory == null)
                {
                    _logger.LogWarning("Subcategoria com ID {SubcategoryId} não encontrada.", id);
                    return NotFound(new { Message = "Subcategoria não encontrada." });
                }

                existingSubcategory.Name = subcategory.Name;
                existingSubcategory.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logger.LogInformation("Subcategoria com ID {SubcategoryId} atualizada com sucesso.", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao atualizar subcategoria com ID: {SubcategoryId}", id);
                return StatusCode(500, new { Message = "Erro interno no servidor. Por favor, tente novamente mais tarde." });
            }
        }

        /// <summary>
        /// Marca uma subcategoria como excluída.
        /// </summary>
        /// <param name="id">ID da subcategoria a ser excluída.</param>
        /// <returns>Resultado da operação.</returns>
        [HttpDelete("{id}")]
        [SwaggerOperation(Summary = "Exclui uma subcategoria logicamente", Description = "Marca uma subcategoria como excluída sem removê-la do banco.")]
        [SwaggerResponse(204, "Subcategoria excluída com sucesso.")]
        [SwaggerResponse(404, "Subcategoria não encontrada.")]
        [SwaggerResponse(500, "Erro interno no servidor.")]
        public async Task<IActionResult> Delete(int id)
        {
            _logger.LogInformation("Iniciando exclusão lógica da subcategoria com ID: {SubcategoryId}", id);
            try
            {
                var subcategory = await _context.Subcategories.FindAsync(id);
                if (subcategory == null)
                {
                    _logger.LogWarning("Subcategoria com ID {SubcategoryId} não encontrada.", id);
                    return NotFound(new { Message = "Subcategoria não encontrada." });
                }

                subcategory.IsDeleted = true;
                subcategory.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logger.LogInformation("Subcategoria com ID {SubcategoryId} marcada como excluída.", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao excluir logicamente a subcategoria com ID: {SubcategoryId}", id);
                return StatusCode(500, new { Message = "Erro interno no servidor. Por favor, tente novamente mais tarde." });
            }
        }
    }
}

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
    public class ProductController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ProductController> _logger;

        public ProductController(AppDbContext context, ILogger<ProductController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Lista todos os produtos.
        /// </summary>
        /// <returns>Lista de produtos cadastrados.</returns>
        [HttpGet]
        [SwaggerOperation(Summary = "Lista todos os produtos", Description = "Retorna uma lista de todos os produtos cadastrados, incluindo suas categorias e subcategorias.")]
        [SwaggerResponse(200, "Lista de produtos obtida com sucesso.")]
        [SwaggerResponse(500, "Erro interno no servidor.")]
        public async Task<IActionResult> GetAll()
        {
            _logger.LogInformation("Iniciando busca por todos os produtos.");
            try
            {
                var products = await _context.Products
                    .Include(p => p.Category)
                    .Include(p => p.Subcategory)
                    .ToListAsync();

                _logger.LogInformation("Busca concluída com sucesso. Total de produtos: {Count}", products.Count);
                return Ok(products);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar produtos.");
                return StatusCode(500, new { Message = "Erro interno no servidor. Por favor, tente novamente mais tarde." });
            }
        }

        /// <summary>
        /// Busca um produto pelo ID.
        /// </summary>
        /// <param name="id">ID do produto.</param>
        /// <returns>Dados do produto especificado.</returns>
        [HttpGet("{id}")]
        [SwaggerOperation(Summary = "Busca um produto pelo ID", Description = "Retorna os detalhes de um produto específico, incluindo informações de categoria e subcategoria.")]
        [SwaggerResponse(200, "Produto encontrado.")]
        [SwaggerResponse(404, "Produto não encontrado.")]
        [SwaggerResponse(500, "Erro interno no servidor.")]
        public async Task<IActionResult> GetById(int id)
        {
            _logger.LogInformation("Iniciando busca do produto com ID: {ProductId}", id);
            try
            {
                var product = await _context.Products
                    .Include(p => p.Category)
                    .Include(p => p.Subcategory)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (product == null)
                {
                    _logger.LogWarning("Produto com ID {ProductId} não encontrado.", id);
                    return NotFound(new { Message = "Produto não encontrado." });
                }

                _logger.LogInformation("Produto com ID {ProductId} encontrado.", id);
                return Ok(product);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar produto com ID: {ProductId}", id);
                return StatusCode(500, new { Message = "Erro interno no servidor. Por favor, tente novamente mais tarde." });
            }
        }

        /// <summary>
        /// Cria um novo produto.
        /// </summary>
        /// <param name="dto">Dados do produto a ser criado.</param>
        /// <returns>Produto criado.</returns>
        [HttpPost]
        [SwaggerOperation(Summary = "Cria um novo produto", Description = "Adiciona um novo produto ao sistema, verificando se a categoria e subcategoria associadas existem.")]
        [SwaggerResponse(201, "Produto criado com sucesso.")]
        [SwaggerResponse(404, "Categoria ou subcategoria associada não encontrada.")]
        [SwaggerResponse(500, "Erro interno no servidor.")]
        public async Task<IActionResult> Create(CreateProductDto dto)
        {
            _logger.LogInformation("Iniciando criação de produto.");
            try
            {
                var category = await _context.Categories.FindAsync(dto.CategoryId);
                if (category == null)
                {
                    _logger.LogWarning("Categoria associada ao produto não encontrada: {CategoryId}", dto.CategoryId);
                    return NotFound(new { Message = "Categoria associada não encontrada." });
                }

                if (dto.SubcategoryId.HasValue)
                {
                    var subcategory = await _context.Subcategories.FindAsync(dto.SubcategoryId.Value);
                    if (subcategory == null)
                    {
                        _logger.LogWarning("Subcategoria associada ao produto não encontrada: {SubcategoryId}", dto.SubcategoryId);
                        return NotFound(new { Message = "Subcategoria associada não encontrada." });
                    }
                }

                var product = new Product
                {
                    Name = dto.Name,
                    Sku = dto.Sku,
                    Barcode = dto.Barcode,
                    Description = dto.Description,
                    CostPrice = dto.CostPrice,
                    SalePrice = dto.SalePrice,
                    Quantity = dto.Quantity,
                    CategoryId = dto.CategoryId,
                    SubcategoryId = dto.SubcategoryId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Produto criado com sucesso: {ProductName}", product.Name);
                return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao criar produto.");
                return StatusCode(500, new { Message = "Erro interno no servidor. Por favor, tente novamente mais tarde." });
            }
        }

        /// <summary>
        /// Atualiza um produto existente.
        /// </summary>
        /// <param name="id">ID do produto a ser atualizado.</param>
        /// <param name="dto">Dados atualizados do produto.</param>
        /// <returns>Nenhum conteúdo.</returns>
        [HttpPut("{id}")]
        [SwaggerOperation(Summary = "Atualiza um produto", Description = "Atualiza os dados de um produto existente no sistema.")]
        [SwaggerResponse(204, "Produto atualizado com sucesso.")]
        [SwaggerResponse(404, "Produto não encontrado.")]
        [SwaggerResponse(500, "Erro interno no servidor.")]
        public async Task<IActionResult> Update(int id, UpdateProductDto dto)
        {
            _logger.LogInformation("Iniciando atualização do produto com ID: {ProductId}", id);
            try
            {
                var product = await _context.Products.FindAsync(id);
                if (product == null)
                {
                    _logger.LogWarning("Produto com ID {ProductId} não encontrado.", id);
                    return NotFound(new { Message = "Produto não encontrado." });
                }

                product.Name = dto.Name;
                product.Sku = dto.Sku;
                product.Barcode = dto.Barcode;
                product.Description = dto.Description;
                product.CostPrice = dto.CostPrice;
                product.SalePrice = dto.SalePrice;
                product.Quantity = dto.Quantity;
                product.CategoryId = dto.CategoryId;
                product.SubcategoryId = dto.SubcategoryId;
                product.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logger.LogInformation("Produto com ID {ProductId} atualizado com sucesso.", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao atualizar produto com ID: {ProductId}", id);
                return StatusCode(500, new { Message = "Erro interno no servidor. Por favor, tente novamente mais tarde." });
            }
        }

        /// <summary>
        /// Exclui um produto logicamente.
        /// </summary>
        /// <param name="id">ID do produto a ser excluído.</param>
        /// <returns>Nenhum conteúdo.</returns>
        [HttpDelete("{id}")]
        [SwaggerOperation(Summary = "Exclui um produto logicamente", Description = "Marca um produto como excluído, sem removê-lo fisicamente do banco.")]
        [SwaggerResponse(204, "Produto excluído com sucesso.")]
        [SwaggerResponse(404, "Produto não encontrado.")]
        [SwaggerResponse(500, "Erro interno no servidor.")]
        public async Task<IActionResult> Delete(int id)
        {
            _logger.LogInformation("Iniciando exclusão lógica do produto com ID: {ProductId}", id);
            try
            {
                var product = await _context.Products.FindAsync(id);
                if (product == null)
                {
                    _logger.LogWarning("Produto com ID {ProductId} não encontrado.", id);
                    return NotFound(new { Message = "Produto não encontrado." });
                }

                product.IsDeleted = true;
                product.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logger.LogInformation("Produto com ID {ProductId} marcado como excluído.", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao excluir logicamente o produto com ID: {ProductId}", id);
                return StatusCode(500, new { Message = "Erro interno no servidor. Por favor, tente novamente mais tarde." });
            }
        }
    }
}

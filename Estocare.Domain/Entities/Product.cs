namespace Estocare.Domain.Entities
{
    /// <summary>
    /// Representa um produto no sistema.
    /// </summary>
    public class Product
    {
        /// <summary>
        /// Identificador único do produto.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Nome do produto.
        /// </summary>
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Código único do produto (SKU).
        /// </summary>
        public string? Sku { get; set; }

        /// <summary>
        /// Código de barras do produto.
        /// </summary>
        public string? Barcode { get; set; }

        /// <summary>
        /// Descrição detalhada do produto.
        /// </summary>
        public string? Description { get; set; }

        /// <summary>
        /// Preço de custo do produto.
        /// </summary>
        public decimal CostPrice { get; set; }

        /// <summary>
        /// Preço de venda do produto.
        /// </summary>
        public decimal SalePrice { get; set; }

        /// <summary>
        /// Quantidade atual em estoque.
        /// </summary>
        public int Quantity { get; set; }

        /// <summary>
        /// Data de criação do produto.
        /// </summary>
        public DateTime CreatedAt { get; set; }

        /// <summary>
        /// Data da última atualização do produto.
        /// </summary>
        public DateTime UpdatedAt { get; set; }

        /// <summary>
        /// Indica se o produto foi excluído logicamente.
        /// </summary>
        public bool IsDeleted { get; set; } = false;

        /// <summary>
        /// Identificador da categoria associada (chave estrangeira).
        /// </summary>
        public int CategoryId { get; set; }

        /// <summary>
        /// Categoria associada ao produto.
        /// </summary>
        public Category Category { get; set; } = null!;

        /// <summary>
        /// Identificador da subcategoria associada (chave estrangeira, opcional).
        /// </summary>
        public int? SubcategoryId { get; set; }

        /// <summary>
        /// Subcategoria associada ao produto (opcional).
        /// </summary>
        public Subcategory? Subcategory { get; set; }
    }
}

namespace Estocare.Domain.Entities
{
    /// <summary>
    /// Representa uma categoria de produtos no sistema.
    /// </summary>
    public class Category
    {
        /// <summary>
        /// Identificador único da categoria.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Nome da categoria (e.g., Eletrônicos).
        /// </summary>
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Data de criação da categoria.
        /// </summary>
        public DateTime CreatedAt { get; set; }

        /// <summary>
        /// Data de atualização da categoria.
        /// </summary>
        public DateTime UpdatedAt { get; set; }

        /// <summary>
        /// Indica se a categoria foi excluída logicamente.
        /// </summary>
        public bool IsDeleted { get; set; } = false;

        /// <summary>
        /// Lista de subcategorias associadas à categoria.
        /// </summary>
        public ICollection<Subcategory> Subcategories { get; set; } = new List<Subcategory>();
    }
}

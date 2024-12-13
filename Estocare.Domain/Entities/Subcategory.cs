namespace Estocare.Domain.Entities
{
    /// <summary>
    /// Representa uma subcategoria de produtos no sistema.
    /// </summary>
    public class Subcategory
    {
        /// <summary>
        /// Identificador único da subcategoria.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Identificador da categoria associada (chave estrangeira).
        /// </summary>
        public int CategoryId { get; set; }

        /// <summary>
        /// Nome da subcategoria (e.g., Celulares).
        /// </summary>
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Data de criação da subcategoria.
        /// </summary>
        public DateTime CreatedAt { get; set; }

        /// <summary>
        /// Data de atualização da subcategoria.
        /// </summary>
        public DateTime UpdatedAt { get; set; }

        /// <summary>
        /// Indica se a subcategoria foi excluída logicamente.
        /// </summary>
        public bool IsDeleted { get; set; } = false;

        /// <summary>
        /// Categoria associada à subcategoria.
        /// </summary>
        public Category Category { get; set; } = null!;
    }
}

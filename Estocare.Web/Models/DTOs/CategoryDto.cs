namespace Estocare.Web.Models.DTOs
{
    /// <summary>
    /// Representa os dados transferidos de uma categoria.
    /// </summary>
    public class CategoryDto
    {
        /// <summary>
        /// Identificador único da categoria.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Nome da categoria.
        /// </summary>
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Data de criação.
        /// </summary>
        public DateTime CreatedAt { get; set; }

        /// <summary>
        /// Data de última atualização.
        /// </summary>
        public DateTime UpdatedAt { get; set; }
    }
}

namespace Estocare.Api.DTOs
{
    /// <summary>
    /// DTO para exibir informações detalhadas da categoria.
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
        /// Data de criação da categoria.
        /// </summary>
        public DateTime CreatedAt { get; set; }

        /// <summary>
        /// Data de atualização da categoria.
        /// </summary>
        public DateTime UpdatedAt { get; set; }
    }
}

namespace Estocare.Api.DTOs
{
    /// <summary>
    /// DTO para atualização de uma categoria existente.
    /// </summary>
    public class UpdateCategoryDto
    {
        /// <summary>
        /// Nome atualizado da categoria.
        /// </summary>
        public string Name { get; set; } = string.Empty;
    }
}

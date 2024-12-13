namespace Estocare.Web.Models.DTOs
{
    /// <summary>
    /// Representa os dados necessários para atualizar uma categoria.
    /// </summary>
    public class UpdateCategoryDto
    {
        /// <summary>
        /// Nome atualizado da categoria.
        /// </summary>
        public string Name { get; set; } = string.Empty;
    }
}

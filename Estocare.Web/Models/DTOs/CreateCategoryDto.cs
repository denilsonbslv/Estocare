namespace Estocare.Web.Models.DTOs
{
    /// <summary>
    /// Representa os dados necessários para criar uma categoria.
    /// </summary>
    public class CreateCategoryDto
    {
        /// <summary>
        /// Nome da categoria.
        /// </summary>
        public string Name { get; set; } = string.Empty;
    }
}

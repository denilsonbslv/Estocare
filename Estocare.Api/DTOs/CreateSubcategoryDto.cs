namespace Estocare.Api.DTOs
{
    public class CreateSubcategoryDto
    {
        public string Name { get; set; } = string.Empty; // Nome da subcategoria
        public int CategoryId { get; set; } // ID da categoria associada
    }
}

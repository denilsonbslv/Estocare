using Estocare.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Estocare.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // DbSets para as tabelas
        public DbSet<Category> Categories { get; set; }
        public DbSet<Subcategory> Subcategories { get; set; }
        public DbSet<Product> Products { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuração da tabela Category
            modelBuilder.Entity<Category>(entity =>
            {
                entity.ToTable("categories");
                entity.HasKey(c => c.Id);
                entity.Property(c => c.Name).IsRequired().HasMaxLength(100);
                entity.Property(c => c.CreatedAt).HasDefaultValueSql("GETDATE()");
                entity.Property(c => c.UpdatedAt).HasDefaultValueSql("GETDATE()");
                entity.Property(c => c.IsDeleted).HasDefaultValue(false);
            });

            // Configuração da tabela Subcategory
            modelBuilder.Entity<Subcategory>(entity =>
            {
                entity.ToTable("subcategories");
                entity.HasKey(sc => sc.Id);
                entity.Property(sc => sc.Name).IsRequired().HasMaxLength(100);
                entity.Property(sc => sc.CreatedAt).HasDefaultValueSql("GETDATE()");
                entity.Property(sc => sc.UpdatedAt).HasDefaultValueSql("GETDATE()");
                entity.Property(sc => sc.IsDeleted).HasDefaultValue(false);

                // Relacionamento: Subcategory → Category
                entity.HasOne(sc => sc.Category)
                      .WithMany(c => c.Subcategories)
                      .HasForeignKey(sc => sc.CategoryId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Configuração da tabela Product
            modelBuilder.Entity<Product>(entity =>
            {
                entity.ToTable("products");
                entity.HasKey(p => p.Id);
                entity.Property(p => p.Name).IsRequired().HasMaxLength(255);
                entity.Property(p => p.Sku).HasMaxLength(50);
                entity.Property(p => p.Barcode).HasMaxLength(100);
                entity.Property(p => p.Description).HasColumnType("TEXT");
                entity.Property(p => p.CostPrice).HasColumnType("DECIMAL(10,2)");
                entity.Property(p => p.SalePrice).HasColumnType("DECIMAL(10,2)");
                entity.Property(p => p.Quantity).IsRequired();
                entity.Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()");
                entity.Property(p => p.UpdatedAt).HasDefaultValueSql("GETDATE()");
                entity.Property(p => p.IsDeleted).HasDefaultValue(false);

                // Relacionamento: Product → Category
                entity.HasOne(p => p.Category)
                      .WithMany()
                      .HasForeignKey(p => p.CategoryId)
                      .OnDelete(DeleteBehavior.Restrict);

                // Relacionamento: Product → Subcategory
                entity.HasOne(p => p.Subcategory)
                      .WithMany()
                      .HasForeignKey(p => p.SubcategoryId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Filtros globais para ignorar registros deletados
            modelBuilder.Entity<Category>().HasQueryFilter(c => !c.IsDeleted);
            modelBuilder.Entity<Subcategory>().HasQueryFilter(sc => !sc.IsDeleted);
            modelBuilder.Entity<Product>().HasQueryFilter(p => !p.IsDeleted);
        }
    }
}

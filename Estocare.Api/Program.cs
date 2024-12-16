using Estocare.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Configuração de CORS para permitir tudo (apenas para testes)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin() // Permitir qualquer origem
              .AllowAnyMethod() // Permitir qualquer método (GET, POST, PUT, DELETE, etc.)
              .AllowAnyHeader(); // Permitir qualquer cabeçalho
    });
});

// Configurar o AppDbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Adicionar serviços necessários
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve; // Tratar referências cíclicas
        options.JsonSerializerOptions.WriteIndented = true; // Opcional: formatar JSON para melhor visualização
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Usar HTTPS e CORS (com política ampla)
app.UseHttpsRedirection();
app.UseCors("AllowAll"); // Aplicar a política de CORS

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();
app.MapControllers();

app.Run();

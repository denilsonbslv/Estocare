using Estocare.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Configura��o de CORS para permitir tudo (apenas para testes)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin() // Permitir qualquer origem
              .AllowAnyMethod() // Permitir qualquer m�todo (GET, POST, PUT, DELETE, etc.)
              .AllowAnyHeader(); // Permitir qualquer cabe�alho
    });
});

// Configurar o AppDbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Adicionar servi�os necess�rios
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Usar HTTPS e CORS (com pol�tica ampla)
app.UseHttpsRedirection();
app.UseCors("AllowAll"); // Aplicar a pol�tica de CORS

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();
app.MapControllers();

app.Run();

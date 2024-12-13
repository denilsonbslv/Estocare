using Estocare.Web;
using Estocare.Web.Services;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;

var builder = WebAssemblyHostBuilder.CreateDefault(args);

// Registrar os componentes principais
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

// Configurar o HttpClient com a URL base da API
builder.Services.AddScoped(sp => new HttpClient
{
    BaseAddress = new Uri("http://localhost:5000/") // Base URL da API
});

// Registrar o serviço de categorias
builder.Services.AddScoped<CategoryService>();

await builder.Build().RunAsync();

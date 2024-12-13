# Estocare

**Estocare** é um sistema de gerenciamento de estoque desenvolvido com foco em escalabilidade, modularidade e facilidade de uso. Nosso objetivo é oferecer uma solução robusta para varejistas, integrando tecnologias modernas para gestão eficiente de categorias, subcategorias e produtos.

---

## ⚡ Funcionalidades Principais

- **API RESTful**: CRUD para categorias, subcategorias e produtos.
- **Exclusão Lógica**: Gerencie registros sem perder dados.
- **Logs Detalhados**: Monitoramento de operações para facilitar depuração.
- **Documentação de Endpoints**: Swagger integrado.
- **Banco de Dados**: Utiliza SQL Server LocalDB para facilitar o desenvolvimento local.
- **CORS Configurado**: Permite chamadas de diferentes origens para facilitar integrações.

---

## 🌐 Tecnologias Utilizadas

- **.NET 9**: Base do backend.
- **Entity Framework Core**: ORM para manipulação de dados.
- **SQL Server LocalDB**: Banco de dados leve e simples para desenvolvimento.
- **Swagger**: Documentação interativa de endpoints.
- **Visual Studio 2022 Preview**: IDE principal.

---

## ⚙️ Configuração do Ambiente

### **Requisitos**

- .NET 9 instalado.
- Visual Studio 2022 Preview ou outra IDE de sua preferência.
- SQL Server LocalDB configurado.

### **Passos para Configurar**

1. Clone o repositório:

   ```bash
   git clone https://github.com/denilsonbslv/Estocare.git
   ```

2. Navegue até o diretório do projeto:

   ```bash
   cd Estocare
   ```

3. Configure o banco de dados:

   - Certifique-se de que o LocalDB está rodando.
   - O arquivo `appsettings.json` já inclui uma string de conexão padrão:
     ```json
     "ConnectionStrings": {
         "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=EstocareDB;Trusted_Connection=True;MultipleActiveResultSets=true"
     }
     ```

4. Restaure as dependências:

   ```bash
   dotnet restore
   ```

5. Aplique as migrações e atualize o banco de dados:

   ```bash
   dotnet ef database update --project Estocare.Infrastructure --startup-project Estocare.Api
   ```

6. Inicie a aplicação:

   ```bash
   dotnet run --project Estocare.Api
   ```

---

## 🔄 Endpoints da API

A API está documentada com **Swagger**. Você pode acessá-la através da seguinte URL quando a aplicação estiver rodando:

```
https://localhost:7281/swagger
```

Exemplo de endpoints:

- **GET /api/Category**: Lista todas as categorias.
- **POST /api/Category**: Cria uma nova categoria.
- **PUT /api/Category/{id}**: Atualiza uma categoria existente.
- **DELETE /api/Category/{id}**: Exclui logicamente uma categoria.

---

## ✨ Futuro do Projeto

- Implementar autenticação e controle de acesso.
- Adicionar suporte para relatórios e análises de estoque.
- Desenvolver o frontend com **Blazor WebAssembly**.
- Integração com serviços externos (e.g., gateways de pagamento, APIs de frete).

---

## 🛠️ Contribuições

Contribuições são bem-vindas! Siga os passos abaixo para contribuir:

1. Fork este repositório.
2. Crie uma branch para sua feature/bugfix:
   ```bash
   git checkout -b minha-feature
   ```
3. Realize suas alterações e faça commits claros:
   ```bash
   git commit -m "Adiciona nova funcionalidade X"
   ```
4. Envie suas alterações:
   ```bash
   git push origin minha-feature
   ```
5. Abra um Pull Request neste repositório.

---

## ✅ Licença

Este projeto está licenciado sob a Licença MIT. Consulte o arquivo `LICENSE` para mais informações.

---

## ✨ Agradecimentos

Obrigado por explorar o projeto **Estocare**! Se você tiver alguma sugestão ou dúvida, fique à vontade para abrir uma **issue** no repositório ou entrar em contato.

---

Feito com ❤ por **[Denilson](https://github.com/denilsonbslv)**



## Pré-requisitos

- Node.js instalado (versão 14 ou superior)
- Banco de dados PostgreSQL configurado (verifique o arquivo `.env`)

## Passos para rodar o sistema

1. **Instale as dependências do projeto:**
   ```powershell
   npm install
   ```

2. **Configure o banco de dados:**
   - Edite o arquivo `.env` com os dados do seu PostgreSQL.
   - Execute o script `database/setup.sql` no seu banco para criar as tabelas e dados de exemplo.

3. **Inicie o servidor:**
   ```powershell
   npm start
   ```

4. **Acesse o front:**
   - Abra o navegador e acesse: [http://localhost:3000](http://localhost:3000)




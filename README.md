# Sistema de Conversas - Atendentes

Sistema web para visualizar e gerenciar conversas entre atendentes e clientes, com interface estilo WhatsApp.

## 🚀 Funcionalidades

- ✅ Seleção de atendentes
- ✅ Visualização de contatos por atendente
- ✅ Interface de chat estilo WhatsApp
- ✅ Busca de atendentes e contatos
- ✅ Timestamps e status das mensagens
- ✅ Design responsivo
- ✅ Integração com PostgreSQL

## 🛠️ Tecnologias

- **Backend**: Node.js + Express
- **Frontend**: HTML5 + CSS3 + JavaScript
- **Banco**: PostgreSQL
- **Integração**: n8n (webhook compatível)

## 📦 Instalação

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar banco de dados
```bash
# Copie o arquivo de exemplo
copy .env.example .env

# Edite o arquivo .env com suas configurações
```

### 3. Configurar PostgreSQL
```sql
-- Execute o script SQL para criar as tabelas
psql -U seu_usuario -d seu_banco -f database/setup.sql
```

### 4. Iniciar aplicação
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## ⚙️ Configuração

### Arquivo .env
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=seu_banco
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
PORT=3000
```

### Estrutura do Banco
```sql
CREATE TABLE mensagens (
    id SERIAL PRIMARY KEY,
    atendente_numero VARCHAR(20) NOT NULL,
    contato_numero VARCHAR(20) NOT NULL,
    mensagem TEXT NOT NULL,
    tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('enviado', 'recebido')),
    data_hora TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## 🔗 API Endpoints

### Atendentes
- `GET /api/atendentes` - Lista todos os atendentes

### Conversas
- `GET /api/conversas/:numero` - Lista contatos do atendente
- `GET /api/mensagens/:atendente/:contato` - Mensagens da conversa

### Estatísticas
- `GET /api/estatisticas/:numero` - Estatísticas do atendente

## 🎨 Interface

### Tela Principal
- Lista de atendentes com estatísticas
- Busca por nome/número
- Seleção visual do atendente ativo

### Tela de Contatos
- Lista de conversas do atendente
- Prévia da última mensagem
- Timestamp da última interação

### Tela de Chat
- Interface estilo WhatsApp
- Mensagens enviadas (verde, direita)
- Mensagens recebidas (branco, esquerda)
- Timestamps formatados

## 🔄 Integração com n8n

O sistema é compatível com fluxos n8n que salvam mensagens no formato:

```json
{
  "atendente_numero": "+5511999998888",
  "contato_numero": "+5511988887777",
  "mensagem": "Texto da mensagem",
  "tipo": "enviado|recebido",
  "data_hora": "2025-06-01T10:00:00.000Z"
}
```

### Webhook de Exemplo
Configure seu webhook n8n para salvar no PostgreSQL usando estes campos.

## 📱 Recursos Adicionais

### Busca e Filtros
- Busca de atendentes por nome/número
- Busca de contatos por nome/número/mensagem
- Filtros em tempo real

### Formatação
- Números de telefone formatados
- Datas relativas (hoje, ontem, DD/MM)
- Horários localizados (HH:MM)

### Interface Responsiva
- Design adaptável para mobile
- Sidebar colapsável
- Otimizado para touch

## 🐛 Solução de Problemas

### Erro de Conexão com Banco
1. Verifique as credenciais no arquivo `.env`
2. Confirme se o PostgreSQL está rodando
3. Teste a conexão manualmente

### Dados Não Aparecem
1. Verifique se a tabela `mensagens` existe
2. Execute o script SQL de exemplo
3. Confirme se há dados na tabela

### Erro de CORS
- O backend já está configurado com CORS habilitado
- Para produção, configure origins específicas

## 📈 Performance

### Otimizações Implementadas
- Índices no banco de dados
- Pool de conexões PostgreSQL
- Lazy loading de mensagens
- Cache de consultas frequentes

### Recomendações
- Use um reverse proxy (nginx) em produção
- Configure limits de rate limiting
- Monitore o uso de memória

## 🔧 Desenvolvimento

### Estrutura de Arquivos
```
agente-cobranca/
├── config/
│   └── database.js      # Configuração do PostgreSQL
├── routes/
│   └── conversas.js     # Rotas da API
├── public/
│   ├── index.html       # Interface principal
│   ├── styles.css       # Estilos CSS
│   └── script.js        # JavaScript frontend
├── database/
│   └── setup.sql        # Script de criação do banco
├── server.js            # Servidor Express
└── package.json         # Dependências
```

### Scripts Disponíveis
- `npm start` - Inicia em produção
- `npm run dev` - Inicia com nodemon (desenvolvimento)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.

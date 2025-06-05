# 🚀 Guia de Configuração Rápida

## ⚡ Para começar agora mesmo:

### 1. Configure seu banco PostgreSQL

**Edite o arquivo `.env`** com suas credenciais:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nome_do_seu_banco
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
```

### 2. Execute o script SQL no seu banco
```sql
-- Copie e execute o conteúdo do arquivo database/setup.sql
-- Ele vai criar a tabela 'mensagens' e inserir dados de exemplo
```

### 3. Inicie o servidor
```bash
npm start
```

### 4. Acesse a aplicação
Abra seu navegador em: **http://localhost:3000**

---

## 🔧 Integração com n8n

### Para seu fluxo atual no n8n:

1. **Webhook que recebe mensagens** deve salvar no PostgreSQL com esta estrutura:
```sql
INSERT INTO mensagens (atendente_numero, contato_numero, mensagem, tipo, data_hora)
VALUES ($1, $2, $3, $4, NOW());
```

2. **Campos obrigatórios:**
   - `atendente_numero`: Número do chip/atendente (ex: "+5511999998888")
   - `contato_numero`: Número do cliente (ex: "+5511988887777") 
   - `mensagem`: Texto da mensagem
   - `tipo`: "enviado" ou "recebido"

### Exemplo de configuração n8n:
```json
{
  "atendente_numero": "{{$json.from}}",
  "contato_numero": "{{$json.to}}",
  "mensagem": "{{$json.body}}",
  "tipo": "{{$json.fromMe ? 'enviado' : 'recebido'}}"
}
```

---

## 📱 Como usar o sistema:

### 1. **Tela Inicial**
- Veja a lista de atendentes na barra lateral
- Cada atendente mostra quantas mensagens tem
- Use a busca para encontrar atendentes específicos

### 2. **Seleção de Atendente**
- Clique em qualquer atendente
- Veja todos os contatos que conversaram com esse atendente
- Visualize a última mensagem de cada conversa

### 3. **Visualização de Chat**
- Clique em qualquer contato
- Veja a conversa completa estilo WhatsApp
- Mensagens enviadas aparecem à direita (verde)
- Mensagens recebidas aparecem à esquerda (branco)

---

## 🎯 Recursos Especiais:

### ✅ **Busca Inteligente**
- Busque atendentes por número ou nome
- Busque contatos por número, nome ou texto de mensagem

### ✅ **Formatação Automática**
- Números de telefone formatados automaticamente
- Horários em formato brasileiro (HH:MM)
- Datas relativas (hoje, ontem, DD/MM)

### ✅ **Interface Responsiva**
- Funciona perfeitamente no celular
- Design adaptável para tablets
- Navegação intuitiva

### ✅ **Atualizações**
- Botões de refresh em cada tela
- Atualizações automáticas (opcional)
- Estados de loading durante carregamento

---

## 🐛 Solução de Problemas Comuns:

### **Erro: "Nenhum atendente encontrado"**
- Verifique se a tabela `mensagens` existe
- Confirme se há dados na tabela
- Execute o script SQL de exemplo

### **Erro de conexão com banco**
- Verifique as credenciais no arquivo `.env`
- Confirme se o PostgreSQL está rodando
- Teste a conexão diretamente

### **Página não carrega**
- Verifique se o servidor está rodando na porta 3000
- Confirme se não há conflitos de porta
- Verifique o console do navegador para erros

---

## 🚀 Para Produção:

### **Recomendações:**
1. Use PM2 para gerenciar o processo Node.js
2. Configure nginx como reverse proxy
3. Use HTTPS em produção
4. Configure backup automático do banco
5. Monitore logs e performance

### **Exemplo PM2:**
```bash
npm install -g pm2
pm2 start server.js --name "conversas-app"
pm2 startup
pm2 save
```

---

## 📞 Precisa de Ajuda?

O sistema está pronto para uso! Se precisar de:
- Customizações na interface
- Novos recursos
- Integração com outros sistemas
- Otimizações de performance

Tudo está documentado e bem estruturado para facilitar modificações futuras.

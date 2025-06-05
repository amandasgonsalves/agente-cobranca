# 🔄 Exemplos de Integração n8n

## 📥 Webhook para Receber Mensagens

### Configuração do Webhook n8n:

```json
{
  "httpMethod": "POST",
  "path": "webhook-mensagens",
  "responseMode": "onReceived",
  "options": {}
}
```

### Node PostgreSQL para Salvar:

```sql
INSERT INTO mensagens (
    atendente_numero, 
    contato_numero, 
    mensagem, 
    tipo, 
    data_hora
) VALUES (
    $1, $2, $3, $4, $5
);
```

**Parâmetros:**
- `$1`: `{{$json.atendente_numero}}`
- `$2`: `{{$json.contato_numero}}`
- `$3`: `{{$json.mensagem}}`
- `$4`: `{{$json.tipo}}`
- `$5`: `{{$json.data_hora || new Date().toISOString()}}`

---

## 📤 Webhook para Consultar Mensagens

### Endpoint de Consulta:
```
GET http://localhost:3000/api/mensagens/{{$json.atendente}}/{{$json.contato}}
```

### Node HTTP Request:
```json
{
  "method": "GET",
  "url": "http://localhost:3000/api/mensagens/{{$json.atendente_numero}}/{{$json.contato_numero}}",
  "options": {
    "timeout": 10000
  }
}
```

---

## 🤖 Exemplo Completo: WhatsApp → PostgreSQL

### 1. Webhook Receiver (WhatsApp)
```json
{
  "from": "+5511999998888",
  "to": "+5511988887777", 
  "body": "Olá, tudo bem?",
  "fromMe": false,
  "timestamp": "2025-06-05T10:30:00.000Z"
}
```

### 2. Function Node (Processar Dados)
```javascript
// Determinar tipo da mensagem
const tipo = items[0].json.fromMe ? 'enviado' : 'recebido';

// Determinar atendente e contato
const atendenteNumero = items[0].json.fromMe ? 
    items[0].json.from : items[0].json.to;
const contatoNumero = items[0].json.fromMe ? 
    items[0].json.to : items[0].json.from;

return items.map(item => {
    return {
        json: {
            atendente_numero: atendenteNumero,
            contato_numero: contatoNumero,
            mensagem: item.json.body,
            tipo: tipo,
            data_hora: item.json.timestamp || new Date().toISOString()
        }
    };
});
```

### 3. PostgreSQL Insert
```sql
INSERT INTO mensagens (atendente_numero, contato_numero, mensagem, tipo, data_hora)
VALUES ($1, $2, $3, $4, $5);
```

---

## 🔍 Fluxo de Consulta Avançada

### Node para Buscar Conversas do Dia:
```sql
SELECT 
    contato_numero,
    mensagem,
    tipo,
    data_hora
FROM mensagens 
WHERE atendente_numero = $1 
  AND DATE(data_hora) = CURRENT_DATE
ORDER BY data_hora DESC;
```

### Node para Estatísticas:
```sql
SELECT 
    COUNT(*) as total_mensagens,
    COUNT(DISTINCT contato_numero) as total_contatos,
    COUNT(CASE WHEN tipo = 'enviado' THEN 1 END) as enviadas,
    COUNT(CASE WHEN tipo = 'recebido' THEN 1 END) as recebidas
FROM mensagens 
WHERE atendente_numero = $1 
  AND DATE(data_hora) = CURRENT_DATE;
```

---

## 📊 Dashboard de Relatórios

### Mensagens por Hora:
```sql
SELECT 
    EXTRACT(hour FROM data_hora) as hora,
    COUNT(*) as quantidade
FROM mensagens 
WHERE DATE(data_hora) = CURRENT_DATE
GROUP BY EXTRACT(hour FROM data_hora)
ORDER BY hora;
```

### Top Contatos do Dia:
```sql
SELECT 
    contato_numero,
    COUNT(*) as total_mensagens,
    MAX(data_hora) as ultima_mensagem
FROM mensagens 
WHERE DATE(data_hora) = CURRENT_DATE
GROUP BY contato_numero
ORDER BY total_mensagens DESC
LIMIT 10;
```

---

## 🔧 Configuração de Ambiente n8n

### Variáveis de Ambiente:
```env
# n8n
N8N_WEBHOOK_URL=http://localhost:5678
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=sua_senha

# PostgreSQL (compartilhado)
DB_POSTGRESDB_HOST=localhost
DB_POSTGRESDB_PORT=5432
DB_POSTGRESDB_DATABASE=seu_banco
DB_POSTGRESDB_USER=seu_usuario
DB_POSTGRESDB_PASSWORD=sua_senha
```

### Credentials para PostgreSQL:
```json
{
  "host": "localhost",
  "port": 5432,
  "database": "seu_banco",
  "user": "seu_usuario",
  "password": "sua_senha",
  "ssl": false
}
```

---

## 🚀 Workflow Completo Sugerido

### 1. **Receber Mensagem** (Webhook)
↓
### 2. **Processar Dados** (Function)
↓
### 3. **Salvar no Banco** (PostgreSQL)
↓
### 4. **Notificar Sistema** (HTTP Request - opcional)
↓
### 5. **Log/Analytics** (Opcional)

---

## 📝 JSON de Exemplo para Teste

```json
{
  "atendente_numero": "+5511999998888",
  "contato_numero": "+5511988887777",
  "mensagem": "Mensagem de teste via n8n",
  "tipo": "recebido",
  "data_hora": "2025-06-05T10:30:00.000Z"
}
```

### Teste via curl:
```bash
curl -X POST http://localhost:5678/webhook/webhook-mensagens \
  -H "Content-Type: application/json" \
  -d '{
    "atendente_numero": "+5511999998888",
    "contato_numero": "+5511988887777", 
    "mensagem": "Teste de integração",
    "tipo": "recebido"
  }'
```

Com essas configurações, seu fluxo n8n já existente pode facilmente integrar com o sistema de conversas!

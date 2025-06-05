-- Script SQL para criar a estrutura do banco de dados
-- Execute este script no seu PostgreSQL

-- Criar a tabela de mensagens (se não existir)
CREATE TABLE IF NOT EXISTS mensagens (
    id SERIAL PRIMARY KEY,
    atendente_numero VARCHAR(20) NOT NULL,
    contato_numero VARCHAR(20) NOT NULL,
    mensagem TEXT NOT NULL,
    tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('enviado', 'recebido')),
    data_hora TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_mensagens_atendente ON mensagens (atendente_numero);
CREATE INDEX IF NOT EXISTS idx_mensagens_contato ON mensagens (contato_numero);
CREATE INDEX IF NOT EXISTS idx_mensagens_data_hora ON mensagens (data_hora);
CREATE INDEX IF NOT EXISTS idx_mensagens_atendente_contato ON mensagens (atendente_numero, contato_numero);

-- Inserir dados de exemplo (opcional - remova se já tem dados reais)
INSERT INTO mensagens (atendente_numero, contato_numero, mensagem, tipo, data_hora) VALUES
-- Conversa 1: Atendente 5511999998888 com Contato 5511988887777
('+5511999998888', '+5511988887777', 'Olá, tudo bem?', 'enviado', '2025-06-01T10:00:00.000Z'),
('+5511999998888', '+5511988887777', 'Tudo sim, quem fala?', 'recebido', '2025-06-01T10:01:00.000Z'),
('+5511999998888', '+5511988887777', 'Aqui é da empresa XYZ, sobre seu pedido', 'enviado', '2025-06-01T10:02:00.000Z'),
('+5511999998888', '+5511988887777', 'Ah sim, qual o status?', 'recebido', '2025-06-01T10:03:00.000Z'),
('+5511999998888', '+5511988887777', 'Seu pedido foi aprovado e será enviado hoje', 'enviado', '2025-06-01T10:04:00.000Z'),
('+5511999998888', '+5511988887777', 'Perfeito, obrigado!', 'recebido', '2025-06-01T10:05:00.000Z'),

-- Conversa 2: Atendente 5511999998888 com Contato 5511977776666
('+5511999998888', '+5511977776666', 'Bom dia! Como posso ajudar?', 'enviado', '2025-06-01T11:00:00.000Z'),
('+5511999998888', '+5511977776666', 'Preciso de informações sobre pagamento', 'recebido', '2025-06-01T11:01:00.000Z'),
('+5511999998888', '+5511977776666', 'Claro! Qual sua dúvida específica?', 'enviado', '2025-06-01T11:02:00.000Z'),
('+5511999998888', '+5511977776666', 'Posso pagar em quantas parcelas?', 'recebido', '2025-06-01T11:03:00.000Z'),
('+5511999998888', '+5511977776666', 'Oferecemos até 12x sem juros', 'enviado', '2025-06-01T11:04:00.000Z'),

-- Conversa 3: Atendente 5511888887777 com Contato 5511966665555
('+5511888887777', '+5511966665555', 'Boa tarde!', 'enviado', '2025-06-01T14:00:00.000Z'),
('+5511888887777', '+5511966665555', 'Oi, preciso cancelar meu pedido', 'recebido', '2025-06-01T14:01:00.000Z'),
('+5511888887777', '+5511966665555', 'Sem problemas. Qual o número do pedido?', 'enviado', '2025-06-01T14:02:00.000Z'),
('+5511888887777', '+5511966665555', 'Pedido #12345', 'recebido', '2025-06-01T14:03:00.000Z'),
('+5511888887777', '+5511966665555', 'Cancelamento realizado com sucesso!', 'enviado', '2025-06-01T14:04:00.000Z'),

-- Conversa 4: Atendente 5511777776666 com Contato 5511955554444
('+5511777776666', '+5511955554444', 'Olá! Tudo bem?', 'enviado', '2025-06-02T09:00:00.000Z'),
('+5511777776666', '+5511955554444', 'Tudo ótimo! Vocês têm desconto?', 'recebido', '2025-06-02T09:01:00.000Z'),
('+5511777776666', '+5511955554444', 'Sim! 15% de desconto para novos clientes', 'enviado', '2025-06-02T09:02:00.000Z'),
('+5511777776666', '+5511955554444', 'Perfeito! Como faço para aproveitar?', 'recebido', '2025-06-02T09:03:00.000Z'),
('+5511777776666', '+5511955554444', 'Use o cupom NOVO15 no checkout', 'enviado', '2025-06-02T09:04:00.000Z'),

-- Mais conversas recentes
('+5511999998888', '+5511988887777', 'Oi, seu pedido chegou?', 'enviado', '2025-06-03T15:30:00.000Z'),
('+5511999998888', '+5511988887777', 'Chegou sim, muito obrigado!', 'recebido', '2025-06-03T15:31:00.000Z'),

('+5511888887777', '+5511944443333', 'Boa tarde! Posso ajudar?', 'enviado', '2025-06-03T16:00:00.000Z'),
('+5511888887777', '+5511944443333', 'Quero saber sobre garantia', 'recebido', '2025-06-03T16:01:00.000Z'),
('+5511888887777', '+5511944443333', 'Nossos produtos têm 1 ano de garantia', 'enviado', '2025-06-03T16:02:00.000Z');

-- Criar view para facilitar consultas (opcional)
CREATE OR REPLACE VIEW v_conversas_resumo AS
SELECT 
    atendente_numero,
    contato_numero,
    COUNT(*) as total_mensagens,
    MAX(data_hora) as ultima_mensagem,
    (SELECT mensagem 
     FROM mensagens m2 
     WHERE m2.atendente_numero = m1.atendente_numero 
       AND m2.contato_numero = m1.contato_numero 
     ORDER BY data_hora DESC 
     LIMIT 1) as ultima_msg_texto,
    COUNT(CASE WHEN tipo = 'enviado' THEN 1 END) as mensagens_enviadas,
    COUNT(CASE WHEN tipo = 'recebido' THEN 1 END) as mensagens_recebidas
FROM mensagens m1
GROUP BY atendente_numero, contato_numero
ORDER BY ultima_mensagem DESC;

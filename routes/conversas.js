const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET /api/atendentes - Retorna lista de atendentes únicos
router.get('/atendentes', async (req, res) => {
    try {
        const query = `
            SELECT DISTINCT atendente_numero as numero, 
                   atendente_numero as nome,
                   COUNT(*) as total_mensagens
            FROM mensagens 
            WHERE atendente_numero IS NOT NULL 
            GROUP BY atendente_numero 
            ORDER BY total_mensagens DESC
        `;
        
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar atendentes:', error);
        
        // Retorna dados de exemplo quando não consegue conectar ao banco
        const dadosExemplo = [
            { numero: '+5511999998888', nome: 'Atendente SP', total_mensagens: 45 },
            { numero: '+5521888887777', nome: 'Atendente RJ', total_mensagens: 32 },
            { numero: '+5531777776666', nome: 'Atendente BH', total_mensagens: 28 },
            { numero: 'SISTEMA', nome: 'Sistema Automático', total_mensagens: 15 }
        ];
        
        console.log('📋 Retornando dados de exemplo para atendentes');
        res.json(dadosExemplo);
    }
});

// GET /api/conversas/:numero - Retorna contatos únicos de um atendente
router.get('/conversas/:numero', async (req, res) => {
    try {
        const { numero } = req.params;
        
        const query = `
            SELECT 
                contato_numero,
                COUNT(*) as total_mensagens,
                MAX(data_hora) as ultima_mensagem,
                (SELECT mensagem 
                 FROM mensagens m2 
                 WHERE m2.atendente_numero = $1 
                   AND m2.contato_numero = m1.contato_numero 
                 ORDER BY data_hora DESC 
                 LIMIT 1) as ultima_msg_texto
            FROM mensagens m1
            WHERE atendente_numero = $1
            GROUP BY contato_numero
            ORDER BY ultima_mensagem DESC
        `;
        
        const result = await pool.query(query, [numero]);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar conversas:', error);
        
        // Retorna dados de exemplo quando não consegue conectar ao banco
        const dadosExemplo = [
            {
                contato_numero: '+5511888887777',
                total_mensagens: 12,
                ultima_mensagem: new Date().toISOString(),
                ultima_msg_texto: 'Obrigado pelo atendimento!'
            },
            {
                contato_numero: '+5511777776666',
                total_mensagens: 8,
                ultima_mensagem: new Date(Date.now() - 3600000).toISOString(),
                ultima_msg_texto: 'Quando posso fazer o pagamento?'
            },
            {
                contato_numero: '+5511666665555',
                total_mensagens: 5,
                ultima_mensagem: new Date(Date.now() - 7200000).toISOString(),
                ultima_msg_texto: 'Bom dia!'
            }
        ];
        
        console.log('💬 Retornando dados de exemplo para conversas');
        res.json(dadosExemplo);
    }
});

// GET /api/mensagens/:atendente/:contato - Retorna conversa entre atendente e contato
router.get('/mensagens/:atendente/:contato', async (req, res) => {
    try {
        const { atendente, contato } = req.params;
        
        const query = `
            SELECT 
                id,
                atendente_numero,
                contato_numero,
                mensagem,
                tipo,
                data_hora
            FROM mensagens 
            WHERE atendente_numero = $1 AND contato_numero = $2
            ORDER BY data_hora ASC
        `;
        
        const result = await pool.query(query, [atendente, contato]);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar mensagens:', error);
        
        // Recupera as variáveis do escopo
        const { atendente, contato } = req.params;
        
        // Retorna mensagens de exemplo quando não consegue conectar ao banco
        const dadosExemplo = [
            {
                id: 1,
                atendente_numero: atendente,
                contato_numero: contato,
                mensagem: 'Olá! Como posso te ajudar hoje?',
                tipo: 'enviado',
                data_hora: new Date(Date.now() - 3600000).toISOString()
            },
            {
                id: 2,
                atendente_numero: atendente,
                contato_numero: contato,
                mensagem: 'Preciso de informações sobre minha conta',
                tipo: 'recebido',
                data_hora: new Date(Date.now() - 3500000).toISOString()
            },
            {
                id: 3,
                atendente_numero: atendente,
                contato_numero: contato,
                mensagem: 'Claro! Vou verificar para você. Um momento...',
                tipo: 'enviado',
                data_hora: new Date(Date.now() - 3400000).toISOString()
            },
            {
                id: 4,
                atendente_numero: atendente,
                contato_numero: contato,
                mensagem: 'Encontrei suas informações. Sua conta está em dia!',
                tipo: 'enviado',
                data_hora: new Date(Date.now() - 3200000).toISOString()
            },
            {
                id: 5,
                atendente_numero: atendente,
                contato_numero: contato,
                mensagem: 'Perfeito! Obrigado pelo atendimento 😊',
                tipo: 'recebido',
                data_hora: new Date(Date.now() - 3000000).toISOString()
            }
        ];
        
        console.log('💬 Retornando mensagens de exemplo');
        res.json(dadosExemplo);
    }
});

// GET /api/estatisticas/:numero - Estatísticas do atendente
router.get('/estatisticas/:numero', async (req, res) => {
    try {
        const { numero } = req.params;
        
        const query = `
            SELECT 
                COUNT(*) as total_mensagens,
                COUNT(DISTINCT contato_numero) as total_contatos,
                COUNT(CASE WHEN tipo = 'enviado' THEN 1 END) as mensagens_enviadas,
                COUNT(CASE WHEN tipo = 'recebido' THEN 1 END) as mensagens_recebidas,
                DATE(MIN(data_hora)) as primeira_mensagem,
                DATE(MAX(data_hora)) as ultima_mensagem
            FROM mensagens 
            WHERE atendente_numero = $1
        `;
        
        const result = await pool.query(query, [numero]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;

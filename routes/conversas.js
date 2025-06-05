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
        res.status(500).json({ error: 'Erro interno do servidor' });
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
        res.status(500).json({ error: 'Erro interno do servidor' });
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
        res.status(500).json({ error: 'Erro interno do servidor' });
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

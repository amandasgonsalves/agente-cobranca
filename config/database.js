const { Pool } = require('pg');

// Configuração do banco de dados
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'agente_cobranca',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Teste de conexão
pool.on('connect', () => {
    console.log('✅ Conectado ao banco PostgreSQL');
});

pool.on('error', (err) => {
    console.error('❌ Erro na conexão com PostgreSQL:', err.message);
    console.log('⚠️  O servidor continuará funcionando com dados de exemplo');
});

module.exports = pool;
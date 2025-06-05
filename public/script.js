// Estado da aplicação
let currentAtendente = null;
let currentContato = null;
let atendentes = [];
let contatos = [];
let mensagens = [];

// URLs da API
const API_BASE = '/api';

// Elementos DOM
const elements = {
    welcomeScreen: document.getElementById('welcomeScreen'),
    contactsScreen: document.getElementById('contactsScreen'),
    chatScreen: document.getElementById('chatScreen'),
    atendentesList: document.getElementById('atendentesList'),
    contactsList: document.getElementById('contactsList'),
    chatMessages: document.getElementById('chatMessages'),
    atendenteNome: document.getElementById('atendenteNome'),
    atendenteNumero: document.getElementById('atendenteNumero'),
    contactName: document.getElementById('contactName'),
    contactNumber: document.getElementById('contactNumber'),
    searchAtendentes: document.getElementById('searchAtendentes'),
    searchContatos: document.getElementById('searchContatos'),
    totalAtendentes: document.getElementById('totalAtendentes'),
    totalConversas: document.getElementById('totalConversas')
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    carregarAtendentes();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    elements.searchAtendentes.addEventListener('input', filtrarAtendentes);
    elements.searchContatos.addEventListener('input', filtrarContatos);
}

// Funções de navegação
function mostrarTela(tela) {
    elements.welcomeScreen.classList.add('hidden');
    elements.contactsScreen.classList.add('hidden');
    elements.chatScreen.classList.add('hidden');
    
    tela.classList.remove('hidden');
}

function voltarParaInicio() {
    currentAtendente = null;
    currentContato = null;
    mostrarTela(elements.welcomeScreen);
    limparSelecaoAtendente();
}

function voltarParaContatos() {
    currentContato = null;
    mostrarTela(elements.contactsScreen);
}

// Carregamento de dados
async function carregarAtendentes() {
    try {
        showLoading(elements.atendentesList);
        
        const response = await fetch(`${API_BASE}/atendentes`);
        if (!response.ok) throw new Error('Erro ao carregar atendentes');
        
        atendentes = await response.json();
        renderizarAtendentes(atendentes);
        
        // Atualizar estatísticas
        elements.totalAtendentes.textContent = atendentes.length;
        
    } catch (error) {
        console.error('Erro:', error);
        showToast('Erro ao carregar atendentes', 'error');
        elements.atendentesList.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Erro ao carregar atendentes</p>
                <button onclick="carregarAtendentes()" class="retry-btn">Tentar novamente</button>
            </div>
        `;
    }
}

async function carregarContatos() {
    if (!currentAtendente) return;
    
    try {
        showLoading(elements.contactsList);
        
        const response = await fetch(`${API_BASE}/conversas/${encodeURIComponent(currentAtendente.numero)}`);
        if (!response.ok) throw new Error('Erro ao carregar contatos');
        
        contatos = await response.json();
        renderizarContatos(contatos);
        
        elements.totalConversas.textContent = contatos.length;
        
    } catch (error) {
        console.error('Erro:', error);
        showToast('Erro ao carregar contatos', 'error');
        elements.contactsList.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Erro ao carregar contatos</p>
                <button onclick="carregarContatos()" class="retry-btn">Tentar novamente</button>
            </div>
        `;
    }
}

async function carregarMensagens() {
    if (!currentAtendente || !currentContato) return;
    
    try {
        showLoading(elements.chatMessages);
        
        const response = await fetch(`${API_BASE}/mensagens/${encodeURIComponent(currentAtendente.numero)}/${encodeURIComponent(currentContato.contato_numero)}`);
        if (!response.ok) throw new Error('Erro ao carregar mensagens');
        
        mensagens = await response.json();
        renderizarMensagens(mensagens);
        
    } catch (error) {
        console.error('Erro:', error);
        showToast('Erro ao carregar mensagens', 'error');
        elements.chatMessages.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Erro ao carregar mensagens</p>
                <button onclick="carregarMensagens()" class="retry-btn">Tentar novamente</button>
            </div>
        `;
    }
}

// Renderização
function renderizarAtendentes(listaAtendentes) {
    if (listaAtendentes.length === 0) {
        elements.atendentesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-user-slash"></i>
                <p>Nenhum atendente encontrado</p>
            </div>
        `;
        return;
    }
    
    elements.atendentesList.innerHTML = listaAtendentes.map(atendente => `
        <div class="atendente-card" onclick="selecionarAtendente('${atendente.numero}')">
            <div class="atendente-avatar">
                <i class="fas fa-user-tie"></i>
            </div>
            <div class="atendente-info">
                <div class="atendente-name">${formatarNomeAtendente(atendente.numero)}</div>
                <div class="atendente-number">${formatarTelefone(atendente.numero)}</div>
                <div class="atendente-stats">
                    <span><i class="fas fa-comments"></i> ${atendente.total_mensagens} msgs</span>
                </div>
            </div>
        </div>
    `).join('');
}

function renderizarContatos(listaContatos) {
    if (listaContatos.length === 0) {
        elements.contactsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-comments"></i>
                <p>Nenhuma conversa encontrada</p>
            </div>
        `;
        return;
    }
    
    elements.contactsList.innerHTML = listaContatos.map(contato => `
        <div class="contact-card" onclick="selecionarContato('${contato.contato_numero}')">
            <div class="contact-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="contact-details">
                <div class="contact-name">${formatarNomeContato(contato.contato_numero)}</div>
                <div class="contact-number">${formatarTelefone(contato.contato_numero)}</div>
                <div class="last-message">${contato.ultima_msg_texto || 'Sem mensagens'}</div>
            </div>
            <div class="last-message-time">
                ${formatarDataHora(contato.ultima_mensagem)}
            </div>
        </div>
    `).join('');
}

function renderizarMensagens(listaMensagens) {
    if (listaMensagens.length === 0) {
        elements.chatMessages.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-comment-slash"></i>
                <p>Nenhuma mensagem encontrada</p>
            </div>
        `;
        return;
    }
    
    elements.chatMessages.innerHTML = listaMensagens.map(mensagem => `
        <div class="message ${mensagem.tipo === 'enviado' ? 'message-sent' : 'message-received'}">
            <div class="message-content">${escapeHtml(mensagem.mensagem)}</div>
            <div class="message-time">
                ${formatarHora(mensagem.data_hora)}
                ${mensagem.tipo === 'enviado' ? '<i class="fas fa-check-double"></i>' : ''}
            </div>
        </div>
    `).join('');
    
    // Scroll para o final
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

// Seleções
function selecionarAtendente(numero) {
    currentAtendente = atendentes.find(a => a.numero === numero);
    if (!currentAtendente) return;
    
    // Atualizar UI
    elements.atendenteNome.textContent = formatarNomeAtendente(currentAtendente.numero);
    elements.atendenteNumero.textContent = formatarTelefone(currentAtendente.numero);
    
    // Marcar como selecionado
    document.querySelectorAll('.atendente-card').forEach(card => {
        card.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    // Carregar contatos e mostrar tela
    carregarContatos();
    mostrarTela(elements.contactsScreen);
}

function selecionarContato(numero) {
    currentContato = contatos.find(c => c.contato_numero === numero);
    if (!currentContato) return;
    
    // Atualizar UI
    elements.contactName.textContent = formatarNomeContato(currentContato.contato_numero);
    elements.contactNumber.textContent = formatarTelefone(currentContato.contato_numero);
    
    // Carregar mensagens e mostrar tela
    carregarMensagens();
    mostrarTela(elements.chatScreen);
}

function limparSelecaoAtendente() {
    document.querySelectorAll('.atendente-card').forEach(card => {
        card.classList.remove('active');
    });
}

// Filtros
function filtrarAtendentes() {
    const termo = elements.searchAtendentes.value.toLowerCase();
    const atendentesFiltrados = atendentes.filter(atendente => 
        atendente.numero.toLowerCase().includes(termo) ||
        formatarNomeAtendente(atendente.numero).toLowerCase().includes(termo)
    );
    renderizarAtendentes(atendentesFiltrados);
}

function filtrarContatos() {
    const termo = elements.searchContatos.value.toLowerCase();
    const contatosFiltrados = contatos.filter(contato => 
        contato.contato_numero.toLowerCase().includes(termo) ||
        formatarNomeContato(contato.contato_numero).toLowerCase().includes(termo) ||
        (contato.ultima_msg_texto && contato.ultima_msg_texto.toLowerCase().includes(termo))
    );
    renderizarContatos(contatosFiltrados);
}

// Utilitários
function formatarTelefone(numero) {
    if (!numero) return '';
    
    // Remove todos os caracteres não numéricos
    const apenasNumeros = numero.replace(/\D/g, '');
    
    // Se tem código do país (55)
    if (apenasNumeros.length === 13 && apenasNumeros.startsWith('55')) {
        const ddd = apenasNumeros.substring(2, 4);
        const tel = apenasNumeros.substring(4);
        return `+55 (${ddd}) ${tel.substring(0, 5)}-${tel.substring(5)}`;
    }
    
    // Se tem DDD
    if (apenasNumeros.length === 11) {
        const ddd = apenasNumeros.substring(0, 2);
        const tel = apenasNumeros.substring(2);
        return `(${ddd}) ${tel.substring(0, 5)}-${tel.substring(5)}`;
    }
    
    return numero;
}

function formatarNomeAtendente(numero) {
    if (!numero) return 'Atendente';
    
    const ultimosDigitos = numero.replace(/\D/g, '').slice(-4);
    return `Atendente ${ultimosDigitos}`;
}

function formatarNomeContato(numero) {
    if (!numero) return 'Contato';
    
    const ultimosDigitos = numero.replace(/\D/g, '').slice(-4);
    return `Contato ${ultimosDigitos}`;
}

function formatarDataHora(dataHora) {
    if (!dataHora) return '';
    
    const data = new Date(dataHora);
    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(hoje.getDate() - 1);
    
    if (data.toDateString() === hoje.toDateString()) {
        return formatarHora(dataHora);
    } else if (data.toDateString() === ontem.toDateString()) {
        return 'Ontem';
    } else {
        return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    }
}

function formatarHora(dataHora) {
    if (!dataHora) return '';
    
    const data = new Date(dataHora);
    return data.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

function escapeHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

function showLoading(elemento) {
    elemento.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <span>Carregando...</span>
        </div>
    `;
}

function showToast(mensagem, tipo = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    toast.textContent = mensagem;
    
    const container = document.getElementById('toastContainer');
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Atualização automática (opcional)
function iniciarAtualizacaoAutomatica() {
    setInterval(() => {
        if (currentAtendente && currentContato) {
            carregarMensagens();
        }
    }, 30000); // A cada 30 segundos
}

// Atalhos de teclado
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (elements.chatScreen.classList.contains('hidden') === false) {
            voltarParaContatos();
        } else if (elements.contactsScreen.classList.contains('hidden') === false) {
            voltarParaInicio();
        }
    }
});

// Iniciar atualização automática (descomente se necessário)
// iniciarAtualizacaoAutomatica();

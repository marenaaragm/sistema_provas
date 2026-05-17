/**
 * Lógica do Sistema de Provas - Aba Aluno
 */

// 1. Controle do Modal de Prova
const quizView = document.getElementById('quiz-view');
const qMainTitle = document.querySelector('.q-main');
const qDesc = document.querySelector('.q-desc');

/**
 * Abre o modal de prova com um efeito de carregamento simulado
 */
function abrirProva(categoria = "Avaliação Geral") {
    // Exibe o modal
    quizView.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Impede scroll ao fundo

    // Simula carregamento de dados
    qMainTitle.innerText = "Carregando...";
    qDesc.innerText = "Preparando o ambiente seguro de " + categoria + "...";

    setTimeout(() => {
        qMainTitle.innerText = "Simulado de " + categoria;
        qDesc.innerText = "Esta prova contém 10 questões. Você tem 60 minutos para concluir.";
    }, 1500);
}

/**
 * Fecha o modal de prova
 */
function fecharProva() {
    quizView.style.display = 'none';
    document.body.style.overflow = 'auto'; // Reativa o scroll
}

// 2. Navegação Dinâmica
const navLinks = document.querySelectorAll('.nav-links span');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Remove classe active de todos
        navLinks.forEach(l => l.classList.remove('active'));
        // Adiciona ao clicado
        link.classList.add('active');
        
        // Logica simples de scroll ou feedback
        console.log(`Navegando para: ${link.innerText}`);
    });
});

// 3. Efeito de Scroll na Navbar
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.style.background = 'rgba(0, 0, 0, 0.95)';
        nav.style.borderBottom = '1px solid var(--primary-purple)';
    } else {
        nav.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, transparent 100%)';
        nav.style.borderBottom = 'none';
    }
});

// 4. Interatividade nos Cards de Categoria
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', function() {
        const titulo = this.querySelector('.card-title').innerText;
        abrirProva(titulo);
    });
});
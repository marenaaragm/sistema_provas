const API_BASE_URL = 'http://127.0.0.1:5500';
let contadorQuestao = 0;

document.addEventListener('DOMContentLoaded', function() {
    // Data padrão (próxima semana)
    document.getElementById('data').valueAsDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    // Adiciona primeira questão
    adicionarQuestao();
    
    // Listeners
    setupListeners();

    // Tenta buscar questões do backend
    carregarQuestoes();
});

async function carregarQuestoes() {
    const statusEl = document.getElementById('apiStatus');

    if (statusEl) {
        statusEl.textContent = 'Buscando questões do backend...';
    }

    try {
        const res = await fetch(`${API_BASE_URL}/questoes`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error(`HTTP ${res.status} - ${res.statusText}`);
        }

        const payload = await res.json();

        if (!payload.success) {
            throw new Error(payload.message || 'Resposta inválida do backend');
        }

        console.log('✅ /questoes retornou:', payload.data);

        if (statusEl) {
            statusEl.textContent = `Questões carregadas: ${Array.isArray(payload.data) ? payload.data.length : 0}`;
        }
    } catch (error) {
        console.error('Erro ao consumir /questoes:', error);
        if (statusEl) {
            statusEl.textContent = `Falha ao carregar questões: ${error.message}`;
        }
    }
}

function adicionarQuestao() {
    contadorQuestao++;
    const container = document.getElementById('questoesContainer');
    
    const questaoDiv = document.createElement('div');
    questaoDiv.className = 'questao-card';
    questaoDiv.innerHTML = `
        <button class="btn-remover" type="button">×</button>
        
        <div class="questao-header">
            <div class="numero-questao">Questão ${contadorQuestao}</div>
            <div class="tipo-selector">
                <button type="button" class="btn-tipo active" data-questao="${contadorQuestao}" data-tipo="fechada">
                    📝 Fechada
                </button>
                <button type="button" class="btn-tipo" data-questao="${contadorQuestao}" data-tipo="aberta">
                    ✍️ Aberta
                </button>
            </div>
        </div>
        
        <input type="hidden" name="questoes[${contadorQuestao-1}][tipo]" class="questao-tipo" value="fechada">
        
        <div class="form-group">
            <label>❓ Enunciado *</label>
            <textarea name="questoes[${contadorQuestao-1}][enunciado]" required 
                      placeholder="Digite a questão aqui..."></textarea>
        </div>
        
        <div class="form-group">
            <label>✅ Alternativas (apenas para questões fechadas)</label>
            <div class="alternativas">
                <div class="alternativa">
                    <input type="radio" name="questoes[${contadorQuestao-1}][correta]" value="A">
                    <label><strong>A)</strong> 
                        <input type="text" name="questoes[${contadorQuestao-1}][A]" placeholder="Resposta A">
                    </label>
                </div>
                <div class="alternativa">
                    <input type="radio" name="questoes[${contadorQuestao-1}][correta]" value="B">
                    <label><strong>B)</strong> 
                        <input type="text" name="questoes[${contadorQuestao-1}][B]" placeholder="Resposta B">
                    </label>
                </div>
                <div class="alternativa">
                    <input type="radio" name="questoes[${contadorQuestao-1}][correta]" value="C">
                    <label><strong>C)</strong> 
                        <input type="text" name="questoes[${contadorQuestao-1}][C]" placeholder="Resposta C">
                    </label>
                </div>
                <div class="alternativa">
                    <input type="radio" name="questoes[${contadorQuestao-1}][correta]" value="D">
                    <label><strong>D)</strong> 
                        <input type="text" name="questoes[${contadorQuestao-1}][D]" placeholder="Resposta D">
                    </label>
                </div>
            </div>
        </div>
    `;
    
    container.appendChild(questaoDiv);
    
    // Adiciona listeners para esta nova questão
    setupQuestaoListeners(questaoDiv);
    
    // Scroll suave
    questaoDiv.scrollIntoView({ behavior: 'smooth' });
}

function setupQuestaoListeners(questaoDiv) {
    // Botão remover
    const btnRemover = questaoDiv.querySelector('.btn-remover');
    btnRemover.addEventListener('click', function() {
        questaoDiv.remove();
    });
    
    // Botões tipo
    const btnTipos = questaoDiv.querySelectorAll('.btn-tipo');
    btnTipos.forEach(btn => {
        btn.addEventListener('click', function() {
            toggleTipoQuestao(this);
        });
    });
}

function setupListeners() {
    // Form submit
    document.getElementById('provaForm').addEventListener('submit', function(e) {
        e.preventDefault();
        salvarProva();
    });
    
    // Botão limpar
    document.querySelector('.btn-secondary').addEventListener('click', limparTudo);
}

function toggleTipoQuestao(btnClicado) {
    const questaoNum = btnClicado.dataset.questao;
    const questaoDiv = btnClicado.closest('.questao-card');
    
    // Atualiza botões visuais
    questaoDiv.querySelectorAll('.btn-tipo').forEach(btn => {
        btn.classList.remove('active');
    });
    btnClicado.classList.add('active');
    
    // Atualiza hidden input
    const hiddenTipo = questaoDiv.querySelector('.questao-tipo');
    hiddenTipo.value = btnClicado.dataset.tipo;
    
    // Mostra/esconde alternativas
    const alternativas = questaoDiv.querySelector('.alternativas');
    if (btnClicado.dataset.tipo === 'aberta') {
        alternativas.classList.add('oculta');
        alternativas.querySelectorAll('input').forEach(input => {
            input.removeAttribute('required');
        });
    } else {
        alternativas.classList.remove('oculta');
        const radio = alternativas.querySelector('input[type="radio"]');
        radio.setAttribute('required', true);
    }
}

function salvarProva() {
    const formData = new FormData(document.getElementById('provaForm'));
    const provaData = Object.fromEntries(formData);
    
    // Validações
    if (!provaData.materia?.trim()) {
        alert('❌ Preencha a matéria');
        return;
    }
    
    if (!document.querySelector('.questao-card')) {
        alert('❌ Adicione pelo menos 1 questão');
        return;
    }
    
    console.clear();
    console.log('🎉 PROVA PRONTA PARA SUPABASE:');
    console.table(provaData);
    
    // Aqui você conecta com Supabase:
    /*
    const { data, error } = await supabase
        .from('provas')
        .insert([provaData])
        .select();
    */
    
    // Feedback visual
    const success = document.getElementById('successMessage');
    success.innerHTML = `
        🎉 <strong>Prova salva!</strong><br>
        <small>${provaData.questoes?.length || 0} questões • ${provaData.materia}</small>
    `;
    success.style.display = 'block';
    success.scrollIntoView({ behavior: 'smooth' });
    
    // Limpa form (opcional)
    // limparTudo();
    
    setTimeout(() => {
        success.style.display = 'none';
    }, 4000);
}

function limparTudo() {
    if (confirm('Limpar todas as questões?')) {
        document.getElementById('questoesContainer').innerHTML = '';
        document.getElementById('provaForm').reset();
        contadorQuestao = 0;
        document.getElementById('data').valueAsDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        adicionarQuestao();
    }
} 

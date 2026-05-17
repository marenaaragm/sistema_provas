// Inicializa o cliente do Supabase
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'  

const supabaseUrl = 'https://knyafharcqxnkbfloyxm.supabase.co'
const supabaseKey = 'sb_publishable_jB9rlWv-EOIKH5aOXLKREw_HIjDCsqx'


const supabase = createClient(supabaseUrl, supabaseKey);

console.log('✅ Supabase carregado!');

// Aguarda o formulário de login carregar na página
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona o formulário
    const form = document.querySelector('form');
    
    if (!form) {
        console.error('❌ Formulário não encontrado no HTML!');
        return;
    }

    console.log('✅ Formulário encontrado!');

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Impede o recarregamento da página

        // Pega o valor digitado no input de email
        const emailInput = document.querySelector('#email');
        const email = emailInput.value.trim();
        
        // Validação simples de campo vazio
        if (!email) {
            alert('Por favor, digite seu email!');
            return;
        }

        console.log('🔄 Verificando credenciais para:', email);

        try {
            // .maybeSingle() resolve o erro 406 caso o email não exista no banco
            const { data, error } = await supabase
                .from('usuarios')
                .select('email, tipo') 
                .eq('email', email)
                .maybeSingle(); 

            // Se houver erro de RLS ou conexão com o banco
            if (error) {
                console.error('❌ Erro retornado pelo Supabase:', error.message);
                alert('Erro de comunicação com o banco de dados. Verifique suas políticas de RLS.');
                return;
            }

            // Se o e-mail não existir na tabela
            if (!data) {
                console.warn('🚫 Email não encontrado no banco de dados.');
                alert('Email não cadastrado!');
                return;
            }

            // Exibe os dados no console do seu navegador para conferência
            console.log('🔍 Dados retornados do banco:', data);

            // --- NOVA LÓGICA DE REDIRECIONAMENTO POR TIPO ---
            
            if (data.tipo === 'Professor(a)') {
                console.log('✅ Professor autenticado com sucesso!');
                alert('Acesso liberado, Professor! Redirecionando...');
                
                // Exibe o iframe se ele existir (opcional)
                const iframe = document.querySelector('#avaliacaoFrame');
                if (iframe) iframe.style.display = 'block';

                window.location.href = 'prova.html';

            } else if (data.tipo === 'Aluno(a)') {
                console.log('✅ Aluno autenticado com sucesso!');
                alert('Acesso liberado, Aluno! Redirecionando para a área do aluno...');
                
                // Redireciona para a página do aluno (ajuste o nome do arquivo se necessário)
                window.location.href = 'aluno.html';

            } else {
                // Caso exista outro tipo de usuário no banco que não seja nenhum dos dois
                console.warn(`🚫 Tipo de usuário desconhecido: "${data.tipo}"`);
                alert('Tipo de usuário não reconhecido pelo sistema.');
            }

        } catch (err) {
            console.error('Erro inesperado no sistema:', err);
            alert('Erro interno no sistema!');
        }
    });
});
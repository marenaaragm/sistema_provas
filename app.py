from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client, Client

app = Flask(__name__)
CORS(app) # Isso permite que seu front-end converse com o back-end sem erros

# Suas credenciais do Supabase
SUPABASE_URL = "https://knyafharcqxnkbfloyxm.supabase.co"
SUPABASE_KEY = "sb_publishable_jB9rlWv-EOIKH5aOXLKREw_HIjDCsqx"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# --- ROTA DE LOGIN (MANTIDA IGUAL) ---
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')

    try:
        # Tenta autenticar usando o sistema de Auth do Supabase
        auth_response = supabase.auth.sign_in_with_password({
            "email": email,
        
        })
        
        return jsonify({
            "success": True, 
            "message": "Login realizado com sucesso! 🎉"
        }), 200

    except Exception as e:
        return jsonify({
            "success": False, 
            "message": "Credenciais inválidas."
        }), 401

# --- NOVA ROTA DE QUESTÕES (ADICIONADA) ---
@app.route('/questoes', methods=['GET'])
def get_questoes():
    try:
        # Busca todos os dados da tabela 'questoes'
        response = supabase.table('questoes').select("*").execute()

        if hasattr(response, 'error') and response.error:
            return jsonify({
                "success": False,
                "message": str(response.error)
            }), getattr(response, 'status_code', 500)
        
        return jsonify({
            "success": True,
            "data": response.data
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Erro ao buscar questões: {str(e)}"
        }), 500

# --- NOVA ROTA: BLOQUEAR USUÁRIO POR TROCA DE ABA ---
@app.route('/bloquear-usuario', methods=['POST'])
def bloquear_usuario():
    data = request.json
    email = data.get('email') # Identificamos o aluno pelo email

    try:
        # Atualiza a tabela 'usuarios' ou 'status_prova' 
        # Supondo que você tenha uma coluna 'status' na tabela 'perfil_alunos'
        response = supabase.table('alunos').update({
            "status": "bloqueado",
            "motivo": "Troca de aba detectada"
        }).eq("email", email).execute()
        
        return jsonify({
            "success": True,
            "message": "Usuário bloqueado por violação das regras."
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Erro ao processar bloqueio: {str(e)}"
        }), 500

if __name__ == '__main__':
    # Mantendo a porta 5500 que você definiu
    app.run(debug=True, port=5500) 
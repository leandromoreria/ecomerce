from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import mysql.connector
import requests
from bcrypt import hashpw, gensalt, checkpw
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)  # Habilita o CORS para todas as origens

# Mock de banco de dados
users = {}

# Função para conectar ao banco de dados
def conectar_db():
    try:
        return mysql.connector.connect(
            host="localhost",
            user="root",  # Substitua pelo usuário do MySQL
            password="Leandro#fxx3207",  # Substitua pela senha do MySQL
            database="ecommerce"  # Nome do banco de dados
        )
    except mysql.connector.Error as err:
        raise Exception(f"Erro ao conectar ao banco de dados: {str(err)}")

# Endpoint para cadastro do cliente
@app.route('/api/cadastro', methods=['POST'])
def cadastrar_cliente():
    try:
        dados = request.get_json()

        # Extraindo os dados enviados pelo formulário
        firstname = dados.get('firstname')
        number = dados.get('number')
        email = dados.get('email')
        password = dados.get('password')

        # Validações simples
        if not all([firstname, number, email, password]):
            return jsonify({"success": False, "message": "Todos os campos são obrigatórios."}), 400

        # Hash da senha
        senha_hashed = hashpw(password.encode('utf-8'), gensalt()).decode('utf-8')

        # Conexão com o banco de dados
        conn = conectar_db()
        cursor = conn.cursor()

        # Inserção dos dados
        cursor.execute("""
            INSERT INTO clientes (firstname, number, email, senha)
            VALUES (%s, %s, %s, %s)
        """, (firstname, number, email, senha_hashed))
        conn.commit()

        return jsonify({"success": True, "message": "Cliente cadastrado com sucesso."}), 201
    except Exception as e:
        return jsonify({"success": False, "message": f"Erro ao cadastrar cliente: {str(e)}"}), 500
    finally:
        if 'conn' in locals() and conn.is_connected():
            conn.close()

# Endpoint para login
@app.route('/api/cadastro', methods=['POST'])
def cadastro():
    data = request.json
    email = data.get('email')
    if email in users:
        return jsonify({'success': False, 'message': 'Usuário já cadastrado.'}), 400

    users[email] = {
        'name': data.get('firstname'),
        'password': generate_password_hash(data.get('password'))
    }
    return jsonify({'success': True}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('username')
    password = data.get('password')

    user = users.get(email)
    if not user or not check_password_hash(user['password'], password):
        return jsonify({'success': False, 'message': 'Credenciais inválidas.'}), 401

    return jsonify({'success': True, 'name': user['name']}), 200

if __name__ == '__main__':
    app.run(debug=True)

@app.route('/api/redefinir-senha', methods=['POST'])
def redefinir_senha():
    try:
        dados = request.get_json()
        email = dados.get('email')
        nova_senha = dados.get('nova_senha')

        if not email or not nova_senha:
            return jsonify({"error": "Email e nova senha são obrigatórios!"}), 400

        conn = conectar_db()
        cursor = conn.cursor()

        # Verificar se o email existe no banco
        cursor.execute("SELECT id FROM usuarios WHERE email = %s", (email,))
        usuario = cursor.fetchone()

        if usuario:
            nova_senha_hashed = hashpw(nova_senha.encode('utf-8'), gensalt()).decode('utf-8')
            cursor.execute("""
                UPDATE usuarios
                SET senha = %s
                WHERE id = %s
            """, (nova_senha_hashed, usuario['id']))
            conn.commit()

            return jsonify({"message": "Senha redefinida com sucesso!"}), 200
        else:
            return jsonify({"error": "Email não encontrado!"}), 404

    except Exception as err:
        return jsonify({"error": f"Erro ao redefinir a senha: {str(err)}"}), 500
    finally:
        if 'conn' in locals() and conn.is_connected():
            conn.close()

# Endpoint para gerenciar o carrinho de compras
@app.route('/api/carrinho', methods=['POST'])
def add_to_carrinho():
    try:
        dados = request.get_json()
        cliente_id = dados.get('cliente_id')
        produtos = dados.get('produtos')  # Lista de produtos

        if not cliente_id or not produtos:
            return jsonify({"error": "Cliente e produtos são obrigatórios!"}), 400

        conn = conectar_db()
        cursor = conn.cursor()

        for produto in produtos:
            cursor.execute("""
                INSERT INTO carrinho (cliente_id, produto_id, quantidade, preco)
                VALUES (%s, %s, %s, %s)
            """, (cliente_id, produto['id'], produto['quantidade'], produto['preco']))

        conn.commit()
        return jsonify({"message": "Produtos adicionados ao carrinho!"}), 201
    except Exception as err:
        return jsonify({"error": f"Erro ao adicionar ao carrinho: {str(err)}"}), 500
    finally:
        if 'conn' in locals() and conn.is_connected():
            conn.close()

# Função para calcular o frete utilizando a API dos Correios
def calcular_frete(cep_origem, cep_destino, peso, volume):
    try:
        # Configuração dos parâmetros da consulta de frete
        url = "https://api.correios.com.br/frete/calcular"
        params = {
            'cep_origem': cep_origem,
            'cep_destino': cep_destino,
            'peso': peso,
            'volume': volume
        }

        # Chama a API dos Correios para calcular o frete
        response = requests.get(url, params=params)
        response_data = response.json()

        if response.status_code == 200:
            return response_data
        else:
            raise Exception(f"Erro ao calcular o frete: {response_data['erro']}")
    except Exception as e:
        raise Exception(f"Erro na integração com os Correios: {str(e)}")

# Endpoint para calcular frete
@app.route('/api/frete', methods=['POST'])
def calcular_frete_endpoint():
    try:
        dados = request.get_json()
        cep_origem = dados.get('cep_origem')
        cep_destino = dados.get('cep_destino')
        peso = dados.get('peso')
        volume = dados.get('volume')

        if not all([cep_origem, cep_destino, peso, volume]):
            return jsonify({"error": "Todos os campos são obrigatórios!"}), 400

        # Chama a função para calcular o frete
        frete = calcular_frete(cep_origem, cep_destino, peso, volume)
        
        return jsonify({"message": "Frete calculado com sucesso!", "frete": frete}), 200
    except Exception as err:
        return jsonify({"error": f"Erro ao calcular o frete: {str(err)}"}), 500

# Função para rastrear o pedido usando o código de rastreamento
def rastrear_pedido(codigo_rastreamento):
    try:
        # URL de rastreamento dos Correios
        url = f"https://api.correios.com.br/rastreamento/{codigo_rastreamento}"

        # Consulta o status do pedido na API dos Correios
        response = requests.get(url)
        response_data = response.json()

        if response.status_code == 200:
            return response_data
        else:
            raise Exception(f"Erro ao rastrear o pedido: {response_data['erro']}")
    except Exception as e:
        raise Exception(f"Erro na integração com os Correios: {str(e)}")

# Endpoint para rastrear o pedido
@app.route('/api/rastrear', methods=['POST'])
def rastrear_pedido_endpoint():
    try:
        dados = request.get_json()
        codigo_rastreamento = dados.get('codigo_rastreamento')

        if not codigo_rastreamento:
            return jsonify({"error": "Código de rastreamento é obrigatório!"}), 400

        # Chama a função para rastrear o pedido
        status_pedido = rastrear_pedido(codigo_rastreamento)
        
        return jsonify({"message": "Rastreamento realizado com sucesso!", "status": status_pedido}), 200
    except Exception as err:
        return jsonify({"error": f"Erro ao rastrear o pedido: {str(err)}"}), 500

# Endpoint para aplicar cupom de desconto
@app.route('/api/cupom', methods=['POST'])
def aplicar_cupom():
    try:
        dados = request.get_json()
        cupom = dados.get('cupom')

        if not cupom:
            return jsonify({"error": "O código do cupom é obrigatório!"}), 400

        conn = conectar_db()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT desconto FROM cupons WHERE codigo = %s", (cupom,))
        cupom_data = cursor.fetchone()

        if cupom_data:
            return jsonify({"message": "Cupom aplicado!", "desconto": cupom_data['desconto']}), 200
        else:
            return jsonify({"error": "Cupom inválido!"}), 404
    except Exception as err:
        return jsonify({"error": f"Erro ao aplicar cupom: {str(err)}"}), 500
    finally:
        if 'conn' in locals() and conn.is_connected():
            conn.close()

# Endpoint para checkout
@app.route('/api/checkout', methods=['POST'])
def checkout():
    try:
        dados = request.get_json()
        cliente_id = dados.get('cliente_id')
        endereco = dados.get('endereco')
        pagamento = dados.get('pagamento')

        if not cliente_id or not endereco or not pagamento:
            return jsonify({"error": "Todos os campos são obrigatórios!"}), 400

        conn = conectar_db()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO pedidos (cliente_id, endereco, pagamento)
            VALUES (%s, %s, %s)
        """, (cliente_id, endereco, pagamento))
        pedido_id = cursor.lastrowid

        cursor.execute("""
            INSERT INTO produtos_pedido (pedido_id, produto_id, quantidade)
            SELECT %s, produto_id, quantidade FROM carrinho WHERE cliente_id = %s
        """, (pedido_id, cliente_id))

        cursor.execute("DELETE FROM carrinho WHERE cliente_id = %s", (cliente_id,))
        conn.commit()

        return jsonify({"message": "Checkout realizado com sucesso!"}), 201
    except Exception as err:
        return jsonify({"error": f"Erro no checkout: {str(err)}"}), 500
    finally:
        if 'conn' in locals() and conn.is_connected():
            conn.close()

if __name__ == '__main__':
    app.run(debug=True)


from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import mysql.connector
from bcrypt import hashpw, gensalt, checkpw

app = Flask(__name__)
CORS(app)  # Habilita o CORS para todas as origens

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
@app.route('/api/login', methods=['POST'])
def login():
    try:
        dados = request.get_json()
        email = dados.get('email')
        senha = dados.get('senha')

        if not email or not senha:
            return jsonify({"error": "Email e senha são obrigatórios!"}), 400

        conn = conectar_db()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, nome, senha FROM usuarios WHERE email = %s", (email,))
        usuario = cursor.fetchone()

        if usuario and checkpw(senha.encode('utf-8'), usuario['senha'].encode('utf-8')):
            # Login bem-sucedido
            return jsonify({
                "message": "Login bem-sucedido!",
                "cliente": usuario,
                "autenticado": True
            }), 200
        else:
            return jsonify({"error": "Email ou senha incorretos!"}), 401
    except Exception as err:
        return jsonify({"error": f"Erro ao fazer login: {str(err)}"}), 500
    finally:
        if 'conn' in locals() and conn.is_connected():
            conn.close()

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

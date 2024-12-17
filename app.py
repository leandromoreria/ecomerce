from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import mysql.connector
from bcrypt import hashpw, gensalt, checkpw
from database import conectar  # Certifique-se de que você está importando a função correta

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

# Endpoint para obter todos os usuários
@app.route('/usuarios', methods=['GET'])
def get_usuarios():
    try:
        conn = conectar()  # Usando a função importar de database.py
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, nome, email FROM usuarios")
        usuarios = cursor.fetchall()
        return jsonify(usuarios), 200
    except Exception as err:
        return jsonify({"error": f"Erro ao buscar usuários: {str(err)}"}), 500
    finally:
        if 'conn' in locals() and conn.is_connected():
            conn.close()

# Endpoint para adicionar um novo usuário
@app.route('/usuarios', methods=['POST'])
def add_usuario():
    try:
        dados = request.get_json()
        nome = dados.get('nome')
        email = dados.get('email')
        senha = dados.get('senha')

        if not nome or not email or not senha:
            return jsonify({"error": "Todos os campos (nome, email, senha) são obrigatórios!"}), 400

        senha_hashed = hashpw(senha.encode('utf-8'), gensalt()).decode('utf-8')

        conn = conectar()  # Usando a função importar de database.py
        cursor = conn.cursor()
        cursor.execute("INSERT INTO usuarios (nome, email, senha) VALUES (%s, %s, %s)", (nome, email, senha_hashed))
        conn.commit()

        return jsonify({"message": "Usuário adicionado com sucesso!"}), 201
    except Exception as err:
        return jsonify({"error": f"Erro ao adicionar usuário: {str(err)}"}), 500
    finally:
        if 'conn' in locals() and conn.is_connected():
            conn.close()

# Endpoint para atualizar um usuário
@app.route('/usuarios/<int:id>', methods=['PUT'])
def update_usuario(id):
    try:
        dados = request.get_json()
        nome = dados.get('nome')
        email = dados.get('email')
        senha = dados.get('senha')

        # Validações
        if not nome or not email or not senha:
            return jsonify({"error": "Todos os campos (nome, email, senha) são obrigatórios!"}), 400

        # Hash da nova senha
        senha_hashed = hashpw(senha.encode('utf-8'), gensalt()).decode('utf-8')

        conn = conectar()  # Usando a função importar de database.py
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE usuarios
            SET nome = %s, email = %s, senha = %s
            WHERE id = %s
        """, (nome, email, senha_hashed, id))
        conn.commit()

        if cursor.rowcount == 0:
            return jsonify({"error": "Usuário não encontrado!"}), 404

        return jsonify({"message": "Usuário atualizado com sucesso!"}), 200
    except mysql.connector.Error as err:
        return jsonify({"error": f"Erro ao atualizar usuário: {str(err)}"}), 500
    finally:
        if 'conn' in locals():
            conn.close()

# Endpoint para excluir um usuário
@app.route('/usuarios/<int:id>', methods=['DELETE'])
def delete_usuario(id):
    try:
        conn = conectar()  # Usando a função importar de database.py
        cursor = conn.cursor()
        cursor.execute("DELETE FROM usuarios WHERE id = %s", (id,))
        conn.commit()

        if cursor.rowcount == 0:
            return jsonify({"error": "Usuário não encontrado!"}), 404

        return jsonify({"message": "Usuário excluído com sucesso!"}), 200
    except mysql.connector.Error as err:
        return jsonify({"error": f"Erro ao excluir usuário: {str(err)}"}), 500
    finally:
        if 'conn' in locals():
            conn.close()

# Funcionalidades do carrinho
carrinho = []

@app.route('/api/carrinho', methods=['GET'])
def get_carrinho():
    return jsonify(carrinho), 200

@app.route('/api/carrinho', methods=['POST'])
def add_to_carrinho():
    item = request.json
    if not item.get('nome') or not item.get('preco') or not item.get('quantidade'):
        return jsonify({'error': 'Todos os campos (nome, preço, quantidade) são obrigatórios!'}), 400

    carrinho.append(item)
    return jsonify({'message': 'Item adicionado ao carrinho', 'carrinho': carrinho}), 201

@app.route('/api/carrinho/<int:index>', methods=['DELETE'])
def delete_item(index):
    if 0 <= index < len(carrinho):
        removido = carrinho.pop(index)
        return jsonify({'message': 'Item removido', 'item': removido, 'carrinho': carrinho}), 200
    return jsonify({'error': 'Índice inválido'}), 400

@app.route('/api/carrinho/total', methods=['GET'])
def get_total():
    total = sum(item['preco'] * item['quantidade'] for item in carrinho)
    return jsonify({'total': total}), 200

if __name__ == '__main__':
    app.run(debug=True)

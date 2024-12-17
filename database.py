import mysql.connector
from dotenv import load_dotenv
import os

# Carregar variáveis de ambiente do arquivo .env
load_dotenv()

def conectar():
    """
    Estabelece uma conexão com o banco de dados MySQL usando as variáveis do ambiente.
    """
    try:
        conn = mysql.connector.connect(
            host=os.getenv("DB_HOST", "localhost"),
            user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASSWORD", "senha"),
            database=os.getenv("DB_NAME", "ecommerce")
        )
        return conn
    except mysql.connector.Error as err:
        raise Exception(f"Erro ao conectar ao banco de dados: {str(err)}")


# Função para listar todos os usuários
def listar_usuarios():
    """
    Lista todos os usuários da tabela `usuarios`.
    """
    try:
        conn = conectar()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, nome, email FROM usuarios")
        usuarios = cursor.fetchall()
        return usuarios
    except mysql.connector.Error as err:
        raise Exception(f"Erro ao listar usuários: {str(err)}")
    finally:
        if 'conn' in locals() and conn.is_connected():
            conn.close()


# Função para inserir um novo usuário
def inserir_usuario(nome, email, senha):
    """
    Insere um novo usuário na tabela `usuarios`.

    :param nome: Nome do usuário
    :param email: Email do usuário
    :param senha: Senha do usuário (já com hash aplicado)
    """
    try:
        conn = conectar()
        cursor = conn.cursor()
        query = "INSERT INTO usuarios (nome, email, senha) VALUES (%s, %s, %s)"
        cursor.execute(query, (nome, email, senha))
        conn.commit()
    except mysql.connector.Error as err:
        raise Exception(f"Erro ao inserir usuário: {str(err)}")
    finally:
        if 'conn' in locals() and conn.is_connected():
            conn.close()


# Função para atualizar os dados de um usuário
def atualizar_usuario(id, novo_nome, novo_email, nova_senha):
    """
    Atualiza os dados de um usuário existente na tabela `usuarios`.

    :param id: ID do usuário a ser atualizado
    :param novo_nome: Novo nome do usuário
    :param novo_email: Novo email do usuário
    :param nova_senha: Nova senha do usuário (com hash)
    """
    try:
        conn = conectar()
        cursor = conn.cursor()
        query = """
            UPDATE usuarios
            SET nome = %s, email = %s, senha = %s
            WHERE id = %s
        """
        cursor.execute(query, (novo_nome, novo_email, nova_senha, id))
        conn.commit()
    except mysql.connector.Error as err:
        raise Exception(f"Erro ao atualizar usuário: {str(err)}")
    finally:
        if 'conn' in locals() and conn.is_connected():
            conn.close()

# Função para excluir um usuário
def excluir_usuario(id):
    """
    Exclui um usuário da tabela `usuarios`.

    :param id: ID do usuário a ser excluído
    """
    try:
        conn = conectar()
        cursor = conn.cursor()
        query = "DELETE FROM usuarios WHERE id = %s"
        cursor.execute(query, (id,))
        conn.commit()
        if cursor.rowcount == 0:
            raise Exception("Usuário não encontrado para exclusão.")
    except mysql.connector.Error as err:
        raise Exception(f"Erro ao excluir usuário: {str(err)}")
    finally:
        if 'conn' in locals() and conn.is_connected():
            conn.close()

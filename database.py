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
            password=os.getenv("DB_PASSWORD", "Leandro#fxx3207"),
            database=os.getenv("DB_NAME", "ecommerce")
        )
        return conn
    except mysql.connector.Error as err:
        raise Exception(f"Erro ao conectar ao banco de dados: {str(err)}")


# Função para listar todos os clientes
def listar_clientes():
    """
    Lista todos os clientes da tabela `clientes`.
    """
    try:
        conn = conectar()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, firstname, email FROM clientes")
        clientes = cursor.fetchall()
        return clientes
    except mysql.connector.Error as err:
        raise Exception(f"Erro ao listar clientes: {str(err)}")
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()


# Função para inserir um novo cliente
def inserir_cliente(firstname, number, email, senha):
    """
    Insere um novo cliente na tabela `clientes`.

    :param firstname: Nome do cliente
    :param number: Número de telefone do cliente
    :param email: Email do cliente
    :param senha: Senha do cliente (já com hash aplicado)
    """
    try:
        conn = conectar()
        cursor = conn.cursor()
        query = "INSERT INTO clientes (firstname, number, email, senha) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (firstname, number, email, senha))
        conn.commit()
    except mysql.connector.Error as err:
        raise Exception(f"Erro ao inserir cliente: {str(err)}")
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()


# Função para atualizar os dados de um cliente
def atualizar_cliente(id, novo_firstname, novo_number, novo_email, nova_senha):
    """
    Atualiza os dados de um cliente existente na tabela `clientes`.

    :param id: ID do cliente a ser atualizado
    :param novo_firstname: Novo nome do cliente
    :param novo_number: Novo número de telefone do cliente
    :param novo_email: Novo email do cliente
    :param nova_senha: Nova senha do cliente (com hash)
    """
    try:
        conn = conectar()
        cursor = conn.cursor()
        query = """
            UPDATE clientes
            SET firstname = %s, number = %s, email = %s, senha = %s
            WHERE id = %s
        """
        cursor.execute(query, (novo_firstname, novo_number, novo_email, nova_senha, id))
        conn.commit()
    except mysql.connector.Error as err:
        raise Exception(f"Erro ao atualizar cliente: {str(err)}")
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()

# Função para excluir um cliente
def excluir_cliente(id):
    """
    Exclui um cliente da tabela `clientes`.

    :param id: ID do cliente a ser excluído
    """
    try:
        conn = conectar()
        cursor = conn.cursor()
        query = "DELETE FROM clientes WHERE id = %s"
        cursor.execute(query, (id,))
        conn.commit()
        if cursor.rowcount == 0:
            raise Exception("Cliente não encontrado para exclusão.")
    except mysql.connector.Error as err:
        raise Exception(f"Erro ao excluir cliente: {str(err)}")
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()

# Função para registrar um pedido
def registrar_pedido(cliente_id, endereco, pagamento, produtos):
    """
    Registra um pedido na tabela `pedidos` e insere os produtos na tabela `produtos_pedido`.

    :param cliente_id: ID do cliente
    :param endereco: Endereço de entrega
    :param pagamento: Método de pagamento
    :param produtos: Lista de produtos (dicionários com `id`, `quantidade`, `preco`)
    """
    try:
        conn = conectar()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO pedidos (cliente_id, endereco, pagamento)
            VALUES (%s, %s, %s)
        """, (cliente_id, endereco, pagamento))
        pedido_id = cursor.lastrowid

        for produto in produtos:
            cursor.execute("""
                INSERT INTO produtos_pedido (pedido_id, produto_id, quantidade, preco)
                VALUES (%s, %s, %s, %s)
            """, (pedido_id, produto['id'], produto['quantidade'], produto['preco']))

        conn.commit()
        return pedido_id
    except mysql.connector.Error as err:
        if 'conn' in locals() and conn.is_connected():
            conn.rollback()
        raise Exception(f"Erro ao registrar pedido: {str(err)}")
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()


# Função para rastrear um pedido
def rastrear_pedido(pedido_id):
    """
    Rastreia o status de um pedido com base no seu ID.

    :param pedido_id: ID do pedido
    :return: Status do pedido ou um erro caso não seja encontrado.
    """
    try:
        conn = conectar()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT status, codigo_rastreamento FROM pedidos WHERE id = %s", (pedido_id,))
        pedido = cursor.fetchone()

        if pedido:
            return {
                "status": pedido['status'],
                "codigo_rastreamento": pedido['codigo_rastreamento']
            }
        else:
            raise Exception("Pedido não encontrado.")
    except mysql.connector.Error as err:
        raise Exception(f"Erro ao rastrear pedido: {str(err)}")
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()
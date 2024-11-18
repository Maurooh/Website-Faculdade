const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());


const dbConfig = {
  user: process.env.DB_USER,        
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,      
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true,
    enableArithAbort: true,
  }
};

// Função para conectar ao banco de dados
async function connectToDatabase() {
  try {
    await sql.connect(dbConfig);
    console.log('Conexão ao banco de dados estabelecida com sucesso.');
  } catch (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    throw err;
  }
}

// Rota para a raiz
app.get('/', (req, res) => {
  res.send('API está funcionando!');
});

// Endpoint para buscar produtos
app.get('/api/produtos', async (req, res) => {
  try {
    await connectToDatabase();
    const result = await sql.query('SELECT * FROM Produto');
    res.json(result.recordset);  
  } catch (err) {
    console.error('Erro ao buscar produtos:', err);
    res.status(500).send('Erro ao buscar produtos');
  }
});

// Endpoint para finalizar a compra
app.post('/api/comprar', async (req, res) => {
  const { cartItems } = req.body;

  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ error: 'Carrinho vazio.' });
  }

  const transaction = new sql.Transaction();

  try {
    await connectToDatabase();
    
    await transaction.begin();
    const request = new sql.Request(transaction);

    for (const item of cartItems) {
      const { ID_produto, quantidade } = item;

      const result = await request.query(`SELECT qtd_disponivel FROM Produto WHERE ID_produto = ${ID_produto}`);
      const quantidadeAtual = result.recordset[0].qtd_disponivel; // Corrigido aqui

      if (quantidade > quantidadeAtual) {
        await transaction.rollback();
        return res.status(400).json({ error: `Quantidade insuficiente para o produto ID ${ID_produto}.` });
      }

      await request.query`UPDATE Produto SET qtd_disponivel = qtd_disponivel - ${item.quantidade} WHERE ID_produto = ${ID_produto}`;
    }

    await transaction.commit();
    res.status(200).json({ message: 'Compra realizada e estoque atualizado com sucesso.' });
  } catch (err) {
    console.error('Erro ao processar a compra:', err);
    try {
      await transaction.rollback();
    } catch (rollbackErr) {
      console.error('Erro ao reverter transação:', rollbackErr);
    }
    res.status(500).send('Erro ao processar a compra.');
  }
});

// Endpoint de login sem bcrypt
app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'Por favor, preencha todos os campos.' });
  }

  try {
    await connectToDatabase();
    
    const result = await sql.query`SELECT * FROM Cliente WHERE email = ${email}`;

    if (result.recordset.length === 0) {
      return res.status(400).json({ error: 'Usuário não encontrado.' });
    }

    const usuario = result.recordset[0];

    if (senha !== usuario.senha) {
      return res.status(400).json({ error: 'Senha incorreta.' });
    }

    res.status(200).json({ message: 'Login bem-sucedido.', nome: usuario.nome_cliente });
  } catch (err) {
    console.error('Erro ao fazer login:', err);
    res.status(500).json({ error: 'Erro ao fazer login.' });
  }
});

// Endpoint de cadastro sem bcrypt
app.post('/api/cadastro', async (req, res) => {
  const { nome_cliente, cpf, email, senha, endereco } = req.body;

  if (!nome_cliente || !cpf || !email || !senha || !endereco) {
    return res.status(400).json({ error: 'Por favor, preencha todos os campos.' });
  }

  try {
    await connectToDatabase();
    const request = new sql.Request();
    request.input('nome_cliente', sql.VarChar, nome_cliente);
    request.input('cpf', sql.VarChar, cpf);
    request.input('email', sql.VarChar, email);
    request.input('senha', sql.VarChar, senha);
    request.input('endereco', sql.VarChar, endereco);

    const result = await request.query(`
      INSERT INTO Cliente (nome_cliente, CPF, email, senha, endereco)
      VALUES (@nome_cliente, @cpf, @email, @senha, @endereco)
    `);

    console.log('Cliente cadastrado com sucesso:', result);
    res.status(201).json({ message: 'Cliente cadastrado com sucesso.' });
  } catch (err) {
    console.error('Erro ao cadastrar o cliente:', err);
    res.status(500).json({ error: 'Erro ao cadastrar o cliente.' });
  }
});

// Iniciando o servidor na porta 3000
const PORT = process.env.PORT || 3000; // Use a porta do ambiente ou a 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

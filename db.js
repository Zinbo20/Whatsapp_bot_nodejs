const mysql = require("mysql2/promise");

async function connect(){
    if(global.connection && global.connection.state !== 'disconnected')
        return global.connection;
 
    const connection = await mysql.createConnection({
        host     : '107.180.94.5',
        user     : 'theagenda_chatbot',
        password : 'mQ+LNwBHKZG',
        database : 'theagenda_chatbot',
        port     : '3306'
    });

    console.log("Conectou no MySQL!");
    global.connection = connection;
    return connection;
}

async function selectCustomers() {
    const client = await connect();
    const [rows] = await client.query('SELECT * FROM cadastros');
    return rows;
}

async function insertCustomer(customer){
    const client = await connect();
    const sql = 'INSERT INTO cadastros(nome,whatsapp,boas_vindas) VALUES (?,?,?);';
    const values = [customer.nome, customer.whatsapp, customer.boas_vindas];
    return await client.query(sql, values);
  }

async function updateCustomer(id, customer){
      const client = await connect();
      const sql = 'UPDATE cadastros SET nome=?, whatsapp=?, boas_vindas=? WHERE id=?';
      const values = [customer.nome, customer.whatsapp, customer.boas_vindas, id];
      return await client.query(sql, values);
  }

async function deleteCustomer(id){ 
    const client = await connect();
    const sql = 'DELETE FROM cadastros where id=?;';
    return await client.query(sql, [id]);
}

async function last_insert(){
    const client = await connect();
    const [rows] = await client.query('SELECT * FROM cadastros WHERE id = (SELECT MAX(id) FROM cadastros)');
    return rows[0];
}

async function find(id){ 
    const client = await connect();
    const sql = 'SELECT * FROM cadastros WHERE id = ?';
    const [rows] = await client.query(sql, [id]);
    return rows[0];
}

module.exports = {selectCustomers, insertCustomer, updateCustomer, deleteCustomer,last_insert,find}
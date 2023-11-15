const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(bodyParser.json());


const db = new sqlite3.Database(':memory:');
db.serialize(function() {
  db.run('CREATE TABLE transacciones (id INTEGER PRIMARY KEY, tipo TEXT, descripcion TEXT)');
});

app.get('/transacciones', (req, res) => {
  db.all('SELECT * FROM transacciones', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error al recuperar las transacciones' });
    }
    res.json(rows);
  });
});

app.post('/transacciones', (req, res) => {
  const nuevaTransaccion = req.body;
  if (!nuevaTransaccion.tipo || !nuevaTransaccion.descripcion) {
    return res.status(400).json({ error: 'Tipo y descripción son campos obligatorios' });
  }

  const stmt = db.prepare('INSERT INTO transacciones (tipo, descripcion) VALUES (?, ?)');
  stmt.run(nuevaTransaccion.tipo, nuevaTransaccion.descripcion);
  stmt.finalize();
  
  enviarCorreoElectronico(`Nueva transacción: ${nuevaTransaccion.tipo}`, nuevaTransaccion.descripcion);

  res.json({ mensaje: 'Transacción agregada con éxito' });
});


const puerto = 3000;
app.listen(puerto, () => {
  console.log(`Microservicio de control de transacciones en ejecución en el puerto ${puerto}`);
});
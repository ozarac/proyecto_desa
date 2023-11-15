
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const transactions = [];
const rawMaterials = [];
app.get('/transacciones', (req, res) => {
  res.json(transactions);
});

app.post('/transacciones', (req, res) => {
  const nuevaTransaccion = req.body;
  transactions.push(nuevaTransaccion);
  res.json({ mensaje: 'Transacción agregada con éxito' });
});

app.get('/materiaprima', (req, res) => {
  res.json(rawMaterials);
});

app.post('/materiaprima', (req, res) => {
  const nuevoMaterial = req.body;
  rawMaterials.push(nuevoMaterial);
  res.json({ mensaje: 'Material de materia prima agregado con éxito' });
});

const puerto = 3000;
app.listen(puerto, () => {
  console.log(`Microservicio en ejecución en el puerto ${puerto}`);
});
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuration MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: '',
  database: 'my_database', 
});

// Connecter à MySQL
db.connect(err => {
  if (err) {
    console.error('Erreur de connexion :', err);
    return;
  }
  console.log('Connecté à la base MySQL');
});

// Exemple de route
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

app.listen(3000, () => console.log('Serveur démarré sur le port 3000'));

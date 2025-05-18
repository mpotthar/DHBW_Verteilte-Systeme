const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors({
  origin: ['http://localhost:5501', 'http://127.0.0.1:5501'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

db.connect();

const carRoutes = require('./routes/car.routes');
app.use('/api/cars', carRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Willkommen beim Mietwagen-Service der Mein-Urlaub-App' });
});

app.listen(PORT, () => {
  console.log(`Mietwagen-Service läuft auf Port ${PORT}`);
});

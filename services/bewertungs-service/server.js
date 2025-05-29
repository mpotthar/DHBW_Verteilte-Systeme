const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(cors({
  origin: ['http://localhost', 'http://127.0.0.1', "http://mein-urlaub-nginx"],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Datenbank verbinden
db.connect();

// Routen
const reviewRoutes = require('./routes/review.routes');
app.use('/api/reviews', reviewRoutes);

// Basis-Route
app.get('/', (req, res) => {
  res.json({ message: 'Willkommen beim Bewertungs-Service der Mein-Urlaub-App' });
});

// Server starten
app.listen(PORT, () => {
  console.log(`Bewertungs-Service läuft auf Port ${PORT}`);
});

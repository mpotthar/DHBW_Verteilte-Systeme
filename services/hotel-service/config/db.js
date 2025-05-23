const mongoose = require('mongoose');

// MongoDB-Verbindung (lokal oder über MongoDB Atlas)
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel-service';

const connect = async () => {
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Mit MongoDB verbunden');
  } catch (error) {
    console.error('Fehler bei der MongoDB-Verbindung:', error);
    process.exit(1);
  }
};

module.exports = { connect };

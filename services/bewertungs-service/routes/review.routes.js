const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');

// GET /api/reviews - Alle Bewertungen abrufen
router.get('/', reviewController.getAllReviews);

// GET /api/reviews/product/:productId - Bewertungen nach Produkt-ID abrufen
router.get('/product/:productId', reviewController.getReviewsByProductId);

// GET /api/reviews/:id - Eine Bewertung abrufen
router.get('/:id', reviewController.getReviewById);

// POST /api/reviews - Neue Bewertung erstellen
router.post('/', reviewController.createReview);

// PUT /api/reviews/:id - Bewertung aktualisieren
router.put('/:id', reviewController.updateReview);

// DELETE /api/reviews/:id - Bewertung löschen
router.delete('/:id', reviewController.deleteReview);

module.exports = router;

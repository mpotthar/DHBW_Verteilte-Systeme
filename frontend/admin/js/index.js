// Basis-API-URL
const API_BASE_URL = '/api';
// Endpunkte
const endpoints = {
    hotels: 'hotels',
    flights: 'flights',
    cars: 'cars', // oder 'cars', je nach Backend
    reviews: 'reviews' // oder 'reviews'
};

// Funktion zum Laden der Einträge und Zählen
async function loadCount(id, endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`);
        if (!response.ok) throw new Error(`Fehler beim Laden (${endpoint})`);
        const data = await response.json();
        // Annahme: response ist ein Array der Einträge
        document.getElementById(id).textContent = data.length;
    } catch (error) {
        console.error(`Fehler beim Laden für ${id}:`, error);
        document.getElementById(id).textContent = 'Fehler';
    }
}

// Alle Zähler laden
function loadAllCounts() {
    loadCount('hotelsCount', endpoints.hotels);
    loadCount('flightsCount', endpoints.flights);
    loadCount('carsCount', endpoints.cars);
    loadCount('reviewsCount', endpoints.reviews);
}

// Initialisierung
document.addEventListener('DOMContentLoaded', loadAllCounts);

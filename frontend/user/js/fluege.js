const FLIGHTS_API_BASE_URL = '/api/flights';
const REVIEWS_API_BASE_URL = '/api/reviews';
let flightsData = [];
let currentFlight = null;
let flightModal;

// Event-Listener für DOMContentLoaded, um die Flüge zu laden und Filter zu initialisieren
document.addEventListener('DOMContentLoaded', () => {
    loadFlights();
    document.getElementById('flightFilter').addEventListener('keyup', filterFlights);
    document.getElementById('sortOrderFlights').addEventListener('change', filterFlights);
});

// Funktion zum Laden der Flüge von der API
async function loadFlights() {
    try {
        const response = await fetch(`${FLIGHTS_API_BASE_URL}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        flightsData = await response.json();
        filterFlights();
    } catch (error) {
        document.getElementById('flightCards').innerHTML =
            `<div class="col-12 text-center">
                <div class="alert alert-danger">
                    Fehler beim Laden der Flüge. Bitte versuchen Sie es später erneut.
                </div>
            </div>`;
    }
}

// Hilfsfunktion zum Erstellen der Sterne-Bewertung
function getStars(count) {
    let stars = '';
    for (let i = 0; i < count; i++) {
        stars += '<i class="bi bi-star-fill text-warning"></i> ';
    }
    for (let i = count; i < 5; i++) {
        stars += '<i class="bi bi-star text-warning"></i> ';
    }
    return stars;
}

// Funktion zum Ermitteln des Durchschnitts der Sterne-Bewertung
function getAverageRating(reviews) {
    if (!reviews || reviews.length === 0) return "0,0";
    const total = reviews.reduce((sum, review) => sum + review.sterne, 0);
    const avg = total / reviews.length;
    return avg.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

// Bewertungen für einen Flug abrufen
async function getFlightReviews(flight_id) {
    if (!flight_id) return [];
    try {
        const response = await fetch(`${REVIEWS_API_BASE_URL}/product/${flight_id}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Fehler beim Abrufen der Bewertungen:', error);
        return [];
    }
}

// Funktion zum Anzeigen der Flüge in Bootstrap-Cards
async function displayFlights(flights) {
    const container = document.getElementById('flightCards');
    if (!flights || flights.length === 0) {
        container.innerHTML = `<div class="col-12 text-center">
            <div class="alert alert-info">Keine Flüge gefunden.</div>
        </div>`;
        return;
    }
    container.innerHTML = '';
    for (const flight of flights) {
        // Bewertungen laden
        const reviews = await getFlightReviews(flight.id || flight._id);
        const avgRating = getAverageRating(reviews);

        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4 mb-4';
        col.innerHTML = `
            <div class="card h-100 position-relative">
                <div class="badge-price">${flight.preis} €</div>
                <div class="badge-rating">${avgRating} <i class="bi bi-star-fill"></i></div>
                <img src="img/flight.jpg" class="card-img-top" alt="Flug">
                <div class="card-body">
                    <h5 class="card-title">${flight.start} <i class="bi bi-arrow-right"></i> ${flight.ziel}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${flight.fluggesellschaft} (${flight.flugnummer})</h6>
                    <p class="mb-1"><strong>Abflug:</strong> ${formatDateTime(flight.abflug)}</p>
                    <p class="mb-1"><strong>Ankunft:</strong> ${formatDateTime(flight.ankunft)}</p>
                </div>
                <div class="card-footer bg-white border-top-0">
                    <button class="btn btn-outline-primary w-100" 
                            onclick='showFlightDetails(${JSON.stringify(flight)})'>
                        Details ansehen
                    </button>
                </div>
            </div>
        `;
        container.appendChild(col);
    }
}

// Formatierung von Datum und Uhrzeit
function formatDateTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Funktion zum Anzeigen der Flugdetails in einem Modal
async function showFlightDetails(flight) {
    // Prüfe, ob die ID existiert
    const flightId = flight.id || flight._id;
    if (!flightId) {
        alert('Fehler: Flug-ID nicht gefunden!');
        return;
    }
    currentFlight = { ...flight, id: flightId }; // Merke die ID explizit

    const modalBody = document.getElementById('flightModalBody');
    const modalTitle = document.getElementById('flightModalLabel');
    const reviews = await getFlightReviews(flightId);
    const avgRating = getAverageRating(reviews);

    modalTitle.textContent = `${flight.start} → ${flight.ziel}`;

    modalBody.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <img src="img/flight.jpg" class="img-fluid rounded" alt="Flug">
            </div>
            <div class="col-md-6">
                <h5>${flight.fluggesellschaft} (${flight.flugnummer})</h5>
                <p>${getStars(avgRating)} (${avgRating}/5)</p>
                <p><strong>Start:</strong> ${flight.start}</p>
                <p><strong>Ziel:</strong> ${flight.ziel}</p>
                <p><strong>Abflug:</strong> ${formatDateTime(flight.abflug)}</p>
                <p><strong>Ankunft:</strong> ${formatDateTime(flight.ankunft)}</p>
                <p><strong>Preis:</strong> ${flight.preis} €</p>
                <p><strong>Durchschnittliche Bewertung:</strong> ${avgRating} <i class="bi bi-star-fill text-warning"></i></p>
            </div>
        </div>
        <div class="mt-4">
            <h5>Bewertungen</h5>
            <div id="reviewsContainer">
                ${reviews.length > 0 ? 
                    reviews.map(review => `
                        <div class="card mb-3">
                            <div class="card-body">
                                <div class="d-flex justify-content-between">
                                    <h6 class="card-title">${review.titel}</h6>
                                    <div>${getStars(review.sterne)}</div>
                                </div>
                                <p class="card-text">${review.beschreibung}</p>
                                <p class="card-text"><small class="text-muted">
                                    Von ${review.nameRezensent} am ${review.datum ? new Date(review.datum).toLocaleDateString('de-DE') : ''}
                                </small></p>
                            </div>
                        </div>
                    `).join('') : 
                    '<p class="text-muted">Noch keine Bewertungen vorhanden</p>'}
            </div>
            <button id="addReviewBtn" class="btn btn-primary mt-2">Bewertung schreiben</button>
        </div>
        <div id="reviewFormContainer" style="display: none;" class="mt-4">
            <h5>Neue Bewertung</h5>
            <form id="reviewForm">
                <div class="mb-3">
                    <label class="form-label">Sterne:</label>
                    <div class="star-rating mb-2">
                        ${Array(5).fill().map((_, i) => 
                            `<span class="star" data-value="${i+1}" style="cursor: pointer; font-size: 1.5em;"></span>`
                        ).join('')}
                    </div>
                    <input type="hidden" id="sterne" name="sterne" required>
                </div>
                <div class="mb-3">
                    <label for="titel" class="form-label">Titel:</label>
                    <input type="text" class="form-control" id="titel" required>
                </div>
                <div class="mb-3">
                    <label for="beschreibung" class="form-label">Beschreibung:</label>
                    <textarea class="form-control" id="beschreibung" rows="3" required></textarea>
                </div>
                <div class="mb-3">
                    <label for="name" class="form-label">Ihr Name:</label>
                    <input type="text" class="form-control" id="name" required>
                </div>
                <button type="submit" class="btn btn-primary">Absenden</button>
                <button type="button" id="cancelReviewBtn" class="btn btn-secondary">Abbrechen</button>
            </form>
        </div>
    `;

    // Event-Listener für Bewertungsbutton
    document.getElementById('addReviewBtn').addEventListener('click', () => {
        document.getElementById('reviewsContainer').style.display = 'none';
        document.getElementById('addReviewBtn').style.display = 'none';
        document.getElementById('reviewFormContainer').style.display = 'block';
    });

    // Event-Listener für Abbrechen-Button
    document.getElementById('cancelReviewBtn').addEventListener('click', () => {
        document.getElementById('reviewFormContainer').style.display = 'none';
        document.getElementById('reviewsContainer').style.display = 'block';
        document.getElementById('addReviewBtn').style.display = 'block';
    });

    // Sterne-Bewertung mit Bootstrap Icons
    document.querySelectorAll('.star-rating .star').forEach((star, idx, allStars) => {
        // Initial: alle leer
        star.innerHTML = '<i class="bi bi-star text-warning"></i>';
        star.addEventListener('click', () => {
            document.getElementById('sterne').value = idx + 1;
            allStars.forEach((s, i) => {
                const icon = s.querySelector('i');
                if (i <= idx) {
                    icon.classList.remove('bi-star');
                    icon.classList.add('bi-star-fill');
                } else {
                    icon.classList.remove('bi-star-fill');
                    icon.classList.add('bi-star');
                }
            });
        });
    });

    // Bewertungsformular absenden
    document.getElementById('reviewForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!currentFlight || !currentFlight.id) {
            alert('Fehler: Flug-ID nicht verfügbar');
            return;
        }
        const reviewData = {
            productID: String(currentFlight.id),
            nameRezensent: document.getElementById('name').value.trim(),
            titel: document.getElementById('titel').value.trim(),
            beschreibung: document.getElementById('beschreibung').value.trim(),
            sterne: parseInt(document.getElementById('sterne').value, 10),
            dienstleistungsTyp: 'flug'
        };

        if (!reviewData.productID || !reviewData.nameRezensent || !reviewData.titel ||
            !reviewData.beschreibung || !reviewData.sterne || isNaN(reviewData.sterne)) {
            alert('Bitte alle Felder korrekt ausfüllen!');
            return;
        }

        try {
            const response = await fetch(REVIEWS_API_BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reviewData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`${response.status}: ${errorText}`);
            }

            alert('Bewertung erfolgreich gespeichert!');
            bootstrap.Modal.getInstance(document.getElementById('flightModal')).hide();
            loadFlights();

        } catch (error) {
            console.error('Fehler beim Senden:', error);
            alert('Fehler beim Speichern der Bewertung: ' + error.message);
        }
    });

    // Modal anzeigen
    const flightModal = new bootstrap.Modal(document.getElementById('flightModal'));
    flightModal.show();
}

// Funktion zum Filtern und Sortieren der Flüge
function filterFlights() {
    const filter = document.getElementById('flightFilter').value.toUpperCase();
    const sortOrder = document.getElementById('sortOrderFlights').value;

    let filtered = flightsData.filter(flight =>
        flight.start.toUpperCase().includes(filter) ||
        flight.ziel.toUpperCase().includes(filter) ||
        flight.fluggesellschaft.toUpperCase().includes(filter) ||
        flight.flugnummer.toUpperCase().includes(filter)
    );

    switch (sortOrder) {
        case 'dateAsc':
            filtered.sort((a, b) => new Date(a.abflug) - new Date(b.abflug)); 
            break;
        case 'dateDesc':
            filtered.sort((a, b) => new Date(b.abflug) - new Date(a.abflug)); 
            break;
        case 'priceAsc':
            filtered.sort((a, b) => a.preis - b.preis); 
            break;
        case 'priceDesc':
            filtered.sort((a, b) => b.preis - a.preis); 
            break;
    }

    displayFlights(filtered);
}

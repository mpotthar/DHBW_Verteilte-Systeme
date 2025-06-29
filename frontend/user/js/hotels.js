const HOTELS_API_BASE_URL = '/api/hotels';
const REVIEWS_API_BASE_URL = '/api/reviews';
let hotelsData = [];
let currentHotel = null;

// Event-Listener für DOMContentLoaded, um die Hotels zu laden und Filter zu initialisieren
document.addEventListener('DOMContentLoaded', () => {
    loadHotels();
    document.getElementById('hotelFilter').addEventListener('keyup', filterHotels);
    document.getElementById('starFilter').addEventListener('change', filterHotels);
    document.getElementById('sortOrder').addEventListener('change', filterHotels);
});

// Funktion zum Laden der Hotels von der API
async function loadHotels() {
    try {
        const response = await fetch(`${HOTELS_API_BASE_URL}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        hotelsData = await response.json();
        filterHotels();
    } catch (error) {
        document.getElementById('hotelCards').innerHTML =
            `<div class="col-12 text-center">
                <div class="alert alert-danger">
                    Fehler beim Laden der Hotels. Bitte versuchen Sie es später erneut.
                </div>
            </div>`;
    }
}

// Hilfsfunktion zum iterieren und Erstellen der Sterne-Bewertung für Hotel-Kategorie
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

// Hilfsfunktion: Durchschnittliche Bewertung als String mit Komma
function getAverageRating(reviews) {
    if (!reviews || reviews.length === 0) return "0,0";
    const total = reviews.reduce((sum, review) => sum + review.sterne, 0);
    const avg = total / reviews.length;
    return avg.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

// Bewertungen für ein Hotel abrufen
async function getHotelReviews(hotel_id) {
    if (!hotel_id) return [];
    try {
        const response = await fetch(`${REVIEWS_API_BASE_URL}/product/${hotel_id}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Fehler beim Abrufen der Bewertungen:', error);
        return [];
    }
}

// Funktion zum Anzeigen der Hotels in Bootstrap-Cards, inkl. Bewertungsdurchschnitt
async function displayHotels(hotels) {
    const container = document.getElementById('hotelCards');
    if (!hotels || hotels.length === 0) {
        container.innerHTML = `<div class="col-12 text-center">
            <div class="alert alert-info">Keine Hotels gefunden.</div>
        </div>`;
        return;
    }
    container.innerHTML = '';
    for (const hotel of hotels) {
        // Bewertungen laden
        const reviews = await getHotelReviews(hotel.id || hotel._id);
        const avgRating = getAverageRating(reviews);

        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4 mb-4';
        col.innerHTML = `
            <div class="card h-100">
                <div class="badge-price">${hotel.preis} € / Nacht</div>
                <div class="badge-rating">${avgRating} <i class="bi bi-star-fill"></i></div>
                <img src="${hotel.bilder && hotel.bilder.length > 0 ? hotel.bilder[0] : 'img/header_hotel.jpg'}" class="card-img-top" alt="${hotel.name}">
                <div class="card-body">
                    <h5 class="card-title">${hotel.name}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${hotel.ort}</h6>
                    <div class="star-rating mb-2">${getStars(hotel.sterne)}</div>
                    <p class="card-text">${hotel.beschreibung ? hotel.beschreibung.substring(0, 100) + '...' : 'Keine Beschreibung verfügbar'}</p>
                </div>
                <div class="card-footer bg-white border-top-0">
                    <button class="btn btn-outline-primary w-100" onclick='showHotelDetails(${JSON.stringify(hotel)})'>
                        Details ansehen
                    </button>
                </div>
            </div>
        `;
        container.appendChild(col);
    }
}

// Funktion zum Anzeigen der Hotel-Details in einem Bootstrap Modal
async function showHotelDetails(hotel) {
    const hotelId = hotel.id || hotel._id;
    if (!hotelId) {
        alert('Fehler: Hotel-ID nicht gefunden!');
        return;
    }
    currentHotel = { ...hotel, id: hotelId };

    const modalBody = document.getElementById('hotelModalBody');
    const modalTitle = document.getElementById('hotelModalLabel');
    const reviews = await getHotelReviews(hotelId);
    const avgRating = getAverageRating(reviews);

    modalTitle.textContent = hotel.name;

    modalBody.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <img src="${hotel.bilder && hotel.bilder.length > 0 ? hotel.bilder[0] : 'img/header_hotel.jpg'}" 
                     class="img-fluid rounded" alt="${hotel.name}">
            </div>
            <div class="col-md-6">
                <h5>${hotel.name}</h5>
                <p><i class="bi bi-geo-alt-fill"></i> ${hotel.ort}</p>
                <div class="star-rating mb-2">${getStars(hotel.sterne)}</div>
                <p><strong>Preis pro Nacht:</strong> ${hotel.preis} €</p>
                <p><strong>Zimmerzahl:</strong> ${hotel.zimmerzahl}</p>
                <p><strong>Durchschnittliche Bewertung:</strong> ${avgRating} <i class="bi bi-star-fill text-warning"></i></p>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-12">
                <h6>Beschreibung:</h6>
                <p>${hotel.beschreibung || 'Keine Beschreibung verfügbar'}</p>
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

        if (!currentHotel || !currentHotel.id) {
            alert('Fehler: Hotel-ID nicht verfügbar');
            return;
        }
        const reviewData = {
            productID: String(currentHotel.id),
            nameRezensent: document.getElementById('name').value.trim(),
            titel: document.getElementById('titel').value.trim(),
            beschreibung: document.getElementById('beschreibung').value.trim(),
            sterne: parseInt(document.getElementById('sterne').value, 10),
            dienstleistungsTyp: 'hotel'
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
            bootstrap.Modal.getInstance(document.getElementById('hotelModal')).hide();
            loadHotels();

        } catch (error) {
            console.error('Fehler beim Senden:', error);
            alert('Fehler beim Speichern der Bewertung: ' + error.message);
        }
    });

    // Modal anzeigen
    const hotelModal = new bootstrap.Modal(document.getElementById('hotelModal'));
    hotelModal.show();
}

// Funktion zum Filtern und Sortieren der Hotels basierend auf Benutzereingaben
function filterHotels() {
    const filterText = document.getElementById('hotelFilter').value.toUpperCase();
    const starFilter = parseInt(document.getElementById('starFilter').value);
    const sortOrder = document.getElementById('sortOrder').value;

    let filtered = hotelsData.filter(hotel => {
        const nameMatch = hotel.name.toUpperCase().includes(filterText);
        const ortMatch = hotel.ort.toUpperCase().includes(filterText);
        const starMatch = starFilter === 0 || hotel.sterne === starFilter;
        return (nameMatch || ortMatch) && starMatch;
    });

    switch (sortOrder) {
        case 'priceAsc':
            filtered.sort((a, b) => a.preis - b.preis); 
            break;
        case 'priceDesc':
            filtered.sort((a, b) => b.preis - a.preis); 
            break;
        case 'starsDesc':
            filtered.sort((a, b) => b.sterne - a.sterne); 
            break;
        case 'nameAsc':
            filtered.sort((a, b) => a.name.localeCompare(b.name)); 
            break;
    }
    
    displayHotels(filtered);
}

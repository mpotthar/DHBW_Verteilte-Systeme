const CARS_API_BASE_URL = '/api/cars';
const REVIEWS_API_BASE_URL = '/api/reviews';
let carsData = [];
let currentCar = null;

// Event-Listener für DOMContentLoaded, um die Mietwagen zu laden und Filter zu initialisieren
document.addEventListener('DOMContentLoaded', () => {
    loadCars();
    document.getElementById('carFilter').addEventListener('keyup', filterCars);
    document.getElementById('getriebeFilter').addEventListener('change', filterCars);
    document.getElementById('versicherungFilter').addEventListener('change', filterCars);
    document.getElementById('sortOrderCars').addEventListener('change', filterCars);
});

// Funktion zum Laden der Mietwagen von der API
async function loadCars() {
    try {
        const response = await fetch(`${CARS_API_BASE_URL}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        carsData = await response.json();
        filterCars();
    } catch (error) {
        document.getElementById('carCards').innerHTML =
            `<div class="col-12 text-center">
                <div class="alert alert-danger">
                    Fehler beim Laden der Mietwagen. Bitte versuchen Sie es später erneut.
                </div>
            </div>`;
    }
}

// Hilfsfunktion für Bewertungen (gelbe Sterne)
function getStarsRating(count) {
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

// Bewertungen für ein Auto abrufen
async function getCarReviews(car_id) {
    if (!car_id) return [];
    try {
        const response = await fetch(`${REVIEWS_API_BASE_URL}/product/${car_id}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Fehler beim Abrufen der Bewertungen:', error);
        return [];
    }
}

// Funktion zum Anzeigen der Mietwagen in Bootstrap-Cards, inkl. Bewertungsdurchschnitt
async function displayCars(cars) {
    const container = document.getElementById('carCards');
    if (!cars || cars.length === 0) {
        container.innerHTML = `<div class="col-12 text-center">
            <div class="alert alert-info">Keine Mietwagen gefunden.</div>
        </div>`;
        return;
    }
    container.innerHTML = '';
    for (const car of cars) {
        // Bewertungen laden
        const reviews = await getCarReviews(car.id || car._id);
        const avgRating = getAverageRating(reviews);

        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4 mb-4';
        col.innerHTML = `
            <div class="card h-100">
                <div class="badge-price">${car.mietpreis_pro_24h} € / Tag</div>
                <div class="badge-rating">${avgRating} <i class="bi bi-star-fill"></i></div>
                <img src="${car.bild_url || 'img/header_car.jpg'}" class="card-img-top" alt="${car.hersteller} ${car.modell}">
                <div class="card-body">
                    <h5 class="card-title">${car.hersteller} ${car.modell}</h5>
                    <p class="mb-1"><i class="bi bi-car-front feature-icon"></i> <strong>Typ:</strong> ${car.typ}</p>
                    <p class="mb-1"><i class="bi bi-people feature-icon"></i> <strong>Sitzplätze:</strong> ${car.sitzplaetze}</p>
                    <p class="mb-1"><i class="bi bi-gear feature-icon"></i> <strong>Getriebe:</strong> ${car.getriebe}</p>
                    <p class="mb-1"><i class="bi bi-shield-check feature-icon"></i> <strong>Versicherung:</strong> ${formatVersicherung(car.versicherung)}</p>
                </div>
                <div class="card-footer bg-white border-top-0">
                    <button class="btn btn-outline-primary w-100" onclick='showCarDetails(${JSON.stringify(car)})'>
                        Details ansehen
                    </button>
                </div>
            </div>
        `;
        container.appendChild(col);
    }
}

// Hilfsfunktion zum Formatieren der Versicherungsangaben
function formatVersicherung(versicherung) {
    if (versicherung === 'Vollkasko ohne Selbstbeteiligung') {
        return 'Vollkasko ohne Selbstbeteiligung';
    } else if (versicherung === 'Vollkasko mit 1000 Selbstbeteiligung') {
        return 'Vollkasko mit 1000 € Selbstbeteiligung';
    }
    return versicherung;
}

// Funktion zum Anzeigen der Details eines Mietwagens in einem Bootstrap Modal
async function showCarDetails(car) {
    const carId = car.id || car._id;
    if (!carId) {
        alert('Fehler: Mietwagen-ID nicht gefunden!');
        return;
    }
    currentCar = { ...car, id: carId };

    const modalBody = document.getElementById('carModalBody');
    const modalTitle = document.getElementById('carModalLabel');
    const reviews = await getCarReviews(carId);
    const avgRating = getAverageRating(reviews);

    modalTitle.textContent = `${car.hersteller} ${car.modell}`;

    modalBody.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <img src="${car.bild_url || 'img/header_car.jpg'}" 
                     class="img-fluid rounded" alt="${car.hersteller} ${car.modell}">
            </div>
            <div class="col-md-6">
                <h4>${car.hersteller} ${car.modell}</h4>
                <div class="mt-3">
                    <p><i class="bi bi-tag-fill feature-icon"></i> <strong>Typ:</strong> ${car.typ}</p>
                    <p><i class="bi bi-people-fill feature-icon"></i> <strong>Sitzplätze:</strong> ${car.sitzplaetze}</p>
                    <p><i class="bi bi-gear-fill feature-icon"></i> <strong>Getriebe:</strong> ${car.getriebe}</p>
                    <p><i class="bi bi-shield-fill-check feature-icon"></i> <strong>Versicherung:</strong> ${formatVersicherung(car.versicherung)}</p>
                    <p><i class="bi bi-currency-euro feature-icon"></i> <strong>Mietpreis pro Tag:</strong> ${car.mietpreis_pro_24h} €</p>
                    <p><strong>Durchschnittliche Bewertung:</strong> ${avgRating} <i class="bi bi-star-fill text-warning"></i></p>
                </div>
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
                                    <div>${getStarsRating(review.sterne)}</div>
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

        if (!currentCar || !currentCar.id) {
            alert('Fehler: Mietwagen-ID nicht verfügbar');
            return;
        }
        const reviewData = {
            productID: String(currentCar.id),
            nameRezensent: document.getElementById('name').value.trim(),
            titel: document.getElementById('titel').value.trim(),
            beschreibung: document.getElementById('beschreibung').value.trim(),
            sterne: parseInt(document.getElementById('sterne').value, 10),
            dienstleistungsTyp: 'mietwagen'
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
            bootstrap.Modal.getInstance(document.getElementById('carModal')).hide();
            loadCars();

        } catch (error) {
            console.error('Fehler beim Senden:', error);
            alert('Fehler beim Speichern der Bewertung: ' + error.message);
        }
    });

    // Modal anzeigen
    const carModal = new bootstrap.Modal(document.getElementById('carModal'));
    carModal.show();
}

// Funktion zum Filtern und Sortieren der Mietwagen
function filterCars() {
    const text = document.getElementById('carFilter').value.toUpperCase();
    const getriebe = document.getElementById('getriebeFilter').value;
    const versicherung = document.getElementById('versicherungFilter').value;
    const sortOrder = document.getElementById('sortOrderCars').value;

    let filtered = carsData.filter(car => {
        const matchesText =
            (!text ||
                (car.typ && car.typ.toUpperCase().includes(text)) ||
                (car.hersteller && car.hersteller.toUpperCase().includes(text)) ||
                (car.modell && car.modell.toUpperCase().includes(text))
            );

        const matchesGetriebe = !getriebe || car.getriebe === getriebe;
        const matchesVersicherung = !versicherung || car.versicherung === versicherung;

        return matchesText && matchesGetriebe && matchesVersicherung;
    });

    switch (sortOrder) {
        case 'preisAsc':
            filtered.sort((a, b) => a.mietpreis_pro_24h - b.mietpreis_pro_24h);
            break;
        case 'preisDesc':
            filtered.sort((a, b) => b.mietpreis_pro_24h - a.mietpreis_pro_24h);
            break;
        case 'sitzplaetzeDesc':
            filtered.sort((a, b) => b.sitzplaetze - a.sitzplaetze);
            break;
        case 'herstellerAsc':
            filtered.sort((a, b) => a.hersteller.localeCompare(b.hersteller));
            break;
    }

    displayCars(filtered);
}

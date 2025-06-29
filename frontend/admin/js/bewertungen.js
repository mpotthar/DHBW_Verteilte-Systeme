const REVIEWS_API_BASE_URL = '/api/reviews';
const HOTELS_API_URL = '/api/hotels';
const FLIGHTS_API_URL = '/api/flights';
const CARS_API_URL = '/api/cars';

let reviewsData = [];
let hotelsData = [];
let flightsData = [];
let carsData = [];

// Initialisierung nach Laden der Seite
document.addEventListener('DOMContentLoaded', () => {
    loadBewertungen();
});

// Erstelle Filterfunktion und lade Bewertungen
async function loadBewertungen() {
    // ERST die Dienstleistungen laden, DANN die Bewertungen
    await loadDienstleistungen();
    
    // Event-Listener für Filter
    document.getElementById('reviewFilter')?.addEventListener('keyup', filterReviews);
    document.getElementById('serviceTypeFilter')?.addEventListener('change', filterReviews);

    // Jetzt die Bewertungen laden
    fetchReviews();
}

// Lade alle Dienstleistungen - MUSS vor den Bewertungen geladen werden
async function loadDienstleistungen() {
    try {
        const [hotelsRes, flightsRes, carsRes] = await Promise.all([
            fetch(HOTELS_API_URL),
            fetch(FLIGHTS_API_URL),
            fetch(CARS_API_URL)
        ]);
        
        hotelsData = await hotelsRes.json();
        flightsData = await flightsRes.json();
        carsData = await carsRes.json();
        
        console.log('Dienstleistungen geladen:', { hotelsData, flightsData, carsData });
    } catch (error) {
        console.error('Fehler beim Laden der Dienstleistungen:', error);
    }
}

// Fetch Bewertungen von der API
async function fetchReviews() {
    try {
        const response = await fetch(`${REVIEWS_API_BASE_URL}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        reviewsData = await response.json();
        displayReviews(reviewsData);
    } catch (error) {
        showStatusMessageReviews(`Fehler beim Laden der Bewertungen: ${error.message}`, 'danger');
        document.getElementById("reviewsList").innerHTML =
            '<tr><td colspan="7" class="text-center text-danger">Fehler beim Laden der Bewertungen</td></tr>';
    }
}

// Zeigt die Bewertungen in der Tabelle an
function displayReviews(reviews) {
    const reviewsList = document.getElementById("reviewsList");
    if (!reviews || reviews.length === 0) {
        reviewsList.innerHTML = '<tr><td colspan="7" class="text-center">Keine Bewertungen gefunden</td></tr>';
        return;
    }
    
    reviewsList.innerHTML = reviews.map(review => {
        let dienstleistungInfo = 'Nicht zugewiesen';
        
        // Dienstleistungsdaten ermitteln basierend auf productID und dienstleistungsTyp
        if (review.dienstleistungsTyp && review.productID) {
            let dienstleistung;
            switch(review.dienstleistungsTyp) {
                case 'hotel':
                    dienstleistung = hotelsData.find(h => (h.id === review.productID || h._id === review.productID));
                    if (dienstleistung) dienstleistungInfo = `${dienstleistung.name} (${dienstleistung.ort})`;
                    break;
                case 'flug':
                    dienstleistung = flightsData.find(f => (f.id === review.productID || f._id === review.productID));
                    if (dienstleistung) dienstleistungInfo = `${dienstleistung.start} → ${dienstleistung.ziel}`;
                    break;
                case 'mietwagen':
                    dienstleistung = carsData.find(c => (c.id === review.productID || c._id === review.productID));
                    if (dienstleistung) dienstleistungInfo = `${dienstleistung.hersteller} ${dienstleistung.modell}`;
                    break;
            }
        }
        
        return `
            <tr>
                <td>${review.nameRezensent}</td>
                <td>${review.titel}</td>
                <td>${truncateText(review.beschreibung, 25)}</td>
                <td>${getStars(review.sterne)}</td>
                <td>${dienstleistungInfo}</td>
                <td>${formatDate(review.datum)}</td>
                <td>
                    <button class="btn btn-sm btn-primary me-1" 
                            onclick='showReviewForm(${JSON.stringify(review)})'>
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" 
                            onclick="deleteReview('${review._id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Zeigt das Formular zum Anlegen oder Bearbeiten einer Bewertung an
function showReviewForm(review = null) {
    const container = document.getElementById("reviewFormContainer");
    container.innerHTML = `
        <div class="card mt-4">
            <div class="card-header">
                <h5>${review ? 'Bewertung bearbeiten' : 'Neue Bewertung anlegen'}</h5>
            </div>
            <div class="card-body">
                <form id="reviewForm">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Name des Rezensenten</label>
                            <input type="text" class="form-control" name="nameRezensent" 
                                   value="${review ? review.nameRezensent : ''}" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Titel</label>
                            <input type="text" class="form-control" name="titel" 
                                   value="${review ? review.titel : ''}" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Beschreibung</label>
                        <textarea class="form-control" name="beschreibung" rows="3" required>${review ? review.beschreibung : ''}</textarea>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Sterne</label>
                            <select class="form-select" name="sterne" required>
                                ${[1, 2, 3, 4, 5].map(i => `
                                    <option value="${i}" ${review && review.sterne == i ? 'selected' : ''}>
                                        ${i} Stern${i !== 1 ? 'e' : ''}
                                    </option>
                                `).join('')}
                            </select>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Dienstleistungstyp</label>
                            <select class="form-select" id="dienstleistungsTyp" required>
                                <option value="">Bitte auswählen</option>
                                <option value="hotel" ${review?.dienstleistungsTyp === 'hotel' ? 'selected' : ''}>Hotel</option>
                                <option value="flug" ${review?.dienstleistungsTyp === 'flug' ? 'selected' : ''}>Flug</option>
                                <option value="mietwagen" ${review?.dienstleistungsTyp === 'mietwagen' ? 'selected' : ''}>Mietwagen</option>
                            </select>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Dienstleistung</label>
                        <select class="form-select" id="productID" name="productID" required>
                            <option value="">Bitte zuerst Typ auswählen</option>
                        </select>
                    </div>
                    <div class="d-flex justify-content-between">
                        <button type="button" class="btn btn-secondary" onclick="cancelReviewForm()">Abbrechen</button>
                        <button type="submit" class="btn btn-primary">Speichern</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    // Event-Listener für Dienstleistungstyp-Änderung
    document.getElementById('dienstleistungsTyp').addEventListener('change', function() {
        updateDienstleistungen(this.value, review?.productID);
    });

    // Initiale Auswahl setzen
    if (review) {
        updateDienstleistungen(review.dienstleistungsTyp, review.productID);
    }

    // Formular-Submit-Event
    document.getElementById("reviewForm").onsubmit = async function(e) {
        e.preventDefault();
        const formData = {
            nameRezensent: this.nameRezensent.value,
            titel: this.titel.value,
            beschreibung: this.beschreibung.value,
            sterne: parseInt(this.sterne.value),
            dienstleistungsTyp: document.getElementById('dienstleistungsTyp').value,
            productID: document.getElementById('productID').value
        };
        
        if (review && review._id) {
            await updateReview({ ...formData, _id: review._id });
        } else {
            await createReview(formData);
        }
    };
}

// Aktualisiert die Dienstleistungsauswahl basierend auf dem Typ
function updateDienstleistungen(typ, selectedId = null) {
    const select = document.getElementById('productID');
    select.innerHTML = '<option value="">Bitte auswählen</option>';
    
    if (!typ) return;
    
    let data = [];
    switch(typ) {
        case 'hotel': data = hotelsData; break;
        case 'flug': data = flightsData; break;
        case 'mietwagen': data = carsData; break;
    }
    
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id || item._id;
        
        // Angezeigter Text je nach Typ
        switch(typ) {
            case 'hotel':
                option.textContent = `${item.name} (${item.ort})`;
                break;
            case 'flug':
                option.textContent = `${item.start} → ${item.ziel} (${new Date(item.abflug).toLocaleDateString()})`;
                break;
            case 'mietwagen':
                option.textContent = `${item.hersteller} ${item.modell} (${item.typ})`;
                break;
        }
        
        if (selectedId && (item.id === selectedId || item._id === selectedId)) {
            option.selected = true;
        }
        
        select.appendChild(option);
    });
}

// Kürze Text auf eine maximale Länge und füge "..." hinzu, wenn er zu lang ist
function truncateText(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// Iteriere über die Sterneanzahl und generiere HTML (Bootstrap Icons) für die Sterne
function getStars(count) {
    let stars = '';
    for (let i = 0; i < count; i++) {
        stars += '<i class="bi bi-star-fill text-warning"></i> ';
    }
    return stars;
}

// Formatierte Anzeige von Datum nach deutschem Standard
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function cancelReviewForm() {
    document.getElementById("reviewFormContainer").innerHTML = "";
}

// Zeigt eine Statusmeldung an
function showStatusMessageReviews(message, type = 'success') {
    const statusElement = document.getElementById("statusMessageReviews");
    statusElement.textContent = message;
    statusElement.className = `alert alert-${type} mt-3`;
    setTimeout(() => {
        statusElement.className = 'alert d-none mt-3';
    }, 3000);
}

// Funktionen zum Erstellen, Aktualisieren und Löschen
async function createReview(reviewData) {
    try {
        const response = await fetch(`${REVIEWS_API_BASE_URL}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reviewData)
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        showStatusMessageReviews("Bewertung erfolgreich erstellt");
        cancelReviewForm();
        fetchReviews();
    } catch (error) {
        showStatusMessageReviews(`Fehler beim Erstellen der Bewertung: ${error.message}`, 'danger');
    }
}

async function updateReview(reviewData) {
    try {
        const id = reviewData._id;
        delete reviewData._id;
        const response = await fetch(`${REVIEWS_API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reviewData)
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        showStatusMessageReviews("Bewertung erfolgreich aktualisiert");
        cancelReviewForm();
        fetchReviews();
    } catch (error) {
        showStatusMessageReviews(`Fehler beim Aktualisieren der Bewertung: ${error.message}`, 'danger');
    }
}

async function deleteReview(id) {
    if (confirm("Bewertung wirklich löschen?")) {
        try {
            const response = await fetch(`${REVIEWS_API_BASE_URL}/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            showStatusMessageReviews("Bewertung erfolgreich gelöscht");
            fetchReviews();
        } catch (error) {
            showStatusMessageReviews(`Fehler beim Löschen der Bewertung: ${error.message}`, 'danger');
        }
    }
}

// Filtert die Bewertungen basierend auf dem eingegebenen Text und dem ausgewählten Dienstleistungstyp
function filterReviews() {
    const filterText = document.getElementById("reviewFilter").value.toUpperCase();
    const serviceTypeFilter = document.getElementById("serviceTypeFilter").value;
    let filtered = reviewsData.filter(review => {
        const matchesText = 
            (review.nameRezensent && review.nameRezensent.toUpperCase().includes(filterText)) ||
            (review.titel && review.titel.toUpperCase().includes(filterText)) ||
            (review.beschreibung && review.beschreibung.toUpperCase().includes(filterText));
        const matchesType = serviceTypeFilter === 'alle' || review.dienstleistungsTyp === serviceTypeFilter;
        return matchesText && matchesType;
    });
    displayReviews(filtered);
}

const REVIEWS_API_BASE_URL = '/api/reviews';
const HOTELS_API_URL = '/api/hotels';
const FLIGHTS_API_URL = '/api/flights';
const CARS_API_URL = '/api/cars';

let reviewsData = [];
let hotelsData = [];
let flightsData = [];
let carsData = [];

// Event-Listener für DOMContentLoaded, um die Bewertungen zu laden
document.addEventListener('DOMContentLoaded', () => {
    // ERST Dienstleistungen laden, DANN Bewertungen
    loadDienstleistungen().then(() => {
        loadReviews();
        document.getElementById('reviewFilter').addEventListener('keyup', filterReviews);
        document.getElementById('serviceTypeFilter').addEventListener('change', filterReviews);
    });
});

// Lade alle Dienstleistungen
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
    } catch (error) {
        console.error('Fehler beim Laden der Dienstleistungen:', error);
    }
}

// Funktion zum Laden der Bewertungen von der API
async function loadReviews() {
    try {
        const response = await fetch(`${REVIEWS_API_BASE_URL}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        reviewsData = await response.json();
        displayReviews(reviewsData);
    } catch (error) {
        document.getElementById('reviewCards').innerHTML =
            `<div class="col-12 text-center">
                <div class="alert alert-danger">
                    Fehler beim Laden der Bewertungen. Bitte versuchen Sie es später erneut.
                </div>
            </div>`;
    }
}

// Funktion zum Anzeigen der Bewertungen in Bootstrap-Cards
function displayReviews(reviews) {
    const container = document.getElementById('reviewCards');
    if (!reviews || reviews.length === 0) {
        container.innerHTML = `<div class="col-12 text-center">
            <div class="alert alert-info">Keine Bewertungen gefunden.</div>
        </div>`;
        return;
    }
    
    container.innerHTML = reviews.map(review => {
        // Dienstleistungsdaten ermitteln
        let dienstleistungName = 'Dienstleistung nicht gefunden';
        
        if (review.dienstleistungsTyp && review.productID) {
            switch(review.dienstleistungsTyp) {
                case 'hotel':
                    const hotel = hotelsData.find(h => (h.id === review.productID || h._id === review.productID));
                    if (hotel) dienstleistungName = `${hotel.name} (${hotel.ort})`;
                    break;
                case 'flug':
                    const flug = flightsData.find(f => (f.id === review.productID || f._id === review.productID));
                    if (flug) dienstleistungName = `${flug.start} → ${flug.ziel}`;
                    break;
                case 'mietwagen':
                    const auto = carsData.find(c => (c.id === review.productID || c._id === review.productID));
                    if (auto) dienstleistungName = `${auto.hersteller} ${auto.modell}`;
                    break;
            }
        }
        
        return `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="review-title">${review.titel}</h5>
                        <div class="star-rating mb-2">
                            ${getStars(review.sterne)}
                        </div>
                        <p class="mb-1"><strong>Dienstleistung:</strong> ${dienstleistungName}</p>
                        <p class="mb-1"><strong>Kategorie:</strong> ${getServiceTypeLabel(review.dienstleistungsTyp)}</p>
                        <p class="card-text">${truncateText(review.beschreibung, 100)}</p>
                    </div>
                    <div class="card-footer bg-white border-top-0 d-flex justify-content-between align-items-center">
                        <span class="text-muted small"><i class="bi bi-person-circle"></i> ${review.nameRezensent}</span>
                        <button class="btn btn-outline-primary btn-sm" onclick='showReviewDetails(${JSON.stringify(review)})'>
                            Details ansehen
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Funktion zum Anzeigen der Bewertungsdetails in einem Bootstrap Modal
function showReviewDetails(review) {
    // Dienstleistungsdaten ermitteln
    let dienstleistungName = 'Dienstleistung nicht gefunden';
    let dienstleistungDetails = '';
    
    if (review.dienstleistungsTyp && review.productID) {
        switch(review.dienstleistungsTyp) {
            case 'hotel':
                const hotel = hotelsData.find(h => (h.id === review.productID || h._id === review.productID));
                if (hotel) {
                    dienstleistungName = `${hotel.name} (${hotel.ort})`;
                    dienstleistungDetails = `
                        <p><strong>Zimmer:</strong> ${hotel.zimmerzahl}</p>
                        <p><strong>Preis:</strong> ${hotel.preis} €/Nacht</p>
                    `;
                }
                break;
            case 'flug':
                const flug = flightsData.find(f => (f.id === review.productID || f._id === review.productID));
                if (flug) {
                    dienstleistungName = `${flug.start} → ${flug.ziel}`;
                    dienstleistungDetails = `
                        <p><strong>Flugnummer:</strong> ${flug.flugnummer}</p>
                        <p><strong>Preis:</strong> ${flug.preis} €</p>
                    `;
                }
                break;
            case 'mietwagen':
                const auto = carsData.find(c => (c.id === review.productID || c._id === review.productID));
                if (auto) {
                    dienstleistungName = `${auto.hersteller} ${auto.modell}`;
                    dienstleistungDetails = `
                        <p><strong>Typ:</strong> ${auto.typ}</p>
                        <p><strong>Preis:</strong> ${auto.mietpreis_pro_24h} €/Tag</p>
                    `;
                }
                break;
        }
    }
    
    const modalBody = document.getElementById('reviewModalBody');
    const modalTitle = document.getElementById('reviewModalLabel');
    modalTitle.textContent = review.titel;
    modalBody.innerHTML = `
        <div class="mb-3">
            <div class="star-rating mb-2 fs-5">${getStars(review.sterne)}</div>
            <p><strong>Dienstleistung:</strong> ${dienstleistungName}</p>
            <p><strong>Kategorie:</strong> ${getServiceTypeLabel(review.dienstleistungsTyp)}</p>
            ${dienstleistungDetails}
        </div>
        <div class="mb-3">
            <h6>Beschreibung:</h6>
            <p>${review.beschreibung}</p>
        </div>
        <div class="d-flex justify-content-between mt-4 pt-3 border-top">
            <span><i class="bi bi-person-circle"></i> ${review.nameRezensent}</span>
            <span><i class="bi bi-calendar"></i> ${formatDate(review.datum)}</span>
        </div>
    `;
    
    const reviewModal = new bootstrap.Modal(document.getElementById('reviewModal'));
    reviewModal.show();
}

// Hilfsfunktion zum iterieren und Erstellen der Sterne-Bewertung
function getStars(count) {
    let stars = '';
    for (let i = 0; i < count; i++) {
        stars += '<i class="bi bi-star-fill text-warning"></i> ';
    }
    return stars;
}

// Hilfsfunktionen für die Bewertungstypen
function getServiceTypeLabel(type) {
    switch (type) {
        case 'hotel': return 'Hotel';
        case 'flug': return 'Flug';
        case 'mietwagen': return 'Mietwagen';
        default: return type;
    }
}

// Hilfsfunktion zum Truncieren von Text
function truncateText(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// Formatierung von Datum und Uhrzeit
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

// Funktion zum Filtern der Bewertungen
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

const API_BASE_URL = '/api';
let hotelsData = [];

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
        const response = await fetch(`${API_BASE_URL}/hotels`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        hotelsData = await response.json();
        // displayHotels(hotelsData); <- ersetzt durch filterHotels(), um die initiale Anzeige zu filtern
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

// Funktion zum Anzeigen der Hotels in Bootstrap-Cards
// Input: hotels (Array von Hotel-Objekten)
function displayHotels(hotels) {
    const container = document.getElementById('hotelCards');
    if (!hotels || hotels.length === 0) {
        container.innerHTML = `<div class="col-12 text-center">
            <div class="alert alert-info">Keine Hotels gefunden.</div>
        </div>`;
        return;
    }
    container.innerHTML = hotels.map(hotel => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100">
                <div class="badge-price">${hotel.preis} € / Nacht</div>
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
        </div>
    `).join('');
}

// Hilfsfunktion zum iterieren und Erstellen der Sterne-Bewertung
// Input: count (Anzahl der Sterne)
function getStars(count) {
    let stars = '';
    for (let i = 0; i < count; i++) {
        stars += '<i class="bi bi-star-fill"></i> ';
    }
    return stars;
}

// Funktion zum Anzeigen der Hotel-Details in einem Bootstrap Modal
// Input: hotel (Objekt mit Hotel-Daten)
function showHotelDetails(hotel) {
    const modalBody = document.getElementById('hotelModalBody');
    const modalTitle = document.getElementById('hotelModalLabel');
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
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-12">
                <h6>Beschreibung:</h6>
                <p>${hotel.beschreibung || 'Keine Beschreibung verfügbar'}</p>
            </div>
        </div>
    `;
    const hotelModal = new bootstrap.Modal(document.getElementById('hotelModal'));
    hotelModal.show();
}

// Funktion zum Filtern und Sortieren der Hotels basierend auf Benutzereingaben
// Aufgerufen bei Eingabe in das Filterfeld, Änderung der Sterne-Auswahl oder Sortierung, 
// sowie initial loadHotels
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

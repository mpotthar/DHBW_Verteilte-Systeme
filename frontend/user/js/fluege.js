const FLIGHTS_API_BASE_URL = '/api';
let flightsData = [];

// Event-Listener für DOMContentLoaded, um die Flüge zu laden und Filter zu initialisieren
document.addEventListener('DOMContentLoaded', () => {
    loadFlights();
    document.getElementById('flightFilter').addEventListener('keyup', filterFlights);
    document.getElementById('sortOrderFlights').addEventListener('change', filterFlights);
});

// Funktion zum Laden der Flüge von der API
async function loadFlights() {
    try {
        const response = await fetch(`${FLIGHTS_API_BASE_URL}/flights`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        flightsData = await response.json();
        filterFlights();
        // displayFlights(flightsData); <- ersetzt durch filterFlights(), um die initiale Anzeige zu filtern
    } catch (error) {
        document.getElementById('flightCards').innerHTML =
            `<div class="col-12 text-center">
                <div class="alert alert-danger">
                    Fehler beim Laden der Flüge. Bitte versuchen Sie es später erneut.
                </div>
            </div>`;
    }
}

// Funktion zum Anzeigen der Flüge in Bootstrap-Cards
// Input: flights (Array von Flug-Objekten)
function displayFlights(flights) {
    const container = document.getElementById('flightCards');
    if (!flights || flights.length === 0) {
        container.innerHTML = `<div class="col-12 text-center">
            <div class="alert alert-info">Keine Flüge gefunden.</div>
        </div>`;
        return;
    }
    container.innerHTML = flights.map(flight => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100 position-relative">
                <div class="badge-price">${flight.preis} €</div>
                <img src="img/flight.jpg" class="card-img-top" alt="Flug">
                <div class="card-body">
                    <h5 class="card-title">${flight.start} <i class="bi bi-arrow-right"></i> ${flight.ziel}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${flight.fluggesellschaft} (${flight.flugnummer})</h6>
                    <p class="mb-1"><strong>Abflug:</strong> ${formatDateTime(flight.abflug)}</p>
                    <p class="mb-1"><strong>Ankunft:</strong> ${formatDateTime(flight.ankunft)}</p>
                </div>
                <div class="card-footer bg-white border-top-0">
                    <button class="btn btn-outline-primary w-100" onclick='showFlightDetails(${JSON.stringify(flight)})'>
                        Details ansehen
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Hilfsfunktion zum Truncieren von Text
// Formatierung von Datum und Uhrzeit in deutschem Format
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

// Funktion zum Anzeigen der Flugdaten in einem Bootstrap Modal
// Input: flight (Flug-Objekt)
function showFlightDetails(flight) {
    const modalBody = document.getElementById('flightModalBody');
    const modalTitle = document.getElementById('flightModalLabel');
    modalTitle.textContent = `${flight.start} → ${flight.ziel}`;
    modalBody.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <img src="img/flight.jpg" 
                     class="img-fluid rounded" alt="Flug">
            </div>
            <div class="col-md-6">
                <h5>${flight.fluggesellschaft} (${flight.flugnummer})</h5>
                <p><strong>Start:</strong> ${flight.start}</p>
                <p><strong>Ziel:</strong> ${flight.ziel}</p>
                <p><strong>Abflug:</strong> ${formatDateTime(flight.abflug)}</p>
                <p><strong>Ankunft:</strong> ${formatDateTime(flight.ankunft)}</p>
                <p><strong>Preis:</strong> ${flight.preis} €</p>
            </div>
        </div>
    `;
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

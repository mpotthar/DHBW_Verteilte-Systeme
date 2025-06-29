const FLIGHTS_API_BASE_URL = '/api';
let flightsData = [];

// Erstelle die Filterfunktion und lade Flüge
function loadFlights() {
    document.getElementById('flightFilter').addEventListener('keyup', filterFlights);

    fetchFlights();
}

// Fetch Flüge von der API
async function fetchFlights() {
    try {
        const response = await fetch(`${FLIGHTS_API_BASE_URL}/flights`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        flightsData = await response.json();
        displayFlights(flightsData);
    } catch (error) {
        showStatusMessageFlights(`Fehler beim Laden der Flüge: ${error.message}`, 'danger');
        document.getElementById("flightsList").innerHTML =
            '<tr><td colspan="8" class="text-center text-danger">Fehler beim Laden der Flüge</td></tr>';
    }
}

// Zeigt die Flüge in der Tabelle an
// Input: flights - Array von Flug-Objekten
function displayFlights(flights) {
    const flightsList = document.getElementById("flightsList");
    if (!flights || flights.length === 0) {
        flightsList.innerHTML = '<tr><td colspan="8" class="text-center">Keine Flüge gefunden</td></tr>';
        return;
    }
    flightsList.innerHTML = flights.map(flight => `
        <tr>
            <td>${flight.start}</td>
            <td>${flight.ziel}</td>
            <td>${formatDateTime(flight.abflug)}</td>
            <td>${formatDateTime(flight.ankunft)}</td>
            <td>${flight.fluggesellschaft}</td>
            <td>${flight.flugnummer}</td>
            <td>${flight.preis} €</td>
            <td>
                <button class="btn btn-sm btn-primary me-1" onclick='showFlightForm(${JSON.stringify(flight)})'>
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteFlight('${flight._id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Formatierte Anzeige von Datum und Uhrzeit nach deutschem Standard
function formatDateTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('de-DE', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

// Zeigt das Formular zum Anlegen oder Bearbeiten eines Flugs an
// Input: flight - Optionales Flug-Objekt zum Bearbeiten, sonst leer
function showFlightForm(flight = null) {
    document.getElementById("flightFormContainer").innerHTML = `
        <div class="card mt-4">
            <div class="card-header">
                <h5>${flight ? 'Flug bearbeiten' : 'Neuen Flug anlegen'}</h5>
            </div>
            <div class="card-body">
                <form id="flightForm">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Start</label>
                            <input type="text" class="form-control" name="start" value="${flight ? flight.start : ''}" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Ziel</label>
                            <input type="text" class="form-control" name="ziel" value="${flight ? flight.ziel : ''}" required>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Abflug</label>
                            <input type="datetime-local" class="form-control" name="abflug" value="${flight ? toInputDateTime(flight.abflug) : ''}" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Ankunft</label>
                            <input type="datetime-local" class="form-control" name="ankunft" value="${flight ? toInputDateTime(flight.ankunft) : ''}" required>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Fluggesellschaft</label>
                            <input type="text" class="form-control" name="fluggesellschaft" value="${flight ? flight.fluggesellschaft : ''}" required>
                        </div>
                        <div class="col-md-3 mb-3">
                            <label class="form-label">Flugnummer</label>
                            <input type="text" class="form-control" name="flugnummer" value="${flight ? flight.flugnummer : ''}" required>
                        </div>
                        <div class="col-md-3 mb-3">
                            <label class="form-label">Preis (€)</label>
                            <input type="number" class="form-control" name="preis" value="${flight ? flight.preis : ''}" min="0" step="0.01" required>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between">
                        <button type="button" class="btn btn-secondary" onclick="cancelFlightForm()">Abbrechen</button>
                        <button type="submit" class="btn btn-primary">Speichern</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.getElementById("flightForm").onsubmit = async function(e) {
        e.preventDefault();
        const formData = {
            start: this.start.value,
            ziel: this.ziel.value,
            abflug: new Date(this.abflug.value),
            ankunft: new Date(this.ankunft.value),
            fluggesellschaft: this.fluggesellschaft.value,
            flugnummer: this.flugnummer.value,
            preis: parseFloat(this.preis.value)
        };
        if (flight && flight._id) {
            await updateFlight({ ...formData, _id: flight._id });
        } else {
            await createFlight(formData);
        }
    }
}

// Formatiert ein Datum für die Eingabe in ein datetime-local Feld
function toInputDateTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const pad = n => n < 10 ? '0' + n : n;
    return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// Schließt das Formular 
function cancelFlightForm() {
    document.getElementById("flightFormContainer").innerHTML = "";
}

// Zeigt eine Statusmeldung an
// Input: message - Die anzuzeigende Nachricht, type - Typ der Nachricht ('success', 'danger', etc.)
function showStatusMessageFlights(message, type = 'success') {
    const statusElement = document.getElementById("statusMessageFlights");
    statusElement.textContent = message;
    statusElement.className = `alert alert-${type} mt-3`;
    setTimeout(() => {
        statusElement.className = 'alert d-none mt-3';
    }, 3000);
}

// Funktionen zum Erstellen, Aktualisieren und Löschen
// Input: flightData - Objekt mit den Flugdaten
async function createFlight(flightData) {
    try {
        const response = await fetch(`${FLIGHTS_API_BASE_URL}/flights`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(flightData),
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        showStatusMessageFlights("Flug erfolgreich erstellt");
        cancelFlightForm();
        fetchFlights();
    } catch (error) {
        showStatusMessageFlights(`Fehler beim Erstellen des Flugs: ${error.message}`, 'danger');
    }
}

async function updateFlight(flightData) {
    try {
        const id = flightData._id;
        delete flightData._id;
        const response = await fetch(`${FLIGHTS_API_BASE_URL}/flights/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(flightData),
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        showStatusMessageFlights("Flug erfolgreich aktualisiert");
        cancelFlightForm();
        fetchFlights();
    } catch (error) {
        showStatusMessageFlights(`Fehler beim Aktualisieren des Flugs: ${error.message}`, 'danger');
    }
}

async function deleteFlight(id) {
    if (confirm("Flug wirklich löschen?")) {
        try {
            const response = await fetch(`${FLIGHTS_API_BASE_URL}/flights/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            showStatusMessageFlights("Flug erfolgreich gelöscht");
            fetchFlights();
        } catch (error) {
            showStatusMessageFlights(`Fehler beim Löschen des Flugs: ${error.message}`, 'danger');
        }
    }
}

// Filtert die Flüge basierend auf dem eingegebenen Text
function filterFlights() {
    const filter = document.getElementById("flightFilter").value.toUpperCase();
    let filtered = flightsData.filter(flight =>
        (flight.start && flight.start.toUpperCase().includes(filter)) ||
        (flight.ziel && flight.ziel.toUpperCase().includes(filter)) ||
        (flight.fluggesellschaft && flight.fluggesellschaft.toUpperCase().includes(filter)) ||
        (flight.flugnummer && flight.flugnummer.toUpperCase().includes(filter))
    );
    displayFlights(filtered);
}

// Initialisierung nach Laden der Seite
document.addEventListener('DOMContentLoaded', loadFlights);
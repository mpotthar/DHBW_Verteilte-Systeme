const CARS_API_BASE_URL = '/api';
let carsData = [];

// Erstelle die Filterfunktion und lade die Mietwagen
function loadMietwagen() {
    document.getElementById('carFilter').addEventListener('keyup', filterCars);

    fetchCars();
}

// Fetch Mietwagen von der API
async function fetchCars() {
    try {
        const response = await fetch(`${CARS_API_BASE_URL}/cars`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        carsData = await response.json();
        displayCars(carsData);
    } catch (error) {
        showStatusMessageCars(`Fehler beim Laden der Mietwagen: ${error.message}`, 'danger');
        document.getElementById("carsList").innerHTML =
            '<tr><td colspan="9" class="text-center text-danger">Fehler beim Laden der Mietwagen</td></tr>';
    }
}

// Zeigt die Mietwagen in der Tabelle an
// Input: cars - Array von Auto-Objekten
function displayCars(cars) {
    const carsList = document.getElementById("carsList");
    if (!cars || cars.length === 0) {
        carsList.innerHTML = '<tr><td colspan="9" class="text-center">Keine Mietwagen gefunden</td></tr>';
        return;
    }
    carsList.innerHTML = cars.map(car => `
        <tr>
            <td>${car.typ}</td>
            <td>${car.hersteller}</td>
            <td>${car.modell}</td>
            <td>${car.sitzplaetze}</td>
            <td>${car.getriebe}</td>
            <td>${car.versicherung}</td>
            <td>${car.mietpreis_pro_24h} €</td>
            <td>
                ${car.bild_url ? `<img src="${car.bild_url}" alt="Bild" style="width:60px;height:auto;border-radius:4px;">` : ''}
            </td>
            <td>
                <button class="btn btn-sm btn-primary me-1" onclick='showCarForm(${JSON.stringify(car)})'>
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteCar('${car._id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Zeigt das Formular zum Erstellen oder Bearbeiten eines Mietwagens an
// Input: car - Optional, das Auto-Objekt zum Bearbeiten, sonst leer
function showCarForm(car = null) {
    document.getElementById("carFormContainer").innerHTML = `
        <div class="card mt-4">
            <div class="card-header">
                <h5>${car ? 'Mietwagen bearbeiten' : 'Neuen Mietwagen anlegen'}</h5>
            </div>
            <div class="card-body">
                <form id="carForm">
                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <label class="form-label">Typ</label>
                            <input type="text" class="form-control" name="typ" value="${car ? car.typ : ''}" required>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label">Hersteller</label>
                            <input type="text" class="form-control" name="hersteller" value="${car ? car.hersteller : ''}" required>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label">Modell</label>
                            <input type="text" class="form-control" name="modell" value="${car ? car.modell : ''}" required>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <label class="form-label">Sitzplätze</label>
                            <input type="number" class="form-control" name="sitzplaetze" value="${car ? car.sitzplaetze : ''}" min="1" required>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label">Getriebe</label>
                            <select class="form-select" name="getriebe" required>
                                <option value="Automatik" ${car && car.getriebe === 'Automatik' ? 'selected' : ''}>Automatik</option>
                                <option value="Manuell" ${car && car.getriebe === 'Manuell' ? 'selected' : ''}>Manuell</option>
                            </select>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label">Versicherung</label>
                            <select class="form-select" name="versicherung" required>
                                <option value="Vollkasko ohne Selbstbeteiligung" ${car && car.versicherung === 'Vollkasko ohne Selbstbeteiligung' ? 'selected' : ''}>Vollkasko ohne Selbstbeteiligung</option>
                                <option value="Vollkasko mit 1000 Selbstbeteiligung" ${car && car.versicherung === 'Vollkasko mit 1000 Selbstbeteiligung' ? 'selected' : ''}>Vollkasko mit 1000 Selbstbeteiligung</option>
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Mietpreis pro 24h (€)</label>
                            <input type="number" class="form-control" name="mietpreis_pro_24h" value="${car ? car.mietpreis_pro_24h : ''}" min="0" step="0.01" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Bild URL</label>
                            <input type="url" class="form-control" name="bild_url" value="${car ? car.bild_url : ''}">
                        </div>
                    </div>
                    <div class="d-flex justify-content-between">
                        <button type="button" class="btn btn-secondary" onclick="cancelCarForm()">Abbrechen</button>
                        <button type="submit" class="btn btn-primary">Speichern</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.getElementById("carForm").onsubmit = async function(e) {
        e.preventDefault();
        const formData = {
            typ: this.typ.value,
            hersteller: this.hersteller.value,
            modell: this.modell.value,
            sitzplaetze: parseInt(this.sitzplaetze.value),
            getriebe: this.getriebe.value,
            versicherung: this.versicherung.value,
            mietpreis_pro_24h: parseFloat(this.mietpreis_pro_24h.value),
            bild_url: this.bild_url.value
        };
        if (car && car._id) {
            await updateCar({ ...formData, _id: car._id });
        } else {
            await createCar(formData);
        }
    }
}

// Schließt das Formular
function cancelCarForm() {
    document.getElementById("carFormContainer").innerHTML = "";
}

// Zeigt eine Statusmeldung an
// Input: message - Die anzuzeigende Nachricht, type - Typ der Nachricht ('success', 'danger', etc.)
function showStatusMessageCars(message, type = 'success') {
    const statusElement = document.getElementById("statusMessageCars");
    statusElement.textContent = message;
    statusElement.className = `alert alert-${type} mt-3`;
    setTimeout(() => {
        statusElement.className = 'alert d-none mt-3';
    }, 3000);
}

// Funktionen zum Erstellen, Aktualisieren und Löschen
// Input: carData - Objekt mit den Flugdaten
async function createCar(carData) {
    try {
        const response = await fetch(`${CARS_API_BASE_URL}/cars`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(carData)
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        showStatusMessageCars("Mietwagen erfolgreich erstellt");
        cancelCarForm();
        fetchCars();
    } catch (error) {
        showStatusMessageCars(`Fehler beim Erstellen des Mietwagens: ${error.message}`, 'danger');
    }
}

async function updateCar(carData) {
    try {
        const id = carData._id;
        delete carData._id;
        const response = await fetch(`${CARS_API_BASE_URL}/cars/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(carData)
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        showStatusMessageCars("Mietwagen erfolgreich aktualisiert");
        cancelCarForm();
        fetchCars();
    } catch (error) {
        showStatusMessageCars(`Fehler beim Aktualisieren des Mietwagens: ${error.message}`, 'danger');
    }
}

async function deleteCar(id) {
    if (confirm("Mietwagen wirklich löschen?")) {
        try {
            const response = await fetch(`${CARS_API_BASE_URL}/cars/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            showStatusMessageCars("Mietwagen erfolgreich gelöscht");
            fetchCars();
        } catch (error) {
            showStatusMessageCars(`Fehler beim Löschen des Mietwagens: ${error.message}`, 'danger');
        }
    }
}

// Filtert die Mietwagen basierend auf dem eingegebenen Text
function filterCars() {
    const filter = document.getElementById("carFilter").value.toUpperCase();
    let filtered = carsData.filter(car =>
        (car.typ && car.typ.toUpperCase().includes(filter)) ||
        (car.hersteller && car.hersteller.toUpperCase().includes(filter)) ||
        (car.modell && car.modell.toUpperCase().includes(filter)) ||
        (car.getriebe && car.getriebe.toUpperCase().includes(filter)) ||
        (car.versicherung && car.versicherung.toUpperCase().includes(filter))
    );
    displayCars(filtered);
}

// Initialisierung nach Laden der Seite
document.addEventListener('DOMContentLoaded', loadMietwagen);
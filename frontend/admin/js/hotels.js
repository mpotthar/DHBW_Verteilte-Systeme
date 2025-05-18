const API_BASE_URL = '/api';
let hotelsData = []; // Für Filterfunktion

function loadHotels() {
    document.getElementById("mainContent").innerHTML = `
        <h2>Hotels</h2>
        <div class="row mb-3">
            <div class="col-md-6">
                <input type="text" id="hotelFilter" class="form-control" placeholder="Hotels filtern...">
            </div>
            <div class="col-md-6 text-md-end">
                <button class="btn btn-success" onclick="showHotelForm()">
                    <i class="bi bi-plus-circle"></i> Neues Hotel
                </button>
            </div>
        </div>
        <div class="table-responsive">
            <table class="table table-striped align-middle" id="hotelsTable">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Ort</th>
                        <th>Sterne</th>
                        <th>Zimmerzahl</th>
                        <th>Preis/Nacht</th>
                        <th>Aktionen</th>
                    </tr>
                </thead>
                <tbody id="hotelsList">
                    <tr>
                        <td colspan="6" class="text-center">Lade Hotels...</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div id="hotelFormContainer"></div>
        <div id="statusMessage" class="alert d-none mt-3"></div>
    `;

    document.getElementById("hotelFilter").addEventListener("keyup", filterHotels);
    fetchHotels();
}

async function fetchHotels() {
    try {
        const response = await fetch(`${API_BASE_URL}/hotels`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const hotels = await response.json();
        hotelsData = hotels;
        displayHotels(hotels);
    } catch (error) {
        showStatusMessage(`Fehler beim Laden der Hotels: ${error.message}`, 'danger');
        document.getElementById("hotelsList").innerHTML = 
            '<tr><td colspan="6" class="text-center text-danger">Fehler beim Laden der Hotels</td></tr>';
    }
}

function displayHotels(hotels) {
    const hotelsList = document.getElementById("hotelsList");
    if (!hotels || hotels.length === 0) {
        hotelsList.innerHTML = '<tr><td colspan="6" class="text-center">Keine Hotels gefunden</td></tr>';
        return;
    }
    hotelsList.innerHTML = hotels.map(hotel => `
        <tr>
            <td>${hotel.name}</td>
            <td>${hotel.ort}</td>
            <td>${hotel.sterne}</td>
            <td>${hotel.zimmerzahl}</td>
            <td>${hotel.preis} €</td>
            <td>
                <button class="btn btn-sm btn-primary me-1" onclick='showHotelForm(${JSON.stringify(hotel)})'>
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteHotel('${hotel._id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function filterHotels() {
    const filter = document.getElementById("hotelFilter").value.toUpperCase();
    const filtered = hotelsData.filter(hotel =>
        hotel.name.toUpperCase().includes(filter) ||
        hotel.ort.toUpperCase().includes(filter)
    );
    displayHotels(filtered);
}

function showHotelForm(hotel = null) {
    document.getElementById("hotelFormContainer").innerHTML = `
        <div class="card mt-4">
            <div class="card-header">
                <h5>${hotel ? 'Hotel bearbeiten' : 'Neues Hotel anlegen'}</h5>
            </div>
            <div class="card-body">
                <form id="hotelForm">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Name</label>
                            <input type="text" class="form-control" name="name" value="${hotel ? hotel.name : ''}" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Ort</label>
                            <input type="text" class="form-control" name="ort" value="${hotel ? hotel.ort : ''}" required>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <label class="form-label">Sterne</label>
                            <select class="form-select" name="sterne" required>
                                ${[1,2,3,4,5].map(i => `
                                    <option value="${i}" ${hotel && hotel.sterne == i ? 'selected' : ''}>${i}</option>
                                `).join('')}
                            </select>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label">Zimmerzahl</label>
                            <input type="number" class="form-control" name="zimmerzahl" value="${hotel ? hotel.zimmerzahl : ''}" min="1" required>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label">Preis pro Nacht (€)</label>
                            <input type="number" class="form-control" name="preis" value="${hotel ? hotel.preis : ''}" min="0" step="0.01" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Beschreibung</label>
                        <textarea class="form-control" name="beschreibung" rows="2">${hotel ? hotel.beschreibung || '' : ''}</textarea>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Bild URL</label>
                        <input type="url" class="form-control" name="bilder" value="${hotel && hotel.bilder && hotel.bilder.length > 0 ? hotel.bilder[0] : ''}">
                        <small class="form-text text-muted">URL zu einem Bild des Hotels</small>
                    </div>
                    <div class="d-flex justify-content-between">
                        <button type="button" class="btn btn-secondary" onclick="cancelForm()">Abbrechen</button>
                        <button type="submit" class="btn btn-primary">Speichern</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.getElementById("hotelForm").onsubmit = async function(e) {
        e.preventDefault();
        const formData = {
            name: this.name.value,
            ort: this.ort.value,
            sterne: parseInt(this.sterne.value),
            zimmerzahl: parseInt(this.zimmerzahl.value),
            preis: parseFloat(this.preis.value),
            beschreibung: this.beschreibung.value,
            bilder: this.bilder.value ? [this.bilder.value] : []
        };
        if (hotel && hotel._id) {
            await updateHotel({...formData, _id: hotel._id});
        } else {
            await createHotel(formData);
        }
    }
}

function cancelForm() {
    document.getElementById("hotelFormContainer").innerHTML = "";
}

function showStatusMessage(message, type = 'success') {
    const statusElement = document.getElementById("statusMessage");
    statusElement.textContent = message;
    statusElement.className = `alert alert-${type} mt-3`;
    setTimeout(() => {
        statusElement.className = 'alert d-none mt-3';
    }, 3000);
}

async function createHotel(hotelData) {
    try {
        const response = await fetch(`${API_BASE_URL}/hotels`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(hotelData),
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        showStatusMessage("Hotel erfolgreich erstellt");
        cancelForm();
        fetchHotels();
    } catch (error) {
        showStatusMessage(`Fehler beim Erstellen des Hotels: ${error.message}`, 'danger');
    }
}

async function updateHotel(hotelData) {
    try {
        const id = hotelData._id;
        delete hotelData._id;
        const response = await fetch(`${API_BASE_URL}/hotels/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(hotelData),
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        showStatusMessage("Hotel erfolgreich aktualisiert");
        cancelForm();
        fetchHotels();
    } catch (error) {
        showStatusMessage(`Fehler beim Aktualisieren des Hotels: ${error.message}`, 'danger');
    }
}

async function deleteHotel(id) {
    if (confirm("Hotel wirklich löschen?")) {
        try {
            const response = await fetch(`${API_BASE_URL}/hotels/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            showStatusMessage("Hotel erfolgreich gelöscht");
            fetchHotels();
        } catch (error) {
            showStatusMessage(`Fehler beim Löschen des Hotels: ${error.message}`, 'danger');
        }
    }
}

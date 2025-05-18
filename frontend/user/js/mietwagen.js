const CARS_API_BASE_URL = '/api';
let carsData = [];

document.addEventListener('DOMContentLoaded', () => {
    loadCars();
    document.getElementById('carFilter').addEventListener('keyup', filterCars);
    document.getElementById('getriebeFilter').addEventListener('change', filterCars);
    document.getElementById('versicherungFilter').addEventListener('change', filterCars);
    document.getElementById('sortOrderCars').addEventListener('change', filterCars);
});

async function loadCars() {
    try {
        const response = await fetch(`${CARS_API_BASE_URL}/cars`);
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


function displayCars(cars) {
    const container = document.getElementById('carCards');
    if (!cars || cars.length === 0) {
        container.innerHTML = `<div class="col-12 text-center">
            <div class="alert alert-info">Keine Mietwagen gefunden.</div>
        </div>`;
        return;
    }
    container.innerHTML = cars.map(car => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100">
                <div class="badge-price">${car.mietpreis_pro_24h} € / Tag</div>
                <img src="${car.bild_url && car.bild_url.length > 0 ? car.bild_url[0] : 'img/header_car.jpg'}" class="card-img-top" alt="${car.hersteller} ${car.modell}">
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
        </div>
    `).join('');
}

function formatVersicherung(versicherung) {
    if (versicherung === 'Vollkasko ohne Selbstbeteiligung') {
        return 'Vollkasko ohne Selbstbeteiligung';
    } else if (versicherung === 'Vollkasko mit 1000 Selbstbeteiligung') {
        return 'Vollkasko mit 1000 € Selbstbeteiligung';
    }
    return versicherung;
}

function showCarDetails(car) {
    const modalBody = document.getElementById('carModalBody');
    const modalTitle = document.getElementById('carModalLabel');
    
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
                </div>
                <div class="mt-4">
                    <div class="alert alert-info">
                        <i class="bi bi-info-circle"></i> Für Buchungen oder weitere Informationen kontaktieren Sie bitte direkt unser Serviceteam.
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const carModal = new bootstrap.Modal(document.getElementById('carModal'));
    carModal.show();
}

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

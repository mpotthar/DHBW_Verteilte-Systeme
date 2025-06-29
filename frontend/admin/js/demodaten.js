// Löscht alle Daten für einen bestimmten Service, iteriert über alle Einträge und lösche sie einzeln
async function clearAllDataForService(serviceName) {
    const response = await fetch(`/api/${getEndpointForService(serviceName)}`);
    if (!response.ok) {
        throw new Error(`Fehler beim Abrufen der Daten für ${serviceName}`);
    }
    const items = await response.json();

    let deleteSuccess = 0;
    let deleteErrors = [];
    for (const item of items) {
        try {
            const delResp = await fetch(
                `/api/${getEndpointForService(serviceName)}/${item._id}`,
                { method: "DELETE" }
            );
            if (!delResp.ok) {
                throw new Error(`Fehler beim Löschen von ${item._id}`);
            }
            deleteSuccess++;
        } catch (err) {
            deleteErrors.push(err.message);
        }
    }
    return {
        success: deleteErrors.length === 0,
        count: deleteSuccess,
        message: deleteErrors.length === 0
            ? "Alle Daten erfolgreich gelöscht."
            : `Fehler beim Löschen: ${deleteErrors.join(", ")}`
    };
}

// Funktion zum Erstellen von Demo-Daten für alle Services
async function createAllDemoData() {
    showStatus("Erstelle Demo-Daten für alle Services...", "info");
    
    const shouldClear = document.getElementById("clearExistingData").checked;
    const results = document.getElementById("demoDataResults");
    results.innerHTML = "";
    
    try {
        const services = [
            { name: 'hotels', title: 'Hotels', endpoint: '/api/hotels' },
            { name: 'reviews', title: 'Bewertungen', endpoint: '/api/reviews' },
            { name: 'flights', title: 'Flugverbindungen', endpoint: '/api/flights' },
            { name: 'cars', title: 'Mietwagen', endpoint: '/api/cars' }
        ];
        
        for (const service of services) {
            const serviceResult = await createDemoDataForService(service.name, shouldClear, false);
            results.innerHTML += createResultCard(service, serviceResult);
        }
        
        showStatus("Demo-Daten für alle Services erfolgreich erstellt!", "success");
    } catch (error) {
        showStatus(`Fehler: ${error.message}`, "danger");
    }
}

// Funktion zum Erstellen von Demo-Daten für einen bestimmten Service
// Input: serviceName - Name des Services
async function createDemoDataForService(serviceName, shouldClear = null, showResult = true) {
    if (shouldClear === null) {
        shouldClear = document.getElementById("clearExistingData").checked;
    }
    
    showStatus(`Erstelle Demo-Daten für ${serviceName}...`, "info");
    
    try {
        const demoData = getDemoDataForService(serviceName);
        
        // Lösche ggf. bestehende Daten
        if (shouldClear) {
            await clearAllDataForService(serviceName);
        }
        
        // Füge Demo-Daten EINZELN hinzu (statt als Array)
        let successCount = 0;
        let errors = [];
        
        // Jeden Eintrag einzeln senden
        for (const entry of demoData) {
            try {
                const response = await fetch(`/api/${getEndpointForService(serviceName)}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(entry) // Einzelnes Objekt statt Array
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                successCount++;
            } catch (err) {
                errors.push(err.message);
            }
        }
        
        // Erstelle ein Ergebnisreport
        const result = {
            success: errors.length === 0,
            count: successCount,
            message: errors.length === 0 
                ? "Demo-Daten erfolgreich erstellt." 
                : `Einige Einträge konnten nicht erstellt werden: ${errors.join(", ")}`
        };
        
        if (showResult) {
            showStatus(`Demo-Daten für ${serviceName} erfolgreich erstellt!`, errors.length === 0 ? "success" : "warning");
            document.getElementById("demoDataResults").innerHTML = 
                createResultCard({ name: serviceName, title: getTitleForService(serviceName) }, result);
        }
        
        return result;
    } catch (error) {
        const errorMsg = `Fehler beim Erstellen von Demo-Daten für ${serviceName}: ${error.message}`;
        if (showResult) {
            showStatus(errorMsg, "danger");
        }
        throw new Error(errorMsg);
    }
}

// Zeigt den Status der Demo-Daten-Erstellung an
// Input: message - Die anzuzeigende Nachricht, type - Typ der Nachricht ('success', 'danger', etc.)
function showStatus(message, type) {
    const statusElement = document.getElementById("demoDataStatus");
    statusElement.textContent = message;
    statusElement.className = `alert alert-${type}`;
}

// Erstellt eine Ergebnis-Karte für die Demo-Daten-Erstellung
function createResultCard(service, result) {
    return `
    <div class="col-md-6 col-lg-3 mb-3">
        <div class="card">
            <div class="card-header bg-light">
                <h5>${service.title}</h5>
            </div>
            <div class="card-body">
                <p><strong>Status:</strong> ${result.success ? 'Erfolgreich' : 'Fehler'}</p>
                <p><strong>Erstellte Einträge:</strong> ${result.count || 0}</p>
                ${result.message ? `<p><strong>Nachricht:</strong> ${result.message}</p>` : ''}
            </div>
        </div>
    </div>`;
}

// Hilfsfunktionen, um den Endpunkt und Titel für einen Service zu erhalten
// Input: serviceName - Name des Services
// Output: Endpunkt-Name oder Titel für den Service
// (Durch Anpassung der Namen nicht mehr erforderlich, nur zwecks Wartbarkeit.)
function getEndpointForService(serviceName) {
    switch(serviceName) {
        case 'hotels': return 'hotels';
        case 'reviews': return 'reviews';
        case 'flights': return 'flights';
        case 'cars': return 'cars';
        default: return serviceName;
    }
}

// Hilfsfunktion, um den Titel für einen Service zu erhalten
// Input: serviceName - Name des Services
// Output: Titel für den Service
function getTitleForService(serviceName) {
    switch(serviceName) {
        case 'hotels': return 'Hotels';
        case 'reviews': return 'Bewertungen';
        case 'flights': return 'Flugverbindungen';
        case 'cars': return 'Mietwagen';
        default: return serviceName;
    }
}

// Funktion, um Demo-Daten für einen bestimmten Service zu erhalten
// Input: serviceName - Name des Services
// Output: Array von Demo-Daten für den Service
function getDemoDataForService(serviceName) {
    switch(serviceName) {
        case 'hotels':
            return [
                {
                    name: "Seehotel Sonnenschein",
                    ort: "Hamburg",
                    sterne: 4,
                    zimmerzahl: 120,
                    preis: 99,
                    beschreibung: "Wunderschönes Hotel direkt an der Binnenalster mit Panoramablick.",
                    bilder: ["/img/demo/hotel_1.jpg"]
                },
                {
                    name: "Strandhotel Binz",
                    ort: "Rügen",
                    sterne: 5,
                    zimmerzahl: 150,
                    preis: 220,
                    beschreibung: "Luxuriöses Wellnesshotel in Binz auf Rügen in direkter Strandnähe mit Blick auf die Ostsee.",
                    bilder: ["/img/demo/hotel_2.jpg"]
                },
                {
                    name: "Stadthotel Zentrum",
                    ort: "München",
                    sterne: 3,
                    zimmerzahl: 65,
                    preis: 95,
                    beschreibung: "Zentral gelegenes Hotel in der Nähe aller wichtigen Sehenswürdigkeiten.",
                    bilder: ["/img/demo/hotel_3.jpg"]
                }
            ];
        
        case 'reviews':
            return [
                {
                    productID: "demodemodemo1",
                    nameRezensent: "Max Mustermann",
                    titel: "Toller Aufenthalt im Seehotel",
                    beschreibung: "Das Hotel übertraf alle Erwartungen. Der Service war ausgezeichnet und das Frühstück vielfältig. Ich würde jederzeit wiederkommen!",
                    sterne: 5,
                    dienstleistungsTyp: "hotel",
                    datum: new Date().toISOString()
                },
                {
                    productID: "demodemodemo2",
                    nameRezensent: "Mehmet Can",
                    titel: "Guter Flug, pünktliche Landung",
                    beschreibung: "Der Flug war angenehm, das Personal freundlich und wir sind pünktlich gelandet.",
                    sterne: 4,
                    dienstleistungsTyp: "flug",
                    datum: new Date().toISOString()
                },
                {
                    productID: "demodemodemo3",
                    nameRezensent: "Sabine Meyer",
                    titel: "Zuverlässiger Mietwagen",
                    beschreibung: "Die Abholung und Abgabe des Mietwagens verlief problemlos. Das Auto war in einem TOP Zustand.",
                    sterne: 5,
                    dienstleistungsTyp: "mietwagen",
                    datum: new Date().toISOString()
                }
            ];
        
        case 'flights':
            return [
                {
                    start: "Berlin",
                    ziel: "München",
                    abflug: new Date(2025, 6, 20, 8, 30).toISOString(),
                    ankunft: new Date(2025, 6, 20, 9, 45).toISOString(),
                    fluggesellschaft: "Lufthansa",
                    flugnummer: "LH2035",
                    preis: 129.99
                },
                {
                    start: "Frankfurt",
                    ziel: "Barcelona",
                    abflug: new Date(2025, 6, 21, 10, 15).toISOString(),
                    ankunft: new Date(2025, 6, 21, 12, 30).toISOString(),
                    fluggesellschaft: "Eurowings",
                    flugnummer: "EW1234",
                    preis: 89.99
                },
                {
                    start: "Hamburg",
                    ziel: "London",
                    abflug: new Date(2025, 6, 22, 14, 0).toISOString(),
                    ankunft: new Date(2025, 6, 22, 15, 20).toISOString(),
                    fluggesellschaft: "British Airways",
                    flugnummer: "BA2478",
                    preis: 159.99
                }
            ];
        
        case 'cars':
            return [
                {
                    typ: "PKW",
                    hersteller: "Volkswagen",
                    modell: "Golf 8",
                    sitzplaetze: 5,
                    getriebe: "Automatik",
                    versicherung: "Vollkasko ohne Selbstbeteiligung",
                    mietpreis_pro_24h: 59,
                    bild_url: "/img/demo/auto_1.jpg"
                },
                {
                    typ: "Transporter",
                    hersteller: "Mercedes",
                    modell: "Sprinter",
                    sitzplaetze: 3,
                    getriebe: "Manuell",
                    versicherung: "Vollkasko mit 1000 Selbstbeteiligung",
                    mietpreis_pro_24h: 89,
                    bild_url: "/img/demo/auto_2.jpg"
                },
                {
                    typ: "SUV",
                    hersteller: "Audi",
                    modell: "Q5",
                    sitzplaetze: 5,
                    getriebe: "Automatik",
                    versicherung: "Vollkasko ohne Selbstbeteiligung",
                    mietpreis_pro_24h: 119,
                    bild_url: "/img/demo/auto_3.jpg"
                }
            ];
        
        default:
            return [];
    }
}

# API-Referenz

## Inhalt

- [Bewertungs-Service (`/api/reviews`)](#bewertungs-service-apireviews)
    - [Alle Bewertungen abrufen](#alle-bewertungen-abrufen)
    - [Bewertung nach Produkt ID abrufen](#bewertung-nach-produkt-id-abrufen)
    - [Einzelne Bewertung abrufen](#einzelne-bewertung-abrufen)
    - [Neue Bewertung anlegen](#neue-bewertung-anlegen)
    - [Bewertung aktualisieren](#bewertung-aktualisieren)
    - [Bewertung löschen](#bewertung-löschen)
- [Hotel-Service (`/api/hotels`)](#hotel-service-apihotels)
    - [Alle Hotels abrufen](#alle-hotels-abrufen)
    - [Einzelnes Hotel abrufen](#einzelnes-hotel-abrufen)
    - [Neues Hotel anlegen](#neues-hotel-anlegen)
    - [Hotel aktualisieren](#hotel-aktualisieren)
    - [Hotel löschen](#hotel-löschen)
- [Flugverbindungs-Service (`/api/flights`)](#flugverbindungs-service-apiflights)
    - [Alle Flüge abrufen](#alle-flüge-abrufen)
    - [Einzelnen Flug abrufen](#einzelnen-flug-abrufen)
    - [Neuen Flug anlegen](#neuen-flug-anlegen)
    - [Flug aktualisieren](#flug-aktualisieren)
    - [Flug löschen](#flug-löschen)
- [Mietwagen-Service (`/api/cars`)](#mietwagen-service-apicars)
    - [Alle Mietwagen abrufen](#alle-mietwagen-abrufen)
    - [Einzelnen Mietwagen abrufen](#einzelnen-mietwagen-abrufen)
    - [Neuen Mietwagen anlegen](#neuen-mietwagen-anlegen)
    - [Mietwagen aktualisieren](#mietwagen-aktualisieren)
    - [Mietwagen löschen](#mietwagen-löschen)
- [Hinweise](#hinweise)

---

## Bewertungs-Service (`/api/reviews`)

### Alle Bewertungen abrufen
- **GET** `/api/reviews`
- **Beschreibung:** Gibt eine Liste aller Bewertungen zurück.

### Bewertung nach Produkt ID abrufen
- **GET** `/api/reviews/product/:productId`
- **Beschreibung:** Gibt alle Bewertungen zurück, die sich auf das Produkt mit der angegebenen ID beziehen.  

### Einzelne Bewertung abrufen
- **GET** `/api/reviews/:id`
- **Beschreibung:** Gibt die Bewertung mit der angegebenen ID zurück.

### Neue Bewertung anlegen
- **POST** `/api/reviews`
- **Body:**
```
{
    productID: "<ID/Fremdschlüssel hier>",
    nameRezensent: "Max Mustermann",
    titel: "Toller Aufenthalt im Seehotel",
    beschreibung: "Das Hotel übertraf alle Erwartungen. Der Service war ausgezeichnet und das Frühstück vielfältig. Ich würde jederzeit wiederkommen!",
    sterne: 5,
    dienstleistungsTyp: "hotel",
    datum: new Date().toISOString()
},
```
- **Beschreibung:** Legt eine neue Bewertung an.

### Bewertung aktualisieren
- **PUT** `/api/reviews/:id`
- **Body:** Wie POST
- **Beschreibung:** Aktualisiert die Bewertung mit der angegebenen ID.

### Bewertung löschen
- **DELETE** `/api/reviews/:id`
- **Beschreibung:** Löscht die Bewertung mit der angegebenen ID.

---

## Hotel-Service (`/api/hotels`)

### Alle Hotels abrufen
- **GET** `/api/hotels`
- **Beschreibung:** Gibt eine Liste aller Hotels zurück.

### Einzelnes Hotel abrufen
- **GET** `/api/hotels/:id`
- **Beschreibung:** Gibt das Hotel mit der angegebenen ID zurück.

### Neues Hotel anlegen
- **POST** `/api/hotels`
- **Body:**
```
{
    name: "Strandhotel Binz",
    ort: "Rügen",
    sterne: 5,
    zimmerzahl: 150,
    preis: 220,
    beschreibung: "Luxuriöses Wellnesshotel in Binz auf Rügen in direkter Strandnähe mit Blick auf die Ostsee.",
    bilder: ["/img/demo/hotel_2.jpg"]
}
```
- **Beschreibung:** Legt ein neues Hotel an.

### Hotel aktualisieren
- **PUT** `/api/hotels/:id`
- **Body:** Wie POST
- **Beschreibung:** Aktualisiert das Hotel mit der angegebenen ID.

### Hotel löschen
- **DELETE** `/api/hotels/:id`
- **Beschreibung:** Löscht das Hotel mit der angegebenen ID.

---

## Flugverbindungs-Service (`/api/flights`)

### Alle Flüge abrufen
- **GET** `/api/flights`
- **Beschreibung:** Gibt eine Liste aller Flüge zurück.

### Einzelnen Flug abrufen
- **GET** `/api/flights/:id`
- **Beschreibung:** Gibt den Flug mit der angegebenen ID zurück.

### Neuen Flug anlegen
- **POST** `/api/flights`
- **Body:**
```
{
    start: "Hamburg",
    ziel: "London",
    abflug: new Date(2025, 6, 22, 14, 0).toISOString(),
    ankunft: new Date(2025, 6, 22, 15, 20).toISOString(),
    fluggesellschaft: "British Airways",
    flugnummer: "BA2478",
    preis: 159.99
}
```
- **Beschreibung:** Legt einen neuen Flug an.

### Flug aktualisieren
- **PUT** `/api/flights/:id`
- **Body:** Wie POST
- **Beschreibung:** Aktualisiert den Flug mit der angegebenen ID.

### Flug löschen
- **DELETE** `/api/flights/:id`
- **Beschreibung:** Löscht den Flug mit der angegebenen ID.

---

## Mietwagen-Service (`/api/cars`)

### Alle Mietwagen abrufen
- **GET** `/api/cars`
- **Beschreibung:** Gibt eine Liste aller Mietwagen zurück.

### Einzelnen Mietwagen abrufen
- **GET** `/api/cars/:id`
- **Beschreibung:** Gibt den Mietwagen mit der angegebenen ID zurück.

### Neuen Mietwagen anlegen
- **POST** `/api/cars`
- **Body:**
```
{
    typ: "PKW",
    hersteller: "Volkswagen",
    modell: "Golf 8",
    sitzplaetze: 5,
    getriebe: "Automatik",
    versicherung: "Vollkasko ohne Selbstbeteiligung",
    mietpreis_pro_24h: 59,
    bild_url: "/img/demo/auto_1.jpg"
}
```
- **Beschreibung:** Legt einen neuen Mietwagen an.

### Mietwagen aktualisieren
- **PUT** `/api/cars/:id`
- **Body:** Wie POST
- **Beschreibung:** Aktualisiert den Mietwagen mit der angegebenen ID.

### Mietwagen löschen
- **DELETE** `/api/cars/:id`
- **Beschreibung:** Löscht den Mietwagen mit der angegebenen ID.

---

## Hinweise

- Alle Endpunkte liefern und akzeptieren JSON.
- Die IDs sind MongoDB-Objekt-IDs.
- Die APIs sind zustandslos (stateless).
- Fehler werden als JSON mit Statuscode und Fehlermeldung zurückgegeben.

---


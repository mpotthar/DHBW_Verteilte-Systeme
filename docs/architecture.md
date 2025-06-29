# Architektur

## Inhalt

- [Architekturdiagramm](#architekturdiagramm)
- [Komponenten und Aufgaben](#komponenten-und-aufgaben)
    - [Microservices](#microservices)
    - [Frontends](#frontends)
- [Kommunikationsmuster](#kommunikationsmuster)
- [Vorteile der Microservices-Architektur](#vorteile-der-microservices-architektur)
- [Technologien](#technologien)
- [Rollen und Rechte](#rollen-und-rechte)
- [Beispiel: API-Kommunikation](#beispiel-api-kommunikation)
- [Typische API-Routen (Beispiel Hotel-Service)](#typische-api-routen-beispiel-hotel-service)

---

## Architekturdiagramm
```mermaid
flowchart TD
subgraph Frontends
ADMIN[Admin Webfrontend CRUD]
USER[User Webfrontend Read-only]
end

text
subgraph Microservices
    BEWERTUNG[Bewertungs-Server]
    HOTEL[Hotel-Server]
    FLUG[Flugverbindung-Server]
    MIETWAGEN[Mietwagen-Server]
end

subgraph Datenbanken
    DB_B[DB Bewertung]
    DB_H[DB Hotel]
    DB_F[DB Flug]
    DB_M[DB Mietwagen]
end

ADMIN -- REST/API --> BEWERTUNG
ADMIN -- REST/API --> HOTEL
ADMIN -- REST/API --> FLUG
ADMIN -- REST/API --> MIETWAGEN

USER -- REST/API --> BEWERTUNG
USER -- REST/API --> HOTEL
USER -- REST/API --> FLUG
USER -- REST/API --> MIETWAGEN

BEWERTUNG --speichert/liest--> DB_B
HOTEL --speichert/liest--> DB_H
FLUG --speichert/liest--> DB_F
MIETWAGEN --speichert/liest--> DB_M
```

---

## Komponenten und Aufgaben

### Microservices

- **Bewertungs-Server**  
  Verwaltet Bewertungen zu Hotels, Flügen und Mietwagen.
- **Hotel-Server**  
  Verwaltung und Bereitstellung von Hotelinformationen.
- **Flugverbindung-Server**  
  Verwaltung und Bereitstellung von Flugverbindungen.
- **Mietwagen-Server**  
  Verwaltung und Bereitstellung von Mietwagenangeboten.

Jeder Microservice besitzt:
- Eine eigene, unabhängige MongoDB-Datenbank
- Eine REST-API für CRUD-Operationen 

### Frontends

- **Admin Webfrontend**
    - Kann alle CRUD-Operationen (Create, Read, Update, Delete) auf allen Microservices ausführen
    - Kommuniziert direkt mit den APIs der Microservices
    - Bootstrap-basiert (responsive)
- **User Webfrontend**
    - Kann Daten aus allen Microservices lesen (Read-only)
    - Kann Bewertungen zu Dienstleistungen vergeben
    - Kommuniziert direkt mit den APIs der Microservices
    - Bootstrap-basiert (responsive)

---

## Kommunikationsmuster

- **Lose Kopplung:**  
  Die Frontends kennen nur die API-Endpunkte, nicht die interne Implementierung der Microservices.
- **API-basierte Kommunikation:**  
  Alle Interaktionen laufen über HTTP-APIs (REST).
- **Keine direkte DB-Verbindung zwischen Services:**  
  Jeder Microservice verwaltet seine eigene Datenbank. Es findet kein direkter Zugriff auf die Datenbank eines anderen Microservices statt, stattdessen wird der entsprechende Microservice kontaktiert. Es wird ein Datenbankenserver verwendet (Ressourceneffizienz).

---

## Vorteile der Microservices-Architektur

| Vorteil                | Beschreibung                                                                 |
|------------------------|------------------------------------------------------------------------------|
| **Unabhängige Entwicklung** | Jeder Service kann separat entwickelt, getestet und deployt werden.         |
| **Fehlerisolierung**        | Fehler in einem Service betreffen die anderen nicht.                      |
| **Skalierbarkeit**          | Services können unabhängig voneinander skaliert werden.                   |
| **Technologievielfalt**     | Jeder Service kann mit unterschiedlichen Technologien realisiert werden.   |

---

## Technologien

- **Backend:**
    - ExpressJS (Node.js)
    - MongoDB
- **Frontend:**
    - Bootstrap (Responsive Design)
    - JS (für API-Calls und UI-Logik)
- **Containerisierung:**
    - Docker & Docker Compose
    - Nginx als zentraler Reverse Proxy

---

## Rollen und Rechte

- **User:**
    - R: Read
    - C: Create (ausschließlich Bewertungen, nicht Prüfungsanforderung)
- **Admin:**
    - CRUD: Create, Read, Update, Delete

---

## Beispiel: API-Kommunikation

Anlage eines Hotels im Admin Frontend

```mermaid
sequenceDiagram
participant AdminFrontend
participant HotelService
participant HotelDB

    AdminFrontend->>HotelService: POST /api/hotels (Hotel anlegen)
    HotelService->>HotelDB: Insert Hotel
    HotelDB-->>HotelService: Success/Fail
    HotelService-->>AdminFrontend: HTTP 201/400
    
    AdminFrontend->>HotelService: GET /api/hotels
    HotelService->>HotelDB: Find Hotels
    HotelDB-->>HotelService: Hotel-Liste
    HotelService-->>AdminFrontend: JSON Hotel-Liste
```

Anzeige aller Mietwagen im User Frontend (inkl. Abruf zugehöriger Bewertungen)

```mermaid
sequenceDiagram
participant UserFrontend
participant CarService
participant CarDB
participant ReviewService
participant ReviewDB

    UserFrontend->>CarService: GET /api/cars (Alle Mietwagen abrufen)
    CarService->>CarDB: Find Mietwagen
    CarDB-->>CarService: Mietwagen-Liste
    CarService-->>UserFrontend: JSON Mietwagen-Liste

    loop Für jeden Mietwagen
        UserFrontend->>ReviewService: GET /api/reviews/product/:carId (Bewertungen für Mietwagen abrufen)
        ReviewService->>ReviewDB: Find Bewertungen mit productID = carId
        ReviewDB-->>ReviewService: Bewertungen-Liste
        ReviewService-->>UserFrontend: JSON Bewertungen-Liste
    end
```

---

## Typische API-Routen (Beispiel Hotel-Service)

Weitere Details findest du in der [API-Dokumentation](/docs/api-reference.md).

| Methode | Route                | Beschreibung                 |
|---------|----------------------|------------------------------|
| GET     | /api/hotels          | Alle Hotels abrufen          |
| GET     | /api/hotels/:id      | Einzelnes Hotel abrufen      |
| POST    | /api/hotels          | Neues Hotel anlegen          |
| PUT     | /api/hotels/:id      | Hotel aktualisieren          |
| DELETE  | /api/hotels/:id      | Hotel löschen                |

---
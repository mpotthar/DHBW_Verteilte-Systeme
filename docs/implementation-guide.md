# Vorgehensweise bei der Umsetzung

## 1. Anforderungsanalyse und Architekturentwurf
- Sichten der Aufgabenstellung und Identifikation der Kernanforderungen:
    - Unabhängige Microservices für Bewertung, Hotel, Flug, Mietwagen
    - Zwei Frontends: Admin (CRUD) und User (Read-only)
    - Kommunikation ausschließlich über APIs
    - Dokumentationspflichten (Vorgehen, Architektur, Benutzer, Hosting)
- Skizzieren des Architekturdiagramms und Festlegung der Datenflüsse

## 2. Technologieauswahl und Initialisierung
- Auswahl der Technologien gemäß Vorgabe:
    - **Backend:** Node.js (ExpressJS)
    - **Datenbanken:** MongoDB (eine pro Microservice)
    - **Frontend:** Bootstrap (responsive), JS (Logik)
    - **Containerisierung:** Docker & Docker Compose, Nginx als Reverse Proxy
- Anlegen der Projektstruktur mit separaten Verzeichnissen für jeden Service und die beiden Frontends

## 3. Entwicklung der Microservices
- Implementierung der vier Microservices (Bewertung, Hotel, Flug, Mietwagen) mit jeweils eigener MongoDB-Anbindung und API
- Definition der Datenmodelle
- Implementierung der Endpunkte für CRUD-Operationen

## 4. Entwicklung der Frontends
- **Admin-Frontend:**
    - Entwicklung einer Oberfläche für das Anlegen, Bearbeiten, Löschen und Anzeigen von Daten
    - Implementierung der Demo-Daten-Funktionalität (Vordefinierte Daten in Datenbanken schreiben)
- **User-Frontend:**
    - Entwicklung einer übersichtlichen, read-only Oberfläche für Nutzer

## 5. Containerisierung und Orchestrierung
- Erstellung von Dockerfiles für alle Services und Frontends
- Aufbau einer gemeinsamen `docker-compose.yml` zur Orchestrierung:
    - Startreihenfolge für MongoDB und Services (`depends_on`-)
    - Nginx als Reverse Proxy für die Frontends und APIs
- Test des Gesamtsystems mit `docker compose up --build`

## 6. Test, Debugging und Optimierung
- Lokale Tests aller Endpunkte und UI-Funktionen
- Fehlerbehebungen
- Nachträgliche Implementierung der Bewertungsmöglichkeit für Dienstleistungen durch User
- Validierung der Datenmodelle und Demo-Daten

## 7. Dokumentation und Abgabe
- Erstellung der geforderten Dokumentationen:
    - Vorgehensweise (diese Datei)
    - Architektur (Diagramm, Beschreibung)
    - Benutzeranleitung (UI, Demo-Daten, Rollen)
    - Hosting-Vorschlag

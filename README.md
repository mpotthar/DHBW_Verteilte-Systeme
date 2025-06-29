# Mein Urlaub – Verteiltes Microservices-System

## Informationen zum Projekt

„Mein Urlaub“ ist ein verteiltes System, das aus mehreren unabhängigen Microservices besteht. Ziel ist es, Urlaubsangebote wie Hotels, Mietwagen, Flüge und Bewertungen modular, skalierbar und wartbar bereitzustellen. Zwei Webfrontends (Admin und User) ermöglichen die Verwaltung und Nutzung der Daten über APIs.

**Hinweis:**
- Weitere Details zu Architektur, Vorgehen, Benutzerführung und Hosting findest du in den jeweiligen [Dokumentationen](/docs/README.md) im Projekt.
---

## Features

- **Microservices-Architektur:** Bewertungs-, Hotel-, Flug- und Mietwagen-Server, jeweils mit eigener MongoDB
- **Admin Webfrontend:** Volle CRUD-Funktionalität für alle Angebote und Bewertungen
- **User Webfrontend:** Übersicht und Suche aller Angebote (Read-only), Erstellung von Bewertungen (create)
- **REST-APIs:** Klare und unabhängige Schnittstellen für alle Services
- **Demo-Daten:** Automatisches Befüllen aller Datenbanken über das Admin-Frontend
- **Docker Compose:** Einfaches Starten aller Komponenten mit einem Befehl, blitzschnelles Rollout
- **Responsive UI:** Bootstrap-basiertes, modernes Design
- **Keine Authentifizierung:** optional nachrüstbar, bisher keine Berechtigungsprüfung für Admin Webfrontend und API!
---

## Installation

1. **Voraussetzungen:**
  - [Docker](https://www.docker.com/get-started)
  - [Docker Compose](https://docs.docker.com/compose/install/)

2. **Projekt klonen:**
```
git clone <REPO-URL>
cd <projektverzeichnis>
```

3. **Container bauen und starten:**  
```
docker compose up --build
```
oder im Hintergrund:
```
docker compose up -d
```

4. **Zugriff auf die Webfrontends:**
- **Admin-Frontend:** [http://localhost/admin/](http://localhost/admin/)
- **User-Frontend:** [http://localhost/](http://localhost/)

5. **Container stoppen:**
```
docker compose down
```

---

## Technologie-Stack

- **Backend:** Express.JS, Node.JS
- **Frontend:** HTML, CSS, JavaScript, Bootstrap
- **Datenbanken:** MongoDB (je Microservice eine Datenbank, eine Instanz von MongoDB für alle Datenbanken)
- **API:** REST (JSON)
- **Reverse Proxy:** Nginx
- **Containerisierung:** Docker, Docker Compose

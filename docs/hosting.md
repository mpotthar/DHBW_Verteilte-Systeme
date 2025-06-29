# Hosting-Vorschlag

## Inhalt

- [Lokales Hosting](#lokales-hosting)
- [Cloud/PaaS-Vorschlag](#cloudpaas-vorschlag)
- [Empfehlung](#empfehlung)

---

## Lokales Hosting

- Docker Compose orchestriert alle Services und Datenbanken lokal
- Voraussetzung: Docker & Docker Compose installiert
- Hosting kann auch auf IaaS (VPS/Root-Server) mit installiertem Hostbetriebssystem und den in den Anforderungen beschriebenen Docker, Docker Compose erfolgen.

---

## Cloud/PaaS-Vorschlag

| Anbieter      | Service-Typ     | Preis (ca.)                      | Hinweise                        |
|---------------|-----------------|----------------------------------|---------------------------------|
| Heroku        | Container       | ab 5 US$/Monat                   | Einfaches Deployment, Free Tier |
| Render        | Web Service     | ab 0 US$/Monat + Compute Kosten  | Docker-Support                  |
| MongoDB Atlas | DB as a Service | ab 0 US$/Monat                   | Externe Datenbank möglich       |

- Alle Microservices können als einzelne Container/Apps deployed werden.
- MongoDB kann als Managed Service (z.B. Atlas) genutzt werden.
- Nginx als Reverse Proxy für Routing und SSL.

---

## Empfehlung

Für die Präsentation und Entwicklung reicht Docker Compose lokal aus. Für produktive Nutzung empfiehlt sich ein PaaS-Anbieter oder eine in der Cloud betriebene virtuelle Maschine mit eigenem Docker Stack.

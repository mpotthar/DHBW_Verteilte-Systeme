# Benutzerhandbuch

## Inhalt

- [Admin Webfrontend](#admin-webfrontend)
- [User Webfrontend](#user-webfrontend)
- [Demo-Daten](#demo-daten)
- [Hinweise](#hinweise)

---

## Admin Webfrontend

- Erreichbar unter: http://localhost/admin/
- Funktionen:
    - Hotels, Bewertungen, Flüge, Mietwagen anzeigen, erstellen, bearbeiten, löschen
    - Demo-Daten für alle Services generieren
    - Übersichtliche Navigation und Statusanzeigen

---

## User Webfrontend

- Erreichbar unter: http://localhost/
- Funktionen:
    - Alle Angebote und Bewertungen einsehen (Read-only)
    - Filter-, Such- und Sortierfunktionen
    - Keine Erstell-, Bearbeitungs- oder Löschfunktionen, außer Bewertungen können erstellt werden

---

## Demo-Daten
- Erreichbar unter: http://localhost/admin/demodaten.html
- Funktionen:
    - Erstellung von Demoeinträgen (3 Dienstleistungen pro Kategorie, je 1 Bewertung pro Kategorie)
    - Wahlweise Löschung von bestehenden Einträgen
    - Wahlweise Erstellung für alle Services oder einzelne Services
- Hinweise:    
    - Dienstleistung muss der Demo-Bewertung nachträglich hinzugefügt werden (Aufruf Bewertungen-Seite, Bearbeitung der Einträge)

---

## Hinweise
- Die Bedienung erfolgt per Weboberfläche (Bootstrap-basiert)
- Es ist keine Authentifizierung notwendig. Jeder mit Zugriff auf ``/admin`` kann Daten anlegen, ändern, löschen! Dies ist insbesondere bei Veröffentlichung zu berücksichtigen.
- Microservices nehmen keine Berechtigungsprüfung vor. Jeder mit Zugriff auf die API kann Änderungen vornehmen!
- Fehler und Status werden direkt in der UI angezeigt. Beachte auch die Console.
- Sollte ein Abruf von außen erwünscht sein, ist der entsprechende Port in der Firewall des Hosts freizugeben. Außerdem ist die IP-Adresse des Geräts anstelle von localhost zu verwenden.
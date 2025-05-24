# Benutzerhandbuch

## Inhalt

- [Admin Webfrontend](#admin-webfrontend)
- [User Webfrontend](#user-webfrontend)
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
    - Keine Erstell-, Bearbeitungs- oder Löschfunktionen

---

## Hinweise
- Die Bedienung erfolgt per Weboberfläche (Bootstrap-basiert)
- Es ist keine Authentifizierung notwendig. Jeder mit Zugriff auf ``/admin`` kann Daten anlegen, ändern, löschen!
- Fehler und Status werden direkt in der UI angezeigt
- Sollte ein Abruf von außen erwünscht sein, ist der entsprechende Port in der Firewall des Hosts freizugeben. Außerdem ist die IP-Adresse des Geräts anstelle von localhost zu verwenden.
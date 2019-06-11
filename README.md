# M183 LB3
_Von Janik Kämpfer & Benjamin Wolf_

Dieses Projekt wurde im Rahmen des Moduls 183 als unsere Lösung für die LB3 entwickelt.
Es handlet sich um eine einfache Applikation, welche die im Unterricht vorgegebene Anforderungen erfüllen sollte.

Die benutzten Technologien sind folgend aufgelistet:
- Server: Application Cloud von Swisscom (PAAS basierend auf CloudFoundry)
- Sprache: Node.js (Expressjs & Pug als template engine)
- Persistenz: in-memory DB (SQLite3)
- GUI: Browser (Chrome, ...)

## Projekt setup

Die Abhängingkeiten müssen wie folgend beschrieben installiert sein:

### Abhängigkeiten installieren

```
yarn
```

### Applikation starten

Startet die Applikation auf: http://localhost:3000/

```
yarn serve
```

### Applikation einführen

```
cf push
```

Mehr informationen: https://docs.cloudfoundry.org/devguide/deploy-apps/deploy-app.html
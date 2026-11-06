# demo-watch

Geplante Prüfläufe für die Demos auf [sebastianhanisch.net](https://sebastianhanisch.net). Das Repo ist öffentlich, weil die
GitHub-Actions-Minuten dort kostenlos sind; es enthält keinen eigenen Code. Alles wird aus dem (privaten) Website-Repo hierher kopiert
(`python tools/sync_watch_repo.py`), Änderungen bitte dort machen.

| Workflow | Zeitplan | Was er tut |
|---|---|---|
| `keep-alive.yml` | alle 4 Stunden | Öffnet jede Streamlit-Demo in einem echten Headless-Browser, damit sie nicht einschläft, und meldet Apps, die zwar laden, aber im Skript abgestürzt sind. Die Adressen liest der Lauf von `demos.html` und `suche-index.json` der Website. Dauert 2 bis 3,5 Stunden, wenn viele Demos schlafen. Sicherheitsnetz neben `wake-sleepers.yml`. |
| `wake-sleepers.yml` | Schleife: ein Lauf arbeitet 4,5 Stunden alle 5 Minuten (nach einem Durchgang mit Schlafenden alle 2) und startet den nächsten selbst; stündlicher Zeitplan als Reserve | Fragt je Demo den Health-Endpunkt ab (`/~/+/_stcore/health`: 200 wach, 400 schläft, weckt nichts) und besucht nur die schlafenden im Browser (`KEEP_ALIVE_ONLY_ASLEEP=1`). Grund: die Cloud lässt Demos in Wellen (meist etwa 4,4 Stunden nach dem Wecken) wieder einschlafen, auch wenn der große Lauf sie dazwischen besucht hat (Messungen 2026-11-05/06); 8 gleichzeitige Besuche (`KEEP_ALIVE_CONCURRENCY`) holen eine Welle in wenigen Minuten zurück. Eigenes Issue, eigene Concurrency-Gruppe. GitHub startet geplante Läufe unzuverlässig (2026-11-05: sieben Stunden keiner), daher die selbstfortsetzende Kette (`gh workflow run`, `actions: write`). Anhalten: Workflow deaktivieren. |
| `python-canary.yml` | wöchentlich | Führt die Tests einiger kleiner Sentinel-Demos auf neueren Python-Versionen (3.13, 3.14) aus, um Versionsdrift früh zu sehen. |

Ein Fehlschlag legt ein Issue an (nur eines je Fehlerbild); es schließt sich, sobald ein Lauf wieder grün ist.

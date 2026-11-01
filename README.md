# demo-watch

Geplante Prüfläufe für die Demos auf [sebastianhanisch.net](https://sebastianhanisch.net). Das Repo ist öffentlich, weil die
GitHub-Actions-Minuten dort kostenlos sind; es enthält keinen eigenen Code. Alles wird aus dem (privaten) Website-Repo hierher kopiert
(`python tools/sync_watch_repo.py`), Änderungen bitte dort machen.

| Workflow | Zeitplan | Was er tut |
|---|---|---|
| `keep-alive.yml` | alle 6 Stunden | Öffnet jede Streamlit-Demo in einem echten Headless-Browser, damit sie nicht einschläft, und meldet Apps, die zwar laden, aber im Skript abgestürzt sind. Die Adressen liest der Lauf von `demos.html` und `suche-index.json` der Website. |
| `python-canary.yml` | wöchentlich | Führt die Tests einiger kleiner Sentinel-Demos auf neueren Python-Versionen (3.13, 3.14) aus, um Versionsdrift früh zu sehen. |

Ein Fehlschlag legt ein Issue an (nur eines je Fehlerbild); es schließt sich, sobald ein Lauf wieder grün ist.

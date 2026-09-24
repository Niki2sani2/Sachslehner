# Website von Doris und Walter Sachslehner

Diese statische Website kann direkt mit GitHub Pages veröffentlicht werden. Der Shop und ein vorbereiteter Owner-Bereich sind enthalten.

## Website auf GitHub Pages veröffentlichen

1. Dieses ZIP auf dem Computer entpacken.
2. Auf GitHub ein neues **öffentliches** Repository mit dem Namen `sachslehner-website` anlegen.
3. Im Repository **Add file → Upload files** wählen.
4. Den gesamten **Inhalt des entpackten Ordners** hochladen: `index.html`, `assets`, `data`, `shop`, `admin`, `.nojekyll` und diese README-Datei.
5. Unter **Settings → Pages** bei **Build and deployment** die Option **Deploy from a branch** wählen.
6. Branch **main** und Ordner **/(root)** auswählen und speichern.

Nach einigen Minuten ist die Seite erreichbar unter:

`https://DEIN-BENUTZERNAME.github.io/sachslehner-website/`

GitHub entpackt eine hochgeladene ZIP-Datei nicht automatisch. Deshalb zuerst lokal entpacken und dann den Inhalt hochladen.

## Owner-Bereich für Fotos und Anzeigen

Der Editor befindet sich danach unter:

`https://DEIN-BENUTZERNAME.github.io/sachslehner-website/admin/`

Vor der ersten Anmeldung in `admin/config.yml` diese Zeile anpassen:

`repo: GITHUB-BENUTZERNAME/sachslehner-website`

`GITHUB-BENUTZERNAME` durch den eigenen GitHub-Namen ersetzen. Danach im Owner-Bereich **Sign in with Token** wählen. Der Assistent von Sveltia CMS führt zur Erstellung eines GitHub-Zugriffstokens. Das Token nur für dieses Repository freigeben und ausschließlich die Berechtigung **Contents: Read and write** erteilen. Das Token niemals in eine Datei oder Nachricht einfügen; es wird nur im eigenen Browser gespeichert.

Im Editor können anschließend Anzeigen hinzugefügt, ausgeblendet, umsortiert und mit neuen Fotos versehen werden. Hochgeladene HEIC-Fotos werden automatisch als platzsparende WebP-Bilder gespeichert.

Für einen bequemeren Knopf **Mit GitHub anmelden** kann später kostenlos ein OAuth-Login ergänzt werden. Dafür werden der endgültige Repository-Link und einmalig ein kleiner Cloudflare-Worker benötigt.

# AJI su WhatsApp – prototipo MILO

Prototipo realizzato da **One Tech S.r.l.** per **AJI Milano**: mostra come un cliente può ordinare su WhatsApp con MILO, l’assistente digitale di One Tech, dal tocco sul sito fino alla consegna.

> Uso riservato. Il prototipo contiene il menu e una foto di AJI, usati solo a scopo dimostrativo. Tutti i dati dei clienti (Giulia Rossi, indirizzi, codici) sono di esempio.

## Cosa contiene

| File | A cosa serve |
| --- | --- |
| `index.html` | La demo completa: sito simulato, chat WhatsApp, catalogo, scheda cliente e pannello “dietro le quinte”. |
| `worker/worker.js` | Server opzionale che collega MILO all’intelligenza artificiale, tenendo nascosta la chiave API. |
| `worker/wrangler.toml` | Configurazione del server su Cloudflare Workers. |

## Due modalità

- **Modalità demo (predefinita).** Funziona subito, senza server e senza costi. MILO segue un percorso guidato: capisce pulsanti, codici, indirizzi, nomi dei piatti e risposte brevi. È la modalità consigliata per mostrare il flusso a un cliente.
- **Modalità MILO dal vivo.** MILO risponde a qualsiasi messaggio in linguaggio naturale tramite l’API di Anthropic. Richiede il server in `worker/` e una chiave API.

## 1. Pubblicare la demo su GitHub Pages

1. Crea un nuovo repository su GitHub, per esempio `aji-milo-demo`, e carica tutti i file di questa cartella (anche `.nojekyll`).
2. Vai su **Settings → Pages**.
3. In **Build and deployment** scegli **Deploy from a branch**, branch `main`, cartella `/ (root)`, e salva.
4. Dopo uno o due minuti la demo è online su `https://NOME-UTENTE.github.io/aji-milo-demo/`.

Note:
- Con un account GitHub gratuito, GitHub Pages funziona solo con repository **pubblici**. Per un repository privato serve un piano a pagamento (GitHub Pro o Team). Verifica le condizioni attuali su https://docs.github.com/pages.
- La pagina contiene il tag `noindex`: i motori di ricerca non la indicizzano, ma chiunque abbia il link può aprirla.

## 2. (Opzionale) Attivare MILO dal vivo

Serve un account Cloudflare gratuito e una chiave API di Anthropic (https://console.anthropic.com). Documentazione dell’API: https://docs.claude.com/en/api/overview.

1. Installa Node.js, poi apri un terminale nella cartella `worker/`.
2. In `wrangler.toml` sostituisci `ALLOWED_ORIGIN` con l’indirizzo della tua pagina GitHub, **senza percorso e senza barra finale**, per esempio `https://onetech.github.io`.
3. Accedi a Cloudflare e salva la chiave come segreto:
   ```bash
   npx wrangler login
   npx wrangler secret put ANTHROPIC_API_KEY
   ```
4. Pubblica il server:
   ```bash
   npx wrangler deploy
   ```
   Il comando restituisce un indirizzo simile a `https://aji-milo.NOME.workers.dev`.
5. In `index.html` cerca la riga
   ```js
   const MILO_ENDPOINT="";
   ```
   e inserisci l’indirizzo del server, poi ricarica il file su GitHub:
   ```js
   const MILO_ENDPOINT="https://aji-milo.NOME.workers.dev";
   ```

### Sicurezza e costi

- La chiave API resta solo su Cloudflare: non scriverla mai in `index.html` né in altri file del repository.
- Il server accetta richieste solo dall’indirizzo in `ALLOWED_ORIGIN` e limita la lunghezza dei messaggi.
- Ogni messaggio a MILO consuma crediti dell’API di Anthropic. Imposta un limite di spesa nella console Anthropic e disattiva il server (`npx wrangler delete`) quando la demo non serve più.
- Il modello è configurabile in `wrangler.toml` (`MODEL`).

## Cosa si può provare

- Partenza dal sito di AJI con il pulsante “Ordina su WhatsApp” o dal pulsante di un piatto.
- Cliente con account sul sito (verifica con codice via email; codice demo `482913`) o cliente nuovo con creazione della scheda in chat.
- Indirizzo scritto e verificato, anche fuori zona; scelta dell’orario dagli slot liberi.
- Catalogo con tutto il menu di AJI, consigli con schede prodotto, regole del menu (bento solo a pranzo, alcolici, gift card).
- Riepilogo, fattura con modulo, pagamento con carta o contanti, aggiornamenti di consegna.

---

One Tech S.r.l. · Milano · https://www.otech.one

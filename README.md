# AJI su WhatsApp – prototipo MILO

Prototipo realizzato da **One Tech S.r.l.** per **AJI Milano**: mostra come un cliente può ordinare su WhatsApp con MILO, l’assistente digitale di One Tech, dal tocco sul sito fino alla consegna.

> Uso riservato. Il prototipo contiene il menu e una foto di AJI, usati solo a scopo dimostrativo. Tutti i dati dei clienti (Giulia Rossi, indirizzi) e gli allergeni dei piatti sono di esempio.

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
- **Accesso senza email e senza codice.** L’account si crea in automatico associando nome e cognome al numero di telefono. Se il numero è già registrato (scenario “Numero già registrato”), l’account è già pronto e MILO propone l’indirizzo salvato.
- **Cliente nuovo**, nell’ordine indicato nelle note privacy: informativa con link (presa visione, non consenso) → nome e cognome → indirizzo verificato, anche fuori zona → ulteriori informazioni per la consegna → promozioni WhatsApp facoltative (Sì/No, nessuna scelta predefinita, revocabili scrivendo STOP) → orario dalla lista.
- **Allergie e intolleranze.** Domanda prima del menu; se il cliente ne ha, MILO chiede il consenso esplicito e poi mostra la tabella dei 14 allergeni da selezionare. I dati valgono solo per l’ordine in corso e non vengono salvati nel profilo. Catalogo, consigli e schede prodotto nascondono i piatti con gli allergeni selezionati; ogni piatto mostra la sua etichetta allergeni.
- Catalogo con tutto il menu di AJI, consigli con schede prodotto, regole del menu (bento solo a pranzo, alcolici, gift card).
- Riepilogo, fattura con modulo, pagamento con carta online o contanti (con “Quanto ti serve di resto?”), aggiornamenti di consegna.
- **Dopo la consegna:** valutazione con le stelline da 1 a 5 e pulsante “Ordina di nuovo”, che ricarica il carrello precedente e riparte da orario e allergie.

> **Allergeni di esempio.** Le etichette allergeni dei piatti (`ALG` in `index.html`) sono state dedotte da nomi e descrizioni del menu solo per la demo. Vanno sostituite con le schede allergeni ufficiali di AJI prima di qualsiasi uso reale.

---

One Tech S.r.l. · Milano · https://www.otech.one

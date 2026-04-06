# MailAgent — Istruzioni di installazione

## Cosa hai in questa cartella
Un'app Next.js pronta da pubblicare su Vercel. Una volta online, la apri da Safari su iPhone come un normale sito web.

## Passi per pubblicare

### 1. Carica il codice su GitHub
1. Vai su github.com (sei già loggato)
2. Clicca il "+" in alto a destra → "New repository"
3. Nome: `mailagent` — lascia tutto il resto com'è — clicca "Create repository"
4. Nella pagina vuota che appare, clicca "uploading an existing file"
5. Trascina TUTTA la cartella `mailagent` nella finestra
6. Clicca "Commit changes"

### 2. Pubblica su Vercel
1. Vai su vercel.com (sei già loggato)
2. Clicca "Add New Project"
3. Seleziona il repository `mailagent` che hai appena creato
4. Clicca "Deploy" — aspetta 1-2 minuti

### 3. Aggiungi la tua chiave API
1. Nella dashboard Vercel, vai su "Settings" → "Environment Variables"
2. Name: `ANTHROPIC_API_KEY`
3. Value: incolla la tua chiave `sk-ant-...`
4. Clicca "Save"
5. Vai su "Deployments" → clicca i tre puntini → "Redeploy"

### 4. Apri su iPhone
1. Copia il link `.vercel.app` che Vercel ti ha dato
2. Aprilo in Safari su iPhone
3. Tocca il pulsante "Condividi" → "Aggiungi a schermata Home"
4. Ora hai l'icona dell'app sulla schermata home 🎉

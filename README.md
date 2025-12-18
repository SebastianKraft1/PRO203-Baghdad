# PRO203-Baghdad

Eksamensprosjekt i PRO203 - Smidig prosjekt ved Høyskolen Kristiania

SafeDrop er en mobilapplikasjon for registrering av levering og henting av barn i barnehagen.

## Kom i gang

### Krav

- Node.js
- Git
- Xcode (macOs, for iOS) eler Android Studio (for Android)
- Visual Studio Code (anbefalt)

### Installasjon

**1. Klon repositoriet**

```bash
git clone https://github.com/SebastianKraft1/PRO203-Baghdad.git
cd PG203-Baghdad
```

## Installer nødvendige avhengigheter etter dere har klonet eller pullet

```bash
npm install
```

**3. Firebase-konfigurasjon**

- Kopier `firebaseEnv.js` (fra innleveringsmappen) til prosjektets rotmappe

**4. Bygg native kode**

```bash
npx expo prebuild
```

**5. Kjør appen**

```bash
npm run ios # For iOS Simulator (anbefalt)
npm run android # For Android Simulator
```

## Teknologi

- **Frontend:** React Native med TypeScript
- **Plattform:** Expo
- **Backend:** Firebase (Authentication & Firestore)
- **IDE:** Visual Studio Code

## Funksjoner

- Sikker innlogging (Google, Apple, e-post)
- Inn- og utsjekk av barn
- Historikk
- Personlige profilsider
- Kalender for aktiviteter
- Lagt til rette for flerspråklig støtte (for fremtidig utvikling)
- Mørk/lys modus

### For utviklere (branching strategi)

Vi skal holde main-branchen så ren som mulig. Alle endringer, feuatures, fixes skal gjøres i egne brancher.

**Lag egen feature-branch for din oppgave eller komponent:**

```bash
git checkout -b feature/<beskrivende-navn>
```

**Jobb lokalt, legg tl endringer og commit med beskrivende melding:**

```bash
git add .
git commit -m "Kort beskrivelse av endringen"
```

**Push branchen til GitHub:**

```bash
git push origin feature/<beskrivende-navn>
```

**Pull Request:** Lag PR på GitHub for godkjenning før merge.

### Branch-kategorier

- `feature/` - Ny funksjonalitet (eks: `feature/login-form`)
- `fix/` eller `bugfix/` - Feilrettinger (eks: `fix/button-color`)

### Synkroniser med main

```bash
git checkout main
git pull origin main
git checkout feature/<din branch>
git rebase main
```

### Tips

- ALDRI push direkte til `main`
- Hold commits små og beskrivende
- Pull ofte for å unngå konflikter
- Test før du lager PR

---

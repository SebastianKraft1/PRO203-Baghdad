# PRO203-Baghdad
Repo for eksamen i PRO203, inneholder frontend koden til eksamensprosjektet vårt. 

Anbefaler alle å prøve å bruke `git` da dette er industristandard for versjonshåndtering, og noe dere <b>GARANTERT</b> kommer til å måtte bruke senere på studiet, og karriæren.

Som alltid, husk å kjøre
```bash
npm install
```
Etter at dere har forket, klonet eller pullet.

## Kom i gang 
Klon repoet ti let passende sted på maskinen din 
```bash
git clone https://github.com/SebastianKraft1/PG203-Baghdad.git
cd PG203-Baghdad
```

## Installer nødvemdige avhengigheter etter dere har klonet eller pullet
```bash
npm install
```

## Branching strategi
Vi skal holde main-branchen så ren som mulig. Alle endringer, feuatures, fixes skal gjøres i egne brancher. 

Kategorier for brancher
feature/
	•	Ny funksjonalitet eller komponenter i appen.
	•	Eksempel: feature/login-form, feature/user-profile.

fix/ eller bugfix/
	•	Små feilrettinger eller korrigeringer.
	•	Eksempel: fix/button-color, bugfix/missing-data.

1. Lag egen feature-branch for din oppgave eller komponent
```bash
git checkout -b feature/<beskrivende-navn>
```
2. Jobb lokalt, legg tl endringer og commit med beskrivende melding.
```bash
git add .
git commit -m "Kort beskrivelse av endringen"
```
3. Push branchen til repoet
```bash
git push origin feature/<beskrivende-navn>
```
4. Når du er ferdig med oppgaven -> lag en PR (Pull request) inne på github. Dne må godkjennes før den merges

## Oppdatere branchen med ny kode fra main
Når repoet oppdateres med nye commits:
git checkout main
git pull origin main
git checkout feature/<din branch>
git rebase main

Dette holder din branch oppdatert og reduserer merge-konflikter.

## Tips
- ALDRI push direkte eller jobb direkte på main.
- Hold commits små og beskrivende
- Pull ofte slik at vi unngår konlikter. Når du er ferdig med en oppgave -> synkroniser med Main før du lager PR + Test før du lager PR

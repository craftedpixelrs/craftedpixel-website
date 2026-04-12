# Isporuke klijentu - šta tačno isporučiti po paketu (CraftedPixel)

Interni vodič: šta mora biti **eksplicitno u SOW-u**, šta **fizički predati** na kraju, i gde su **granice** (van opsega). Cene ispod su **polazne tačke** sa sajta; konačna cena i opseg uvek iz **Statement of Work (SOW)**.

---

## 1. Šta uvek isporučuješ (pre bilo kog paketa)

### Pre početka naplativog rada

- **Pisani predlog + SOW** (na engleskom, kako je definisano u procesu): opseg, milestone-i, **deliverables**, cena, raspored plaćanja, prozor starta.
- **Jasno naznačeno šta NIJE u opsegu** (integracije, compliance, dodatni jezici, itd.) da procurement ne nagađa.
- **Potpisan SOW + depozit + pristup** (repozitorijumi, Figma, CMS, nalog na hostingu, itd.) pre kickoff-a.
- **Uslovi uspeha za milestone** (ciljna publika, ograničenja, reference) - kritično za politiku prve revizije.

### Tokom i na kraju angažmana

- **Handoff beleške**: šta je predato, gde živi (Figma, repo, CMS), licence trećih strana (fontovi, stock, biblioteke).
- **Runbook / README** gde je u paketu predviđeno (nivo zavisi od paketa).
- **Obuka urednika / radionica** gde je uključena.

### Politike koje moraju biti usklađene sa SOW-om

- **Kadenca prvog dizajn čekpointa**: za većinu UI/UX sprint angažmana cilj je **prvi deljivi dizajn review za 8–12 radnih dana** od kickoff-a (uz potpisan SOW, depozit, pristup, dogovoren brief). Audit / „snapshot“ paketi mogu brže; pravni / procurement ciklusi sporije - **tačan prozor upisati u SOW**.
- **Prva runda revizije**: ako prvi milestone ne ispunjava **kriterijume uspeha iz SOW-a**, **jedna revizija tog milestone-a bez dodatnog naplate**, pre sledeće naplative runde. Promena ciljeva usred rada = **change order**.
- **Post-launch podrška**: paketi na sajtu uključuju **ograničen prozor** za bugfix-e, sitne izmene i monitoring lansiranja. **Nove funkcije, kampanje, veliki CMS rework** = change order ili novi SOW.
- **IP**: nakon plaćanja za rad iz SOW-a, klijent **vlasnik deliverables-a** (dizajn, kod, dokumentacija), osim ako nije drugačije dogovoreno; font/stock/biblioteke ostaju pod svojim licencama - **navesti u handoff beleškama**.

---

## 2. Nivoi paketa (šabloni)

Kroz sve usluge važi redosled: **Essentials → Growth → Scale → Partner**.

| Nivo       | Namena |
|-----------|--------|
| Essentials | Ulazni, fokusiran opseg |
| Growth     | Najčešći izbor; puniji „core“ |
| Scale      | Veća površina, dubina, QA |
| Partner    | Retainer / program / custom kapacitet |

---

## 3. UI/UX

### Essentials - **UX audit** (~$4,050 / fiksno)

**Kartica (kratko):** do 15 ključnih ekrana / tokova; heuristika + pristupačnost; pisan izveštaj; 60 min readout.

**Detaljnije isporuke:**

- Heuristički i konzistentnost pregled (do ~15 primarnih ekrana/tokova; **nije pun WCAG audit**).
- Pisan dokument sa nalazima i **matricom ozbiljnosti** (bloker / major / minor), trake napora, redosled trijaža.
- **60-min prezentacija nalaza** + async pojašnjenja (readout + Q&A; nisu strukturisane „revision rounds“ kao kod Growth+).

**Nije u paketu:** user flow-ovi / IA kao dizajn rad; wireframe-i; klikabilni prototip; hi-fi UI; design tokeni / pun dev handoff; design QA na stagingu; moderisano istraživanje.

---

### Growth - **Flow sprint** (~$10,800 / sprint)

**Kartica:** low-fi žice + interaktivni prototip; mobile i desktop ključni state-ovi; 2 strukturisane runde revizije; opcioni moderisani test blok.

**Detaljnije isporuke:**

- User flow-ovi i **IA** za tokove u opsegu.
- **Wireframe-i i klikabilni prototip** (Figma ili dogovoreni alat) - za usklađivanje i estimaciju inženjera, ne finalni vizuelni dizajn.
- **Pristupačnost-orijentisan prolaz** (praktične provere).
- Prazna / loading / error stanja za **ključne ekrane**.
- **2 strukturisane runde** povratnih informacija.
- **Hi-fi UI**: označeno kao **add-on** na sajtu (nije default u sprint kartici).
- **Design tokeni / dev handoff**: „light specs“ u odnosu na Scale.
- **Moderisano testiranje**: **add-on** (npr. blok od 5 korisnika).
- Komunikacija: **sprint standup-i** (ne pun Partner Slack + pool).

---

### Scale - **Surface overhaul** (~$27,000 / projekat)

**Kartica:** IA + Figma UI kit za dogovoreni isečak; empty/loading/error; tokeni, specifikacije, dev handoff; design QA na stagingu (2 prolaza).

**Detaljnije isporuke:**

- **Hi-fi UI i komponentni obrasci** za dogovoreni produkt isečak.
- **Design tokeni i dev handoff** (strukturisani tokeni, export napomene, Figma inspect / redlines).
- **Design QA na stagingu** - poređenje sa odobrenim frejmovima, log neslaganja, ~**dva prolaza** u okviru projekta.
- Moderisano istraživanje: **dubina po dogovoru** („as agreed“).
- Kanal: **projektni kanal** (ne obavezno pun mesečni Partner model).

---

### Partner - **UX retainer** (Custom / mesec)

**Kartica:** mesečni pool sati + Slack; prioritetizovani backlog sa PM; kvartalni research/test budžet; rollover do jednog meseca.

**Detaljnije isporuke:**

- **Ugradnja u roadmap**: istraživanje, iteracije, testiranje u stalnoj kadenci.
- **Kvartalni budžet za istraživanje/test** uključen u model.
- Iteracije unutar **mesečnog sata** (umesto fiksnog broja „rundi“ kao u projektnim paketima).

---

## 4. Web development

### Essentials - **Launch slice** (~$6,480 / projekat)

**Kartica:** jedan isporučljiv vertikalni isečak; Next.js/React ili dogovoreni stack; CI preview + staging; CWV baseline; 30 dana bugfix.

**Matrica (bitno):**

- **Produkcija + staging**, env varijable dokumentovane, rollback putanja.
- **CMS marketing šabloni**: tipično **jedan pattern** (ne ceo marketing sajt).
- **Auth**: **shell only** (ne pun produkt RBAC).
- **API integracija**: obično **nije** u Essentials.
- **Testovi**: **smoke**.
- **Analitika**: baseline hook-ovi.
- **Dokumentacija**: kratak README.
- **Demos**: milestone-based.

---

### Growth - **Marketing site** (~$16,650 / projekat)

**Kartica:** WordPress ili Next.js + headless CMS; do 10 šablona/pattern-a; schema, OG, sitemap automatika; obuka urednika + handoff doc.

**Matrica (bitno):**

- **Puni marketing šabloni + CMS povezivanje** (reusable tipovi stranica, editor preview).
- **Auth**: forme / hook-ovi (ne produkt SSO/RBAC).
- **API**: embed / webhook nivo gde je relevantno.
- **Testovi** na kritičnim putanjama.
- **CWV i performance budžet** uz prihvat.
- **Runbook** šire nego Essentials.
- **Post-launch podrška**: **kao u SOW** (npr. dužina eksplicitno).

---

### Scale - **Web app MVP** (~$37,800+)

**Kartica:** auth, data layer, error boundaries; REST ili GraphQL (**jedan** backend sistem); testovi na kritičnim putanjama; 60 dana podrške i hardening.

**Matrica (bitno):**

- **Pun auth, uloge, zaštićene rute** (produkt nivo).
- **Jedna primarna API integracija** (dodatni sistemi / legacy SOAP = posebno u SOW).
- **Produkt event stub-ovi** po data planu (gde primenljivo).
- **Sprint-based** demos/backlog u odnosu na Partner.

---

### Partner - **Dev cadence** (~$9,450 / mesec)

**Kartica:** ~40h/mes senior-vođeno; bi-weekly demo + changelog; incident triage u Slacku; kvartalni roadmap session.

**Matrica:** **bi-weekly demos i deljen backlog**; post-launch podrška **uvučena** u mesečni angažman.

---

## 5. SEO i rast

### Essentials - **Technical SEO** (~$2,520 / projekat)

**Isporuke:** Sitebulb / Screaming Frog crawl; plan redirecta i kanonikalizacije; schema i mapa internih linkova; **Jira-ready** prioritizovan backlog.

**Matrica:** pun crawl/index audit; **keyword mapa i on-page meta** - **ne**; GA4/GTM - **preporuke, ne puna implementacija**; content briefs - **ne**; mesečni review-i - **ne**.

---

### Growth - **Launch kit** (~$5,310 / projekat)

**Isporuke:** keyword mapa + title/meta set; GA4 + GTM base; GSC + Bing verifikacija; XML sitemap i robots pregled.

**Matrica:** keyword mapa **da**; GA4/GTM foundation **da**; content briefs **starter set**; CWV **highlights**; mesečni review **1 handoff**; competitor snapshot **top 3**.

---

### Scale - **Organic 90** (~$12,780 / 90 dana)

**Isporuke:** 12–15 optimizovanih briefova / outline-a; mesečni snapshot rangiranja i saobraćaja; kvartalni strategy call; **laka dev podrška** za fix-eve.

**Matrica:** mesečni performance review **da**; monitoring i iteracije u **90-dnevnom** intenzitetu; CWV sa SEO fokusom **da** (implementacija može tražiti dev sate - ovde je uključena „light“ pomoć).

---

### Partner - **SEO retainer** (~$3,060 / mesec)

**Isporuke:** GSC coverage i monitoring grešaka; **2 content/tech inicijative mesečno**; competitor snapshot; Slack Q&A (sledeći radni dan).

---

## 6. Brend

### Essentials - **Logo i esencijali** (~$4,320 / projekat)

**Isporuke:** 3 pravca logotipa, 1 final; primarna + sekundarna paleta; font stack + napomena o web licencama; PNG/SVG/favicon paket.

**Matrica:** **nema** pisanih brand guidelines (PDF/Notion priručnik); nema voice/tone; nema Figma biblioteke komponenti; nema social/deck šablona.

---

### Growth - **Brand toolkit** (~$10,080 / projekat)

**Isporuke:** ~8 strana brand guidelines PDF; LinkedIn + X cover kit; Google Slides / Keynote tema; smer fotografije i ikona.

**Matrica:** pun guidelines + voice/tone primer; Figma **templates** (ne pun product design system); social + prezentacije **da**; radionice **async-first**.

---

### Scale - **Product design system** (~$22,050 / projekat)

**Isporuke:** semantička boja i type skale; ~**35 core komponenti** dokumentovano; dark mode gde treba; **engineering sync workshop**.

**Matrica:** Figma library + tokeni + komponente **da**; naming program **add-on**; launch collateral **po potrebi**.

---

### Partner - **Brand rollout** (Custom / program)

**Isporuke:** dedicirani brand lead; serija radionica + async review; partner i press collateral; opcioni employer brand add-on.

**Matrica:** naming i verbal identity **uključeni**; launch i partner kitovi **pun opseg**; najdublji workshop/approval proces.

---

## 7. Sadržaj i CMS

### Essentials - **Content schema sprint** (~$3,780 / sprint)

**Isporuke:** radionica + finalizovana mapa polja; preview i validaciona pravila; **authoring cheat sheet (PDF)**; **1 nedelja async podrške**.

**Matrica:** model tipova i polja **da**; migracija **ne**; draft preview/webhook headless nivo **ne**; runbook **cheat sheet**; trening **PDF only**; uloge/workflow **preporuke**.

---

### Growth - **CMS build & migrate** (~$12,420 / projekat)

**Isporuke:** do **250 migriranih čvorova**; redirecti i URL mapiranje; uloge, workflow, revizije; **hands-on obuka urednika**.

**Matrica:** migracija **da**; osnovni draft preview **basic**; CDN/caching vodič **da**; lokalizacija **add-on**; SSO/RBAC audit **ne**.

---

### Scale - **API + preview stack** (~$18,900 / projekat)

**Isporuke:** typed SDK + caching strategija; preview URL-ovi + ISR napomene; lokalizacioni hookovi **ako treba**; runbook za urednike i devove.

**Matrica:** draft preview + webhook **da**; veći setovi migracije **„larger sets“**; SSO/RBAC **add-on**.

---

### Partner - **Editorial platform** (Custom / program)

**Isporuke:** dizajn RBAC + audit trail; staging → prod promocija; integracije (IDP, DAM, CRM); kvartalni roadmap pregledi.

---

## 8. WordPress

### Essentials - **WP launch path** (~$4,180 / projekat)

Child/starter block tema; SEO + schema osnovica; staging → prod handoff doc; **1 sesija** obuke urednika.

**Matrica:** block tema **starter**; custom plugin **ne**; Woo **simple**; performanse **checklist**; security **vodič**; deploy path **dokument**; support **email**.

---

### Growth - **Block theme & system** (~$13,200 / projekat)

Design → theme spec + tokeni; ACF/CPT gde blokovi nisu dovoljni; CWV pass plan; pattern biblioteka + editor docs.

**Matrica:** pun custom block theme/FSE **da**; plugin **light**; Woo **standard**; migracije **da**; staging/git deploy **da**; support **nedeljno**.

---

### Scale - **Woo & custom stack** (~$22,800 / projekat)

Custom plugin(i) + data layer; checkout / funnel prilagođavanje; integracioni spike-ovi (CRM, plaćanja); QA matrica + rollback napomene.

**Matrica:** Woo dubina **puna**; custom plugin **da**; headless/WPGraphQL **add-on**; multisite/SSO **add-on**.

---

### Partner - **WP care & evolution** (~$4,080 / mesec)

Core/plugin update kadenca; uptime + backup verifikacija; roadmap sati (dogovoren pool); **deljen Slack + office hours**.

---

## 9. Analitika i eksperimenti

### Essentials - **Measurement setup** (~$1,980 / projekat)

Event naming spreadsheet; do **25 tagovanih interakcija**; cross-domain / SPA napomene; Debug View QA checklist.

**Matrica:** funnel mapa **light**; executive dashboardi **ne**; eksperimenti **ne**; release QA posle handoff-a **ne**; Slack **email**.

---

### Growth - **Funnel intelligence** (~$7,560 / projekat)

North-star + guardrail metrike; **3 executive dashboarda**; dokument pretpostavki atribucije; **90 min handoff workshop**.

**Matrica:** funnel mapa i definicije metrika **da**; eksperimenti **1 stream** (ograničeno); release QA **samo handoff**; CRM/warehouse **doc only**.

---

### Scale - **Experiment quarter** (~$12,240 / kvartal)

Stats framework unapred dogovoren; Optimizely, VWO ili custom; nedeljni standup + async; arhiva učenja (Notion ili dogovoreno).

**Matrica:** **3 isporučena eksperimenta** sa readout-ima; release QA **tokom testova**; warehouse hookovi **add-on**.

---

### Partner - **Data partnership** (~$2,790 / mesec)

Mesečna tagging i GTM higijena; regression provere na release-ima; **1 eksperiment ili deep-dive mesečno**; Slack + office hours.

**Matrica:** CRM/warehouse/ads hookovi **uključeni** u širem smislu (kako u SOW); pun release QA.

---

## 10. Checklist pre potpisa SOW-a

- [ ] Broj stranica / ekrana / tokova / šablona eksplicitno
- [ ] Lista integracija (CRM, plaćanja, SSO, CMS, API) + ko radi test plan
- [ ] Nivo pristupačnosti (praktičan prolaz vs WCAG nivo vs VPAT)
- [ ] Ko je vlasnik odluka (jedan PO vs komitet) i očekivani review ciklusi
- [ ] Ciljni datum prvog dizajn review-a (gde primenljivo)
- [ ] Broj strukturisanih rundi revizije (dizajn / copy gde važi)
- [ ] Dužina post-launch podrške i šta tačno ulazi u „bugfix“
- [ ] Format handoff-a (Figma linkovi, repo, pristup CMS, export paketi)
- [ ] Licence: fontovi, stock, plugin-i - ko kupuje, gde se čuvaju dokazi

---

## 11. Referenca na sajt

- Proces, ugovori, IP, FAQ: `how-we-work` (fajl na disku: `how-we-work.html`)
- Paketi, cene, interaktivna matrica: `pricing` (`pricing.html`)
- Kickoff: `kickoff-checklist` (`kickoff-checklist.html`)

---

*Dokument izveden iz `pricing` / `how-we-work` (izvorni HTML fajlovi u repou i dalje imaju sufiks `.html`). Ažurirati kada se promene kartice paketa ili politike na sajtu.*

# CraftedPixel — Elementor + Elementor Pro + Crocoblock (JetEngine)

Detaljno uputstvo za ručno sklapanje stranica: **podešavanje vidžeta, stil, pozicioniranje, CPT (Projects, Team) i obični postovi za blog**.

---

## 1. Šta koristiš u stack-u

| Komponenta | Uloga |
|------------|--------|
| **Elementor** | Osnova layouta (Container sistem) |
| **Elementor Pro** | Theme Builder, Forme, Loop Grid, Motion, Custom CSS po vidžetu, Dynamic Tags |
| **JetEngine** | CPT **Projects** i **Team**, meta polja, Listing Grid, Query Builder |
| **JetFormBuilder** (opciono) | Kontakt, careers apply, multi-step |
| **JetSmartFilters** (opciono) | Filter na Work / Careers ako treba |
| **JetBlocks** (opciono) | Breadcrumbs, dynamic visibility |

Blog članci = uvek **WordPress Posts** (nije CPT).

---

## 2. Design tokeni (kopiraj u Global Colors / Custom CSS)

Ove vrednosti odgovaraju `css/main.css` prototipa.

### 2.1 Global Colors (Elementor → Site Settings → Global Colors)

| Ime u Elementoru | HEX / vrednost |
|------------------|----------------|
| Primary | `#001638` |
| Primary Dark | `#000f24` |
| Accent Blue | `#1e5a8a` |
| Accent Teal | `#0f766e` |
| Accent Violet | `#5b21b6` |
| BG Page | `#f6f8fc` |
| BG Section | `#eef2f8` |
| BG Elevated (card) | `#ffffff` |
| Text Primary | `#001638` |
| Text Secondary | `#5c6575` *(≈ 62% primary na belom; ili koristi `color-mix` u CSS)* |
| Text Muted | `#8b93a0` *(≈ 42%)* |
| Border Glass | `rgba(0,22,56,0.1)` |
| Border Strong | `rgba(0,22,56,0.18)` |

### 2.2 Global Fonts

- **Primary (body):** Instrument Sans — 400, 500, 600, 700 + italic 400  
- **Secondary / Display:** Syne — 400–800  

U **Typography** kreiraj:

| Preset | Font | Weight | Transform / napomena |
|--------|------|--------|----------------------|
| Body | Instrument Sans | 400 | Line height ~1.55–1.65 |
| Body Small | Instrument Sans | 400 | Size ~15px desktop, letter-spacing normal |
| Section Label | Instrument Sans | 600 | Uppercase, letter-spacing 0.08–0.12em, color **Text Secondary** |
| H1 Hero | Syne | 700–800 | Veličina: responsive (vidi §3) |
| H2 Section | Syne | 700 | Section naslovi |
| H3 Card | Syne | 600–700 | Kartice, podnaslovi |

### 2.3 Širina i razmaci (Site Settings → Layout)

- **Content Width:** `1770` px (maksimalna širina sadržaja kao `--container-max`).  
- **Widget Space:** `0` ili mali (npr. 12px) — bolje kontrolišeš **Gap** na kontejneru.  
- **Page Title:** sakrij na svim šablonima gde gradis hero u Elementoru (Theme Builder → disable title).

### 2.4 Custom CSS (opciono, Site Settings → Custom CSS)

Za preciznije kao u CSS varijablama:

```css
/* Helper klase za sekcije — dodeljuj u Advanced → CSS Classes */
.cp-section-pad {
  padding-top: clamp(68px, 7.5vw, 86px);
  padding-bottom: clamp(68px, 7.5vw, 86px);
}
.cp-section-pad-lg {
  padding-top: clamp(76px, 8.5vw, 96px);
  padding-bottom: clamp(76px, 8.5vw, 96px);
}
.cp-radius-card { border-radius: 20px; }
.cp-radius-sm { border-radius: 12px; }
```

---

## 3. Tipografija — konkretna podešavanja u vidžetu

### 3.1 Heading (H1 hero)

- **HTML tag:** H1  
- **Typography → Typography:** Preset **H1 Hero** ili ručno:  
  - **Size:** Desktop `clamp` kroz Custom → `clamp(2.1rem, 5vw, 3.45rem)` *(Elementor PRO: Custom unit REM)*  
  - Ako Elementor nema clamp u starijoj verziji: Desktop **48–56px**, Laptop **42px**, Mobile **32–36px**  
- **Line height:** 1.08–1.15  
- **Color:** Text Primary  
- **Margin:** Bottom **16–24px** (razmak do podnaslova)

### 3.2 Heading (H2 sekcija)

- **Size desktop:** `clamp(1.65rem, 2.95vw, 2.35rem)` ili ~28–38px  
- **Margin bottom:** `clamp(26px, 3.2vw, 38px)` na heading grupu (ili na kontejneru ispod labela)

### 3.3 „Section label“ (eyebrow)

- Koristi **Heading** widget sa **HTML tag: span** ili **H6**  
- **Size:** 11–13px  
- **Weight:** 600  
- **Transform:** Uppercase  
- **Letter spacing:** 0.1em  
- **Color:** Text Secondary  
- **Margin bottom:** 8–12px

### 3.4 Text Editor / tekst pasusi

- **Color:** Text Primary za body; **Text Secondary** za lead / opis ispod naslova  
- **Size:** 16–18px desktop, 15–16px mobile  
- **Paragraph spacing:** u Advanced → **Margin** bottom 12–16px po pasusu (ili u editoru `<p>`)

### 3.5 Breadcrumbs

- **Text** widget ili HTML  
- **Size:** 13–14px  
- **Color:** Text Muted za separator; link **Accent Blue**  
- **Margin bottom:** 20–28px pre labela

---

## 4. Container / Section — layout, pozicioniranje, slojevi

Elementor koristi **Container** (preporučeno). Stari **Section/Column** izbegavaj za nove layoute.

### 4.1 Spoljašnji container (full-bleed red)

1. Dodaj **Container**  
2. **Layout:** Block ili Flex column  
3. **Width:** Full width (100vw)  
4. **Content width:** Boxed → max **1770px** (ili „Full width“ unutra drugi boxed child — vidi ispod)  
5. **Padding:** Link **§2.4** klase ili ručno:  
   - Desktop: **Left/Right** `24px`–`40px` (ili `clamp(20px, 4vw, 48px)`)  
   - **Top/Bottom:** `cp-section-pad`  
6. **Background:** boja **BG Page** ili **BG Section** (naizmenično između sekcija)

**Pattern „boxed unutra full“:**

- Spolja: full width, bg boja, horizontal padding  
- Unutra: child **Container**, **Width** = Custom `1770px`, **Align self** = center, **Margin** horizontal = auto

### 4.2 Hero sa slojevima (pozadina + orb + sadržaj)

1. **Spoljni Container** — `position: relative`, `overflow: hidden`, min-height npr. **72vh** (mobile **auto** + veći padding).  
2. **Background layer:**  
   - Na istom containeru: **Background → Gradient** (tamno plava → blaga plava)  
   - Dodaj **HTML** ili **Image** widget **Position: Absolute**, **Z-index: 0**, **Stretch** (top/left/right/bottom 0) za „grid“ teksturu ako imaš PNG/SVG  
3. **Deco shapes (geo):**  
   - Mali **Icon** ili prazni **Container** fiksne širine/visine, **Position Absolute**, `%` pozicije (npr. top 18%, left 8%)  
   - **Z-index: 1**  
   - Opacity 0.06–0.12 da budu suptilni  
4. **Sadržaj (tekst + dugmad):**  
   - Child **Container**, **Z-index: 2**, **Position: Relative**  
   - **Flex** row na desktop, **Wrap**, **Align items: center**, **Justify: space-between**  
   - Gap horizontal **40–64px**, vertical **32px**

### 4.3 Grid kartica (services, metrics, team)

- Parent **Container** → **Display: Grid**  
- **Columns:** Desktop **3** ili **4**; Tablet **2**; Mobile **1**  
- **Gap:** **24–32px** (desktop), **16–20px** (mobile)  
- **Justify items:** Stretch  
- Kartica = child Container sa **BG Elevated**, **Border** 1px Border Glass, **Radius** 20px, **Padding** 24–32px

### 4.4 Horizontal scroll (team strip, tech chips)

- **Container** → Flex row, **Flex wrap: nowrap**  
- **Overflow X: auto** (Custom CSS na containeru: `overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;`)  
- Deca: **min-width** na kartici (npr. 260px) + `scroll-snap-align: start`  
- Sakrij scrollbar stilom ako treba (webkit scrollbar u Custom CSS)

### 4.5 Z-index šema (da ništa ne „pobegne“)

| Sloj | Z-index |
|------|---------|
| Pozadina / gradient | 0 |
| Dekorativni elementi | 1 |
| Glavni sadržaj | 2 |
| Sticky header | 100+ (Theme Builder) |
| Mobile menu overlay | 1000+ |

---

## 5. Dugme (Button)

### Primary

- **Typography:** Instrument Sans 600, 15–16px  
- **Text color:** `#ffffff`  
- **Background:** Primary  
- **Border radius:** 10–12px  
- **Padding:** 14px 22px (desktop), 12px 18px (mobile)  
- **Icon:** uključi „Icon“ position **after** text ako koristiš Font Awesome  

**Hover (Elementor → Hover tab):**

- Background: **Primary Dark** ili blago svetlija nijansa  
- **Transform:** `translateY(-1px)` opciono  
- **Box shadow:** blaga `elev-1` (copy iz tokena)

### Outline

- **Background:** transparent  
- **Border:** 1px **Border Strong**  
- **Text:** Text Primary  
- Hover: bg **Primary Soft** (`rgba(0,22,56,0.06)`) ako dodaš u Global Colors

### Secondary

- Bela ili svetla pozadina, border kao outline, tekst primary

**Razmak između dva dugmeta u redu:** **Gap 12–16px** na flex kontejneru, ili margin-left na drugom dugmetu.

---

## 6. Image

- **Border radius:** 12–20px (lead slike veći radius)  
- **Object fit:** Cover u karticama  
- **Width:** 100% unutar kolone  
- **Spacing:** ispod slike margin **16–24px** ako ide naslov ispod  
- **Lazy load:** uključeno (Elementor default / WP)

---

## 7. Icon Box / Call to Action

**Icon Box** (services mini kartice):

- **Icon:** size 22–28px, color **Accent Blue** ili **Accent Teal**  
- **Title:** Syne 600, Text Primary  
- **Description:** Text Secondary, manji font  
- **Content vertical align:** Top  
- **Container:** isti kao grid kartica §4.3

**Call to Action** (ako više voliš taj vidžet):

- Razmak ikona–tekst **12–16px**  
- **Button** u footeru kartice: outline small

---

## 8. Accordion (FAQ)

- **Title:** Syne 600, 16–17px, Text Primary  
- **Title background:** transparent ili BG Elevated  
- **Content:** Instrument Sans, Text Secondary, padding **16–20px**  
- **Border:** između stavki **Border Glass**  
- **Icon:** chevron, align desno  
- **First item open:** opciono za UX

---

## 9. Posts / Loop Grid (Pro) — Blog

**Izvor:** **Posts** (native) ili **Loop Grid** sa query „Post“.

**Query:**

- **Post type:** Post  
- **Order by:** Date DESC  
- **Sticky:** po želji za featured  

**Kartica u template-u (Loop Item):**

- Slika gore, radius 12px  
- Meta: kategorija (badge), datum  
- Naslov H3 Syne  
- Excerpt 2 linije (CSS `line-clamp: 2` u Custom CSS na textu)

**Archive stranica:**

- Prvi red: jedan **Posts** widget **Posts per page: 1**, „featured“ layout širi  
- Ispod: **Posts** offset **1**, grid 2–3 kolone  

---

## 10. CPT: JetEngine — **Projects**

### 10.1 Registracija

- **JetEngine → Post Types → Add New**  
- **Slug:** `project` (ili `projects` — URL struktura: `/work/` preko permalinks)  
- **Has archive:** da (za `/work/` ako mapiraš)  
- **Public:** da  
- **Supports:** Title, Editor, Thumbnail, Excerpt  

### 10.2 Meta fields (primer)

| Field name | Tip | Napomena |
|------------|-----|----------|
| `client_name` | Text | |
| `project_year` | Text / Number | |
| `role_summary` | Textarea | Kratko „UI + dev“ |
| `external_url` | URL | Live site |
| `gallery` | Gallery / Media | Case study galerija |
| `metric_1_label` | Text | npr. „Conversion“ |
| `metric_1_value` | Text | npr. „+32%“ |
| `featured_on_home` | Switcher | Za query na početnoj |

### 10.3 Taxonomija (opciono)

- `project_category` ili `project_tag` — za filter na Work stranici.

### 10.4 Listing Grid (Work index)

1. **JetEngine → Listings → Add**  
2. Query: **Projects**  
3. Dizajn u Listing template-u: kao „project card“ sa **Dynamic Field** za thumbnail, title, excerpt.  
4. Na stranici **Work:** widget **Listing Grid**, izaberi listing, columns responsive.

### 10.5 Single Project

- **Theme Builder → Single** za CPT `project`  
- Sekcije: hero (dynamic title + image), overview (editor), metrics (repeater ili fiksna 3 polja), gallery (dynamic gallery), CTA template.

**Repeater alternativa:** JetEngine **Repeater** za unlimited metrika umesto metric_1/2/3.

---

## 11. CPT: JetEngine — **Team**

### 11.1 Registracija

- **Slug:** `team_member` (ili `team`)  
- **Public:** da (ili false ako su samo embed na About — tada bez single URL)  
- **Supports:** Title, Editor, Thumbnail  

### 11.2 Meta fields

| Field name | Tip |
|------------|-----|
| `job_title` | Text |
| `linkedin_url` | URL |
| `twitter_url` | URL (opciono) |
| `email_public` | Text (opciono) |
| `order` | Number | Za ručno sortiranje |

### 11.3 Listing (About / Home „Team“)

- **Listing Grid** query: Team, **Order by:** `order` meta ASC  
- Kartica: okrugla ili zaobljena slika (**border-radius: 50%** ili 16px), dynamic title, dynamic `job_title` ispod  
- Horizontal scroll: Listing u **Listing Grid** sa custom CSS ili **swiper** ako dodaš JetElements

---

## 12. Posts ostaju blog

- **Categories / Tags** standardno WP  
- **Single Post** šablon u Theme Builder  
- **Related posts:** Loop Grid, query „Related by category“, exclude current ID  

---

## 13. Theme Builder (Pro) — šabloni

| Šablon | Uslov prikaza |
|--------|----------------|
| Header | Entire site |
| Footer | Entire site |
| Single Post | Posts |
| Single Project | CPT project |
| Single Team | CPT team *(ako je javan)* |
| Archive Post | Blog archive |
| Archive Project | Work archive *(ako uključeno)* |
| 404 | 404 |

**Header:**

- Container max 1770px, **Flex** row, **Justify: space-between**, **Align: center**  
- **Nav Menu** centar (Pro) — dropdown stil kao u prototipu  
- **Padding** vertikalno 16–20px  
- **Sticky:** Motion Effects → Sticky top, offset 0, **Z-index** 100  

---

## 14. Forme (Contact / Apply)

**Elementor Form (Pro):**

- Polja: ime, email, poruka; **Honeypot** + reCAPTCHA  
- **Actions:** Email + Redirect thank-you  
- Stil: input **radius** 10px, **border** Border Glass, **padding** 12px 16px, focus border **Accent Blue**

**JetFormBuilder:**

- Za **Apply** na careers: hidden field `role_slug`; uslovljena polja; email notification sa merge tagovima.

---

## 15. Responsive — breakpoint vrednosti

Elementor default (prilagodi ako si menjao):

| Device | Širina |
|--------|--------|
| Mobile | do ~767px |
| Tablet | ~768–1024px |
| Desktop | 1025px+ |

**Šta uvek proveri na mobile:**

- Hero: **Flex direction column**, slika ispod teksta ili sakrivena  
- Grid: 1 kolona  
- **Font size** H1 −30%  
- **Section padding** top/bottom −20%  
- Horizontal scroll sekcije: da li je swipe očigledan (padding sa strane)

---

## 16. Motion (Elementor Pro)

- **Entrance:** Fade In Up, trajanje **0.6–0.9s**, **delay** stagger 0.1s po kartici (ne na sve odjednom)  
- **Reduced motion:** u Custom CSS:

```css
@media (prefers-reduced-motion: reduce) {
  .elementor-invisible { opacity: 1 !important; transform: none !important; }
}
```

---

## 17. Redosled izgradnje (preporuka)

1. Global Colors, Fonts, Layout width  
2. Header + Footer (Theme Builder)  
3. Snimi **Global Widget** ili **Template** za: `service-detail-cta`, `page-hero` (varijante), `faq-block`  
4. Početna od vrha ka dnu  
5. CPT Projects + Team + jedan Listing + jedan Single template  
6. Work, About, Blog archive, Single post  
7. Ostale statičke stranice (Services hub, Contact, Legal)

---

## 18. Mapiranje HTML klasa → Elementor ponašanje

| Prototip klasa | Kako u Elementoru |
|----------------|-------------------|
| `container` | Boxed inner max 1770px |
| `section-label` | Heading H6 + stil eyebrow §3.3 |
| `section-heading` | H2 §3.2 |
| `button--primary` | Button §5 primary |
| `button--outline-dark` | Button §5 outline |
| `has-geo` | Hero + absolute deca §4.2 |
| `tex-dots` | Background image pattern ili CSS u Custom |
| `service-detail-section--alt` | Menjaš bg parent container na BG Section |

---

## 19. Legenda — šta znači „dodaj u Container“

U svakom koraku: **spoljni** Container = full width sekcija (padding, bg, opciono `has-geo` deca). **Unutrašnji** = max 1770px, centriran.

| Oznaka | Elementor vidžet / blok |
|--------|-------------------------|
| **TXT** | Text Editor ili Heading (po kontekstu) |
| **H** | Heading (podesi HTML tag: H1–H6 ili span) |
| **BTN** | Button |
| **IMG** | Image |
| **ICN** | Icon |
| **IBX** | Icon Box |
| **ACC** | Accordion (Pro) |
| **FORM** | Form (Pro) ili JetFormBuilder |
| **HTML** | HTML (custom markup, SVG, Lucide placeholder) |
| **NAV** | Horizontal menu linkovi — Text Editor sa `<a>` ili Button grupa |
| **LOOP** | Loop Grid / Listing Grid (JetEngine) |
| **POST** | Posts widget |
| **TB** | Tabovi (Pro) — za pricing pakete po linijama |

**CPT u WordPress-u (preporuka):** `project` (Projects), `team_member` (Team), **Posts** = blog.

---

## 20. Šabloni ponovljenih blokova (snimi kao Elementor Template)

### 20.1 `page-hero` (unutrašnji sadržaj — redosled)

Unutar boxed Container-a, **vertikalno** (Flex column, gap 12–20px):

1. **TXT** — breadcrumbs (`page-hero-crumb`)
2. **H** — `section-label` (eyebrow)
3. **H** — H1 (`page-hero-title`)
4. **TXT** — lead (`page-hero-lede`)
5. *(opciono)* **Container** grid — `page-hero-meta`: 3–4 ćelije, svaka = 2× **TXT** (label + value)
6. *(opciono)* **Container** row — `page-hero-cta-row`: **BTN** primary + **BTN** outline
7. **TXT** — `page-hero-aux` (linkovi ispod CTA)

**Iznad toga** (na spoljnom hero Container-u): background slojevi + **HTML**/prazni Container-i za `geo` (§4.2 u ovom vodiču).

---

### 20.2 `service-detail-cta` (panel)

Boxed Container → jedan Container (`service-detail-cta-panel`, bg elevated, padding, radius):

1. **H** — H2
2. **TXT** — jedan pasus
3. **Container** row (`service-detail-cta-row`): **BTN** primary + **BTN** outline

---

### 20.3 `social-proof-header` + mreža citata

**Header (vertikalno):**

1. **H** — section-label
2. **H** — H2 section-heading
3. **TXT** — section-sub / lede
4. *(opciono)* **TXT** — `social-proof-note`

**Grid** (`social-proof-grid`): 3 kolone desktop — svaka ćelija = Container (`testimonial-card`):

1. **Container** row — avatar (**TXT** inicijali ili **IMG**) + **TXT** brand link
2. **TXT** — blockquote pasus
3. **TXT** — figcaption (ime · uloga · firma)

---

### 20.4 `service-detail-intro-grid`

Boxed Container, **2 kolone** desktop (levo/desno):

**Leva kolona:**

1. *(opciono)* **H** section-label
2. **H** H2
3. **TXT** — 1–3 pasusa (`service-detail-intro-lede`)

**Desna kolona:**

- **Icon List** (Pro) ili **TXT** sa listom — `service-detail-pills` (svaka stavka: ikona + span sa **strong** + tekst)

---

### 20.5 `service-detail-section` (jedna tematska sekcija)

**Container** sekcije (bg naizmenično default / `--alt`):

1. **HTML** ili prazni Container-i — geo dekor (opciono)
2. Boxed Container:
   - **Header** (vertikalno):
     1. **H** — span broj (`service-detail-num` „01“)
     2. **H** — H2 (`service-detail-section-header`)
     3. **TXT** — tagline (`service-detail-tagline`)
   - **Body** — 2 kolone (`service-detail-body`):
     - **Levo** (`service-detail-col--copy`): **TXT** — 2 pasusa
     - **Desno** (`service-detail-col--aside`): **H** H3 „Typical outputs“ → **Icon List** → **H** H3 „Best when“ → **TXT**

---

### 20.6 `service-detail-flow`

1. Boxed: header = **H** label + **H** H2 + **TXT** lede
2. **Container** row wrap (`service-detail-flow-track`) — za svaki korak: **IBX** ili mini Container (ikona + **TXT** naslov + **TXT** subtitle), između **ICN** strelica
3. **Container** full width strip (`service-detail-flow-strip`): **TXT** ili row chip-ova (Figma · Tokens · …)

---

### 20.7 `services-page-category` (hub podkategorija)

Boxed Container:

1. **Header** row (`services-page-cat-head`):
   - **Container** — `svc-geo-icon` (**HTML** SVG + oblik pozadine) **ili** **IBX**
   - **Container** kolona: **H** H2 kategorije → **TXT** lede → **TXT** link „Full overview →“
2. **Container** grid (`services-sub-grid`, npr. 2–3 kolone): za svaku karticu:
   - **H** H3
   - **TXT** opis
   - **BTN** secondary „More →“ (link na `#anchor` servis stranice)

---

### 20.8 `why-us` (tri razloga)

1. Spolja: bg div (HTML background) opciono
2. Boxed: header — **TXT** eyebrow + **H** H2
3. Grid 3 kolone: svaka kartica = **TXT** broj „01“ + **ICN** + **H** H3 + **TXT**

---

### 20.9 `footer` (Theme Builder)

Boxed Container → `footer-main` grid (4 kolone desktop):

1. Kolona 1: **Image** logo → **TXT** → **Social Icons**
2. Kolona 2: **H** H5 „Services“ → **Text Editor** `<ul>` linkovi
3. Kolona 3: **H** H5 „Company“ → lista
4. Kolona 4: **H** H5 „Get in Touch“ → stavke sa ikonama (**Icon** + **TXT**)
5. Ispod full width: **TXT** `footer-studio-meta`
6. **TXT** + linkovi copyright / legal

---

## 21. Katalog stranica — redosled sekcija i elemenata

*(Header + Footer = Theme Builder na celom sajtu; ispod je samo **glavni sadržaj** stranice.)*

---

### 21.1 Početna (`index` / Front Page)

| # | Sekcija (HTML ref) | Spoljni Container | Unutrašnji redosled (od vrha) |
|---|-------------------|-------------------|-------------------------------|
| 1 | **Hero** | `hero`, relative, min-height, bg slojevi + 5× geo | Boxed: **hero-layout** → kolona **hero-copy**: (a) row **hero-cap-cards** = 3× mini kartica [glow div opciono + **ICN** + **TXT** label], (b) **TXT** kicker, (c) **H** H1 (dva span-a, gradient na drugom), (d) **TXT** descriptor, (e) **TXT** tagline, (f) row **hero-cta-row** 2× **BTN**, (g) **TXT** subtle linkovi. **Ispod** pun širine: **hero-trust-wrap** boxed: **TXT** label → row link tekstova (Kova/Luma/Mero) → 3× **TXT** pasusa trust |
| 2 | **Scroll bridge** | `scroll-bridge`, centar | Dekor div opciono → boxed: **TXT** „Before the numbers“ → **HTML** scroll track (fill animacija) |
| 3 | **Metrics** | `metrics` + bg deco | Boxed: **header** — **TXT** eyebrow+dot → **H** H2 → **TXT** lead → **grid** `metrics-bento`: kartica 1 (featured) **TXT** tag + **H** broj (Counter) + **H** H3 + **TXT** + shine; kartice 2–4 isti pattern; kartica 5 „outcome“ **ICN** + **TXT** quote + **TXT** source |
| 4 | **About** | `about` + geo | Boxed: **intro** eyebrow → **H** H2 → 2× **TXT** lead → **H** H3 „How we work“ → grid 3× **IBX** (ikonica, H4, TXT) → **split** 2 kolone: (L) **TXT** huge stat + **H** + **TXT** + **BTN** + facepile **IMG×4** + link „+“, (D) stat + **TXT** |
| 5 | **Why us** | `why-us` | Koristi šablon **§20.8** (tekst drugačiji) |
| 6 | **Services** | `services` + geo | Boxed: **header** section-label → **H** H2 (2 span) → 2× **TXT** → row: **horizontal scroll** Container sa 7× **service-card** [geo+SVG blok, **H** H3, **TXT**, **BTN** secondary] + pored **CTA kartica** [bg, **H**, **TXT**, **BTN** on-dark] → ispod **services-footer-cta** row: deco + badge + **TXT** + **BTN** + **TXT** note |
| 7 | **Process** | `process` | Boxed: header eyebrow → **H** H2 → **TXT** → grid 4× **process-card** [top: ikona SVG + step + **H** H3; bottom: **Icon List** check + **BTN**] → **TXT** footer line sa linkovima |
| 8 | **Projects** | `projects` | Boxed: isti header pattern kao Services intro → grid 3× **project-card** [thumb: index + **IMG**; body: **TXT** eyebrow → **H** → **TXT** tag → **TXT** label → meta 2 grupe tagova → label → 2× **TXT** story → label → **TXT** metrics (dt/dd) → footer **TXT** link + **BTN**] → **services-footer-cta** varijanta teksta |
| 9 | **Testimonials** | `social-proof` | **§20.3** (3 kartice + note) |
| 10 | **Packages teaser** | `packages--teaser` | Boxed centar: label → **H** → **TXT** → **TXT** note → row 2× **BTN** → **TXT** hint linkovi |
| 11 | **Tech stack** | `tech-stack` | Boxed top: header (kicker, **H**, **TXT**) + row strelice 2× **BTN** → row filter **BTN×9**. **Full bleed** ispod: horizontal **Container** sa **TXT**/link karticama (ikonica **IMG** + ime + strelica) — ili LOOP iz CPT „tech_item“ ako praviš CPT |
| 12 | **Team** | `team` | Boxed **team-header** §20.3 style → **Container** `team-carousel`: 2× **BTN** nav + horizontal scroll sa **LOOP** Team CPT (slika, overlay, **H** ime, **TXT** uloga) |
| 13 | **Blog** | `blog` | Boxed row: levo label+**H**, desno **BTN** „All posts“ → grid 3× blog kartica [**IMG**+pill, meta row, **H**, **TXT**, **BTN**] — **POST** query za 3 latest |
| 14 | **FAQ** | `faq` | Boxed 2 kolone: levo label + **H** + **TXT** + **BTN**; desno **ACC** (10 stavki) |
| 15 | **Philosophy CTA** | `philosophy` | Boxed 2 kolone: panel [eyebrow + **H** + **TXT** accent line + **TXT** + 2× **BTN** + divider **HTML**] + aside 3× rail kartica [broj + naslov + **TXT**] |
| 16 | **Footer** | — | Theme Builder **§20.9** |

---

### 21.2 About (`about`)

1. **page-hero** §20.1 (crumb, label, H1, lede, CTA row, aux).
2. **service-detail-intro-grid** §20.4 — H2 „Who we are“, pasusi, pills (3 stavke).
3. **why-us** §20.8 — eyebrow „Our goals“, 3 kartice (drugačiji tekst/ikone).
4. **social-proof** §20.3 — „What clients say“ + 3 testimonial + note.
5. **about-quality** — boxed: header (label, **H**, **TXT**) → grid 3× **IBX** kartice (Accessibility, Performance, Privacy).
6. **about** (samo how grid) — boxed: intro eyebrow + **H** + **TXT** → **bez** duplicate stat split sa početne: samo grid 3× **IBX** kao homepage about-how.
7. **vision** — boxed: section-label + **H** + **TXT** + **Icon List** pills (3).
8. **team** — identična struktura kao **§21.1 stavka 12** (Team sekcija na početnoj).
9. **service-detail-cta** §20.2 — „Book a free 30-minute intro“ + 2 **BTN** + **TXT** napomena ispod.

---

### 21.3 Services hub (`services`)

1. **page-hero** §20.1.
2. **social-proof--compact** — boxed: header **samo** label + **H** + 2× **TXT** (bez grid kartica; „lede-only“ varijanta).
3. **Kategorije** (7 sekcija, naizmenično bg `--alt`):

   | Red | ID anchor | H2 naslov |
   |-----|-----------|-----------|
   | 1 | `#ui-ux` | UI/UX Design |
   | 2 | `#web-development` | Web Development |
   | 3 | `#seo-growth` | SEO & Growth |
   | 4 | `#brand-design-systems` | Brand & design systems |
   | 5 | `#content-cms` | Content & CMS |
   | 6 | `#wordpress` | WordPress |
   | 7 | `#analytics-experimentation` | Analytics & experimentation |

   Unutra svake: **§20.7**; broj `services-sub-card` varira (4–5) po HTML-u.

4. **service-detail-faq** — 2 kolone: levo intro + **BTN**, desno **ACC** (hub FAQ stavke).

---

### 21.4 Service detail — primer **UI/UX** (`service-ui-ux`)

*(Ostale servis stranice: isti skeleton; menjaju se anchor id-jevi, naslovi i tekst. WordPress varijanta ispod.)*

1. **page-hero** (kao na servisu — proveri HTML za taj fajl: H1 specifičan za UI/UX).
2. **NAV** sticky `service-detail-jump` — jedan row **BTN** outline ili Text linkovi: Process, Strategy, Prototyping, Visual UI, Research, Handoff, Future, Work, FAQ.
3. **service-detail-intro** §20.4.
4. **service-detail-flow** §20.6 (koraci za UI/UX).
5. **service-detail-section** × 5: `#strategy` → `#prototyping` (--alt) → `#visual-ui` → `#research` (--alt) → `#handoff` — svaka §20.5.
6. **service-detail-quote** — boxed centar: **TXT** blockquote + **TXT** cite.
7. **service-detail-future** — boxed: **H** + više **TXT**.
8. **service-detail-related** — boxed: label + **H** + grid link kartica ka case study-jima.
9. **service-detail-cadence** — boxed: **H** + **TXT** + lista.
10. **service-detail-fit** — 2 kolone bullet lista (**Icon List** × 2).
11. **service-detail-faq** — kao Contact/How we work FAQ layout.
12. **service-detail-cta** §20.2.

**Mapa anchora ostalih servisa (isti elementi unutra kao UI/UX gde postoji sekcija):**

| Stranica | Flow id | Section ids (redosled) |
|----------|---------|-------------------------|
| Web dev | `process-flow` | frontend, fullstack, performance, wordpress, launch + quote, future, related, cadence, fit, faq, cta |
| SEO | `process-flow` | technical, onpage, migrations, measurement, growth + quote… |
| Brand/CMS | `process-flow` | identity/design-systems/components/guidelines ili modeling/headless/… + quote… |
| Analytics | `process-flow` | measurement, events, dashboards, experimentation, privacy + quote… |
| **WordPress** | **`scope`** | **design-themes, plugins-apis, commerce, integrations, migrations, ops-security** → **cadence** (`care`) → **related** (`related`) → fit → faq → cta *(nema quote/future kao ostali)* |

---

### 21.5 Work (`work`)

1. **page-hero** §20.1.
2. **work-index** — full width: **header** (eyebrow **TXT**, **H** H2, **TXT** lede) → **Container** `work-bento` grid: 1 velika **Container** kartica (hero) [**IMG**, overlay, chips **TXT**, **H**, **TXT**, stat **TXT**, „go“ **TXT**] + 2 manje iste strukture.
3. **social-proof** §20.3 (naslovi kao „Voices from the work“).
4. **service-detail-cta** §20.2.

**Elementor:** Work kartice mogu biti **LOOP** CPT `project` (3 istaknuta) ili ručno 3 Container-a.

---

### 21.6 Case study — **Kova** (`case-study-kova`)

1. **case-study-hero** — 2 kolone: levo crumb + label + **H** + **TXT** + pills lista + **BTN** row; desno **IMG** u frame-u.
2. **case-kpi-strip** — full bleed row: 4× **Container** (**TXT** veliki broj + **TXT** caption).
3. **NAV** `service-detail-jump`: Overview, Context, Approach, System, Results, Gallery.
4. **case-overview** — boxed prose: **H** + 2× **TXT**.
5. **case-context** — boxed: **split** levo **H**+**TXT** | desno blockquote **TXT**; ispod **IMG** + **TXT** figcaption.
6. **case-approach** — **H** + **TXT** + **Icon List** (4 stavke sa ikonama).
7. **case-system** — tamna pozadina: **H** + 2× **TXT**.
8. **case-results** — **H** + 2× **TXT**.
9. **case-gallery** — **H** + **TXT** + **Container** bento 3× **IMG**.
10. **service-detail-cta** §20.2.
11. **case-next** — jedna kartica link: eyebrow + **H** + **TXT** + strelica.

---

### 21.7 Pricing (`pricing`)

1. **page-hero** §20.1.
2. **scope-wizard** — boxed **2 kolone**:  
   - **Levo** `scope-wizard-main`: header (label, **H**, **TXT**) → panel: toolbar (**TXT** step + progress **HTML**) → **FORM** multi-step ili **TB** 4 koraka sa **BTN** opcijama unutra → navigacija Back/Next → rezultat blok (**H** + **TXT** + **BTN**×2 + restart).  
   - **Desno** `scope-wizard-rail`: 3 kartice (**TXT** eyebrow + lista / linkovi / stat).
3. **packages** — boxed centar intro (label, **H**, 3× **TXT**) → **TB** 7 tabova (UI/UX, Web dev, SEO, Brand, CMS, WordPress, Analytics) → u svakom tabu **grid** 4× pkg kartica [**TXT** badge, **TXT** name, **TXT** desc, **TXT** price, **Icon List**, **BTN**] → ispod svakog taba **matrix** redovi (tabela **HTML** ili **Price Table** × N).

---

### 21.8 Blog arhiva (`blog`)

1. **page-hero** §20.1 (kratak, bez meta reda ako nema u HTML).
2. **blog-page-archive** — boxed: **featured** row [**IMG** link + overlay pill] + kolona [**TXT** badge, **H** link, **TXT** lede, meta **TXT**, **BTN**] → header „More articles“ (label, **H**, **TXT**) → grid **blog-card** × 3 (jedna može „Coming soon“ varijanta: pill, **H**, **TXT**, **BTN** mailto).
3. **service-detail-cta** §20.2.

**WP:** Featured = jedan **POST** sticky; grid = **POST** offset 1.

---

### 21.9 Blog single (npr. `blog-post-design-systems`)

1. **page-hero** §20.1 (crumb sa kategorijom, label „Design · 9 min“, **H** H1).
2. **article** — boxed: meta bar (**TXT** kategorija + datum + autor) → **figure** lead **IMG** → **TXT** / **Post Content** (`blog-post-prose`: pasusi, **H**2, blockquote, liste) → share row **TXT** + 3× link **BTN** ili **Social Icons**.
3. **blog-related** — boxed: label + **H** + grid 2–3 related **POST** kartice (**IMG**, **H**, **TXT**, link).
4. **service-detail-cta** §20.2.

*(Ista struktura za `blog-post-page-speed-seo.html`, `blog-post-b2b-positioning.html` — drugačiji hero i sadržaj.)*

---

### 21.10 Contact (`contact`)

1. **page-hero** §20.1 (+ meta grid 4 ćelije + CTA row + aux).
2. **contact-bento-strip** — boxed grid 3 kartice: **ICN** + **H** H2 + **TXT** (treća `--accent`).
3. **contact-trust-strip** — boxed jedan **TXT** sa linkovima.
4. **contact-split** — boxed 2 kolone:  
   - **Levo** `contact-aside`: **H** + **TXT** → **Icon List** / kartice kanala (5 stavki: mail, WA, phone, location, founder) → **Container** hours (**ICN** + **TXT**) → **Social Icons**.  
   - **Desno** `contact-form-panel`: header (label, **H**, 2× **TXT**) → **FORM** polja u redovima (ime+email, company+topic select, budget select, textarea, honeypot, checkbox consent, submit **BTN**, footnote **TXT**).
5. **service-detail-faq** varijanta — 2 kolone, **ACC** stavke kontakt FAQ.
6. **contact-next** — header + **ordered list** 4 koraka (broj + **H** + **TXT**).
7. **contact-locations-section** — bg opciono → boxed: header (label, **H** H2, **TXT** lede) → **Container** row grid: kartica NY (**ICN**+tag, **H** H3, **TXT** tz, **Icon List** 2) → **Container** „bridge“ (**ICN** + **TXT**) → kartica Novi Sad (ista struktura + linkovi u bulletima) → **TXT** footnote.

---

### 21.11 How we work (`how-we-work`)

1. **page-hero** §20.1 (+ meta + CTA).
2. **NAV** jump link red.
3. **Sekcija** `after-email` — veliki **Container**: §20.4 intro grid + **ordered list** timeline (5 koraka: svaki **TXT** when + **H** + **TXT**) + **2 kartice** side-by-side (Cadence / Policy) + **TXT** callout kickoff checklist.
4. **services-page-category--alt** `pricing-expectations` — cat-head (ikona + **H** + **TXT** + link) + grid 6× **engage-factor-card** (**H** sa ikonom + **TXT**).
5. **service-detail-intro** `not-a-fit` — §20.4 stil, lista pills duža (6 stavki).
6. **lab-changelog** — cat-head + **ordered list** changelog stavki (time + **H** + **TXT**) + **TXT** foot.
7. **service-detail-faq** — 2 kolone + **ACC** (contracts FAQ).
8. **service-detail-cta** §20.2.

---

### 21.12 Kickoff checklist (`kickoff-checklist`)

1. **page-hero** §20.1 (bez CTA reda u HTML).
2. **main** `legal-page` boxed uža širina: **NAV** inline linkovi → **article**: **TXT** meta → **BTN** print → 6× **Container** `checklist-section` [**H**2 sa ikonom + **TXT** + **Icon List** ul] → **TXT** disclaimer.

---

### 21.13 Careers (`careers`)

1. **page-hero** §20.1 + labels row (section-label + evergreen badge opciono) + meta grid + aux linkovi.
2. **careers-jobs-wrap** — boxed: header (label, **H**, **TXT**) → **Container** filteri (2× **Select** ili JetSmartFilters + **BTN** clear + **TXT** rezultat) → **Listing Grid** ili ručno `ul` sa **careers-job-card** unutra (svaka kartica: top **H** link + tagovi **TXT**, **TXT** excerpt, foot compensation + 2× **BTN**).
3. **why-us** §20.8 (culture copy).
4. **service-detail-cta** §20.2.

---

### 21.14 Job description (svih 9 fajlova `careers-job-*.html`)

Ista **struktura**; menja se samo copy i meta.

1. **page-hero** `careers-job-detail-hero` — crumb + row labela (section-label + badge) + **H** H1 + **TXT** + row tagova (**TXT** × 3–5).
2. **NAV** jump: Overview, Responsibilities, Requirements, Compensation, Conditions, Process, Apply.
3. Boxed **2 kolone** layout:  
   - **Sidebar** `careers-job-detail-sidebar`: **H** „At a glance“ → **HTML** `<dl>` (dt/dd) iz JetEngine dynamic polja.  
   - **Prose** kolona: *(opciono)* evergreen callout box → **section** Overview (**H**2 + **TXT**) → Responsibilities (**H**2 + **Icon List**) → Requirements (**H**2 + lista + **H**2 Nice to have + lista) → Compensation (**H**2 + **TXT** + lista) → Conditions (**H**2 + lista + **TXT** EOE) → Process (**H**2 + ordered list).
4. **careers-job-detail-apply** full width: boxed **H**2 Apply + **TXT** + row **BTN** (mailto) + **BTN** (popup form JetFormBuilder) + **BTN** back.

**Fajlovi:** `careers-job-senior-product-designer`, `wordpress-web-designer`, `wordpress-senior-developer`, `product-manager`, `junior-web-designer`, `junior-ui-ux-designer`, `graphic-designer`, `full-stack-developer`, `appointment-setter`.

---

### 21.15 Legal (`privacy`, `terms`, `cookies`)

1. **page-hero** §20.1 (kratak).
2. Boxed: **NAV** legal linkovi (Privacy · Terms · Cookies) → **article** `legal-doc`: **TXT** meta → **H**2 / **H**3 / **TXT** / liste (ceo dokument u **Text Editor** ili Gutenberg + **Post Content** u Theme Builderu).

---

### 21.16 404 (`404`)

1. **error-page-section** — hero bg + geo → boxed: **TXT** kod 404 → **TXT** label → **H** H1 → **TXT** lede → row 3× **BTN** (Home, Work, Contact).

---

## 22. WordPress / Elementor dodela šablona

| WordPress tip | Elementor šablon |
|----------------|------------------|
| Front Page | Početna §21.1 |
| Page (About, Contact, …) | Jedna stranica = jedan template ili ručno |
| `project` single | Case study §21.6 (polja iz JetEngine) |
| `team_member` archive | Opciono; trenutno Team je sekcija na About/Home |
| Post category archive | Blog §21.8 |
| Single Post | Blog single §21.9 |
| 404 | §21.16 |

---

*Dokument generisan za CraftedPixel HTML prototip u ovom repou; vrednosti boja i radiusa iz `css/main.css`. Katalog sekcija usklađen sa `*.html` fajlovima u repou.*

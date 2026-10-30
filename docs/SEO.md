# SEO plan: Hon. Duncan Maina Mathenge website

A living document: updated whenever the site changes. Newest changes are in the log at the bottom.

## Goal

When someone searches for the MP, his constituency or his work, this site should be the first result, and links to it shared on WhatsApp, Facebook or X should show a proper preview.

Searches we want to win:

| Search | Page that should rank |
|---|---|
| Duncan Mathenge, Duncan Maina Mathenge, Mathenge Duncan Maina | Home, About |
| Nyeri Town MP, Member of Parliament Nyeri Town | Home |
| Nyeri Town projects, NG-CDF Nyeri Town projects | Projects |
| a school or road name + Nyeri (e.g. "Nyakinyua Primary classrooms", "Muthuaini Gatitu road", "St. Jude road Nyeri") | that project's page |
| Duncan Mathenge news, Nyeri Town MP news | News |
| Duncan Mathenge committees, Bills, cohesion committee | Parliament |
| contact Nyeri Town MP office | Contact |

## What is automated (runs on every build)

`npm run build` runs `vite build` and then `scripts/seo.mjs`, which reads the live content from Firestore (or the built-in content if Firestore can't be reached) and writes:

- **A separate HTML file per page** (home, About, Parliament, Projects, every project, News, Gallery, Contact), each with:
  - its own title and description, written from the page's content
  - a canonical link
  - social-sharing tags (Open Graph and X): title, description and image
  - structured data: a `Person` profile on Home and About (name, other spellings, role, party, National Assembly, university, social profiles), and breadcrumbs on every other page
  - a plain-text summary with links, for crawlers that don't run JavaScript
- **Share images**: each project page uses its own first photo; other pages use `public/og-image.jpg` (1200 × 630).
- **`sitemap.xml`** listing every page, and **`robots.txt`** pointing to it. The dashboard (`/admin`) is excluded.

So a project or story the office adds in the dashboard appears in the sitemap, with its own title and preview, at the next build and deploy. Nothing needs editing by hand.

In the browser, each project page also sets its own tab title.

## Status

Done
- [x] Per-page titles, descriptions, canonical links and social-sharing tags
- [x] Structured data (Person, WebSite, breadcrumbs)
- [x] Sitemap and robots.txt, generated from content
- [x] Share image; project photos used as previews
- [x] Crawler-readable summary on every page
- [x] Dashboard kept out of search results
- [x] 50 projects and 9 news stories, each with a descriptive title naming the place (each tarmacked road has its own page)

To do
- [ ] **Domain.** Put the live address in `site.config.js` → `siteUrl` (e.g. `"https://www.duncanmathenge.co.ke"`). Until then, canonical links and `sitemap.xml` are skipped.
- [ ] **Google Search Console.** Add the domain, verify it (DNS record in Cloudflare is easiest), then submit `https://<domain>/sitemap.xml`.
- [ ] **Bing Webmaster Tools.** Import the site from Search Console (one click).
- [ ] **Official social links.** Once the office confirms them, add them in the dashboard (Contact and social links). They are added to the `Person` data automatically, which helps Google link the site to his profiles.
- [ ] **Link the site from his profiles.** Website field on his Facebook page and X accounts, and ask Parliament / Mzalendo to list it.
- [ ] **Portrait photo.** Upload one; it will also replace the default share image on Home and About.
- [ ] **Projects without photos** (22), and more angles for the four roads (one photo each so far). Photos help image search and sharing.
- [ ] **Years for the video projects.** Dated content ranks better for "latest" searches.
- [ ] **Office address and phone.** Add them in the dashboard; then consider a Google Business Profile for the constituency office.

## Writing tips for the office

- Project titles: say **what** and **where** ("Two classrooms at Nyakinyua Primary School"), not just "Classroom project".
- Descriptions: one or two plain sentences. The first 155 characters become the search snippet.
- News: always paste the link to the original article.

## Change log

- **2026-10-30:** SEO set up: per-page HTML, structured data, share image, sitemap and robots generated at build from Firestore or built-in content.
- **2026-10-30:** Tarmacked roads split into four project pages (Muthuaini–Gatitu, Oil Com–Thunguma, St. Jude, Ngangarithi–Ciaraini), each with its own photo; the old combined page is retired and left out of the sitemap.
- **2026-10-30:** "Roads and water" split into separate **Roads** and **Water** categories (Roads: 6 projects, Water: 1).

# Zvěroklání — web

Jednostránkový statický web pro karetní hru Zvěroklání (edice Rychlost). Čisté HTML/CSS/JS, žádný build krok, žádný framework.

## Struktura

```
/
├── index.html
├── styles.css
├── script.js
├── assets/
│   ├── cards/   — 6 karet zvířat + rub
│   └── icons/   — drobné ikony prostředí + tlapkový motiv
├── CNAME        — vlastní doména pro GitHub Pages
└── README.md
```

## Lokální spuštění

Web nepotřebuje build ani server-side logiku, ale kvůli `fetch`/modulovým pravidlům prohlížečů je lepší ho servírovat přes lokální HTTP server, ne otevírat `index.html` přímo přes `file://`:

```bash
# Python
python3 -m http.server 8000

# nebo Node (npx, nic se neinstaluje natrvalo)
npx serve .
```

Pak otevři `http://localhost:8000`.

## Nasazení na GitHub Pages

1. Repozitář nahraj na GitHub (větev `main`).
2. V nastavení repozitáře **Settings → Pages** nastav zdroj („Source") na větev `main`, složku `/ (root)`.
3. Soubor `CNAME` v rootu už obsahuje `zveroklani.cz` — GitHub Pages doménu nastaví automaticky při dalším nasazení. Pokud bys doménu měnil přes GitHub UI, přepíše ti obsah `CNAME` sám.
4. Počkej na vygenerování SSL certifikátu (může trvat až pár desítek minut) a v nastavení Pages zaškrtni **Enforce HTTPS**.

## Vlastní doména (zveroklani.cz) — nastavení DNS

U registrátora domény nastav (aktuální oficiální hodnoty dle [GitHub Pages dokumentace](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)):

**Apex doména (`zveroklani.cz`)** — čtyři `A` záznamy směřující na GitHub Pages:

```
A     185.199.108.153
A     185.199.109.153
A     185.199.110.153
A     185.199.111.153
```

Volitelně i `AAAA` záznamy (IPv6):

```
AAAA  2606:50c0:8000::153
AAAA  2606:50c0:8001::153
AAAA  2606:50c0:8002::153
AAAA  2606:50c0:8003::153
```

**`www` subdoména** (pokud ji chceš také použít) — `CNAME` záznam mířící na tvůj GitHub Pages hostname (např. `<uzivatel>.github.io`, bez názvu repozitáře).

Než cokoli měníš, ověř aktuální hodnoty přímo v GitHub dokumentaci — mohou se změnit.

## Kde vyměnit kontaktní e-mail

Kontaktní adresa `petr.matl42@gmail.com` je **dočasná** (placeholder). Vyskytuje se na jediném místě:

- [`index.html`](index.html), sekce „Napiš nám" (`id="kontakt"`) — `mailto:` odkaz i viditelný text tlačítka. Místo v souboru je označené komentářem `<!-- PLACEHOLDER: ... -->`.

## Poznámka k optimalizaci obrázků

PNG karty v `assets/cards/` jsou z designového exportu a mají ~0,7–1,2 MB/kus. Zadání optimalizaci označuje jako nezávaznou; v tomto prostředí nebyl k dispozici nástroj na bezeztrátovou kompresi/WebP konverzi, takže obrázky zůstaly v původní kvalitě. Doporučený follow-up před ostrým nasazením: prohnat je přes `pngquant`/`cwebp` a doplnit `<picture>` s WebP variantou + PNG fallbackem, obrázky pod ohybem už mají `loading="lazy"`.

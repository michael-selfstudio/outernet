# outernet

The portfolio of Dilar — designer and artist in Istanbul, working as Outernet.
Built from the Figma file **my-website** (frames *Home v2 — Outernet (earth)*,
*Info — Outernet (v2 style)*, *Branding project — template*).

Static site: [Astro 7](https://astro.build), Sass, no framework on the client.
Hosted on Cloudflare Pages.

## Run it

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # type-check, then build to dist/
```

Node 22.23.4 or newer (`.nvmrc`).

## Edit the content

Everything on the site is a file in `src/content/` — editable straight on GitHub.

| What | Where |
|---|---|
| Index entries | `src/content/works/NNN-name.yaml` — one per work: number, kind, title, colour, size and side of the wall, optional cover image and case study |
| Case studies | `src/content/projects/<name>/index.yaml` + its images beside it |
| CV | `src/content/info/info.yaml` |
| Navigation, kinds of work, email | `src/lib/site.ts` |

**A new case study** is a copy of `src/content/projects/santosha/` with new words
and pictures; link it from a works entry with `project: <folder name>`.
Images go in at about twice the size they appear (≈2700px wide for full-width);
the build makes AVIF/WebP in every size the layout needs.

**A clip instead of a still:** put an `.mp4` in `public/video/` and add
`video: /video/name.mp4` next to the `image:` — the still shows first, the clip
fades in once it can play (muted, looping, never with reduced motion).

## Design system in code

- `src/styles/_tokens.scss` — colours, easing, and `k()`: every size is written in
  pixels of the 1440 design (`k(46)`) and scales with the window between 890 and
  1800px. Below 820px a mobile layout takes over.
- Fonts: Instrument Serif and DM Mono (Fontsource, self-hosted, Latin and
  Latin Extended split). The Santosha logotype and the Charis "Aa" are outlines
  exported from Figma — the client's brand face is not licensed for the web.

## Motion

- Page changes: the old page lifts and blurs, the new one rises (View Transitions).
  The header stays put; on the index, works glide between filters.
- Intro words arrive one by one; index pictures rise out of a mask; the cursor
  carries the name of the work under it (motion notes 2–3 in the Figma file).
- The Santosha identity card turns 160 grains of stardust on a canvas — the
  Figma "Spiral stars — seamless 20s motion", measured and redrawn.
- Colour swatches widen under the pointer and copy their value on click.

All of it switches off under `prefers-reduced-motion`.

## Deploy

Cloudflare Pages, connected to this repository:

- Production branch `main`; build `npm run build`; output `dist`.
- Every other branch gets a preview URL (not indexed — `public/_headers`).
- Once the domain is live, set `SITE_URL=https://<domain>` in the Pages project
  (Settings → Variables) so canonical links and share cards use it.

Release: merge `develop` into `main`, tag `X.Y.Z`, push both.

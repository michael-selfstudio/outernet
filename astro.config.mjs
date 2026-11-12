// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

// The production domain is not connected yet. Cloudflare Pages exposes the
// deployment URL as CF_PAGES_URL during the build, so canonical links and the
// sitemap point at whatever host is building; SITE_URL overrides it once the
// domain is live (set it in the Pages project → Settings → Variables).
const site = process.env.SITE_URL ?? process.env.CF_PAGES_URL ?? 'http://localhost:4321';

// Fonts are the Fontsource packages in node_modules, read from disk by the
// local provider: the build never reaches a CDN, and the woff2 files are
// served from the site itself. Each family is split like Google splits it —
// Latin and Latin Extended (Turkish: ş ğ İ ı) — so a page downloads the
// extended file only if it uses those letters. Astro writes metric-matched
// fallbacks for each family, so text does not jump when the font arrives.
const LATIN =
  'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
const LATIN_EXT =
  'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF';

/**
 * The @font-face variants of one Fontsource package at weight 400.
 * @param {string} pkg @param {('normal'|'italic')[]} styles @param {boolean} ext
 * @returns {[any, ...any[]]} non-empty, as the local provider requires
 */
const fontsource = (pkg, styles, ext = true) =>
  /** @type {[any, ...any[]]} */ (styles.flatMap((style) =>
    [['latin', LATIN], ...(ext ? [['latin-ext', LATIN_EXT]] : [])].map(([subset, range]) => ({
      src: [`./node_modules/@fontsource/${pkg}/files/${pkg}-${subset}-400-${style}.woff2`],
      weight: 400,
      style,
      unicodeRange: [range],
      display: 'swap',
    })),
  ));

const local = fontProviders.local();

export default defineConfig({
  site,
  trailingSlash: 'ignore',
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  fonts: [
    {
      provider: local,
      name: 'Instrument Serif',
      cssVariable: '--font-serif',
      options: { variants: fontsource('instrument-serif', ['normal', 'italic']) },
      fallbacks: ['Georgia', 'serif'],
    },
    {
      provider: local,
      name: 'DM Mono',
      cssVariable: '--font-mono',
      options: { variants: fontsource('dm-mono', ['normal']) },
      fallbacks: ['ui-monospace', 'monospace'],
    },
    {
      // Only the "Aa" specimen of the Santosha case study uses it.
      provider: local,
      name: 'Raleway',
      cssVariable: '--font-raleway',
      options: { variants: fontsource('raleway', ['normal'], false) },
      fallbacks: ['sans-serif'],
    },
  ],
});

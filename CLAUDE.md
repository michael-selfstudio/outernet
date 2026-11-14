# outernet — Claude Code rules

Dilar's portfolio site (Outernet), live at **https://dilarabilek.com**. A private
project, separate from Self Studio; it borrows the studio's working rules,
restated here so the repository stands on its own. Stack, content map and design
notes live in `README.md` — read it before the first change.

## Who you work with

Usually **Dilar herself**, in Claude Code on the web (claude.ai/code). She is the
designer, not a developer: she describes changes in plain words, judges them on
the preview, and doesn't run anything locally. So:

- Do the whole job: edit, `npm run build` to verify, commit, push. Never leave
  her a command to run.
- **Always end a change with the preview link** (see Deploy) and one or two
  plain sentences on what changed. No jargon, no diffs unless she asks.
- When something needs a picture or text from her, ask for exactly that.
- "Publish", "put it live", "release" → follow *Going live* below.

## Deploy

Cloudflare Pages project `outernet` builds every push (`npm run build` → `dist`):

- `main` → production, https://dilarabilek.com (≈2 min after the push).
- Any other branch → preview at `https://<alias>.outernet-5ee.pages.dev`, where
  the alias is the branch name lowercased, every character that isn't a–z or
  0–9 turned into `-`, cut to 28 characters (`claude/new-cover` →
  `claude-new-cover.outernet-5ee.pages.dev`). `develop` previews at
  `develop.outernet-5ee.pages.dev`. Previews are noindexed by `public/_headers`.
- Cloudflare also posts the exact preview link on every pull request.
- `SITE_URL=https://dilarabilek.com` is set for production only.
- GitHub Actions (`check.yml`) type-checks and builds every push and PR.

## Git

- **GitFlow.** `develop` is the working branch and the GitHub default; `main`
  carries releases only, each tagged with bare semver `X.Y.Z` (no `v`).
  Work happens on a branch off `develop` — `feature/<topic>` locally, or the
  `claude/…` branch a web session is given — and lands in `develop` through a
  pull request. Urgent production fixes branch `hotfix/<topic>` off `main` and
  merge into both. No other long-lived branches.
- **Commit and push as you go.** Every finished change is committed at once and
  pushed in the same step; a session never ends with uncommitted or unpushed work.
- **Commit titles are a verdict in NYT style** ("Case study gains a starfield").
- **Sign with the person's name.** `user.name` / `user.email` are the human
  running the session; the model goes in a `Co-Authored-By` trailer.
- Start with `git status` and `git log -3`. Uncommitted changes you did not make
  are someone else's work in progress: report them, don't touch them.
- Never `push --force`, `reset --hard`, or `stash` someone else's changes.

## Going live

1. In the session's branch, bump `version` in `package.json` — patch for content
   and fixes (0.1.0 → 0.1.1), minor for new features or pages. Commit, push,
   open the pull request into `develop`, and ask her to merge it.
2. Open a pull request **`develop` → `main`** titled with the version. If you
   can't, give her this link to do it in two clicks:
   https://github.com/michael-selfstudio/outernet/compare/main...develop
3. Once she merges it, `release.yml` tags `main` with the version, and the site
   updates at https://dilarabilek.com in about two minutes.

## Code

- Astro 7 (static), Sass, TypeScript strict. Astro 7 is newer than most training
  data — read `node_modules/astro` types before relying on an API from memory.
- **The design is the source.** Figma file "my-website"; every size in the code is
  in pixels of the 1440-wide design, written `k(46)` (see `src/styles/_tokens.scss`).
  At 1440 wide the site must match Figma.
- Comments say *why*, not what — the reason a value is what it is, with its source.
- Content belongs in `src/content/`, never hardcoded in components.
- Images: about twice their displayed size; the build makes AVIF/WebP. Keep
  originals under ~5 MB.
- Respect `prefers-reduced-motion` and `(hover: hover)` in every new interaction.
- Run `npm run build` before every push; a failing build never goes up.
- No personal data beyond what Dilar publishes on the site herself.

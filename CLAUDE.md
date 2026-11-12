# outernet — Claude Code rules

Dilar's portfolio site (Outernet). A private project, separate from Self Studio;
it borrows the studio's working rules, restated here so the repository stands on
its own. Stack and design notes live in `README.md`.

## Git

- **GitFlow.** `develop` is the working branch and the GitHub default; `main`
  carries releases only, each tagged with bare semver `X.Y.Z` (no `v`).
  Tasks branch `feature/<topic>` off `develop`; urgent production fixes branch
  `hotfix/<topic>` off `main` and merge into both. No other long-lived branches.
- **`main` is production.** Cloudflare Pages deploys `main` to the live domain;
  every other branch gets a preview URL on `*.pages.dev` (kept out of search by
  `public/_headers`).
- **Commit and push as you go.** Every finished change is committed at once and
  pushed in the same step; a session never ends with uncommitted or unpushed work.
- **Commit titles are a verdict in NYT style** ("Case study gains a starfield").
- **Sign with the person's name.** `user.name` / `user.email` are the human
  running the session; the model goes in a `Co-Authored-By` trailer.
- Start with `git status` and `git log -3`. Uncommitted changes you did not make
  are someone else's work in progress: report them, don't touch them.
- Never `push --force`, `reset --hard`, or `stash` someone else's changes.

## Code

- Astro 7 (static), Sass, TypeScript strict. Astro 7 is newer than most training
  data — read `node_modules/astro` types before relying on an API from memory.
- **The design is the source.** Figma file "my-website"; every size in the code is
  in pixels of the 1440-wide design, written `k(46)` (see `src/styles/_tokens.scss`).
  At 1440 the site must match Figma; the QA routine in `README.md` checks it.
- Comments say *why*, not what — the reason a value is what it is, with its source.
- Content belongs in `src/content/`, never hardcoded in components.
- Respect `prefers-reduced-motion` and `(hover: hover)` in every new interaction.
- No personal data beyond what Dilar publishes on the site herself.

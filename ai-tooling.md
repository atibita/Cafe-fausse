# AI Tooling Notes — Café Fausse Development Session

> A candid retrospective on using Claude as a development collaborator for a full-stack web application project. Written to help future sessions start faster and go further.

---

## 1. What We Built Together

In a single multi-turn conversation, Claude and I produced a complete deliverable starting only from a Software Requirements Specification (SRS) document:

| Deliverable | Detail |
|---|---|
| Flask backend | App factory, SQLAlchemy models, two API blueprints, config system, error handlers |
| React frontend | 5 pages, 2 shared components, global design system, Axios utility |
| PostgreSQL schema | `customers` and `reservations` tables with constraints |
| CSS design system | Full token set — colors, typography, spacing, Flexbox/Grid layouts |
| Deployment guide | Local dev, Nginx + Gunicorn, Docker Compose, test suite, troubleshooting |
| Interactive UI demo | Live widget showing 3 image scroll patterns with copy-able code |
| This document | Retrospective on the collaboration itself |

Total files produced: **31 source files + 1 zip archive**.

---

## 2. How the Session Was Structured

The conversation unfolded in four natural phases:

### Phase 1 — Upload context, make a large request
I uploaded the Software Requirements Specification (SRS) PDF and wrote a single, dense prompt covering the entire scope: React + Flask + PostgreSQL, all five pages, reservation logic, newsletter signup, responsive design, validation, and documentation. Claude read the SRS and immediately began generating files systematically — backend first, then frontend.

**What this told me:** Claude works best when given all constraints upfront in one message rather than drip-fed requirements. It used the SRS as a ground truth and cross-referenced it (e.g., "FR-6 through FR-9" comments in the reservation route).

### Phase 2 — Interrupt for a specific sub-task
Before the frontend was complete, I pivoted to ask specifically for deployment instructions. Claude generated a standalone `README.md` covering local setup, production options, testing, and a security checklist — without losing context of the larger project.

**What this told me:** Claude handles mid-task pivots cleanly when the pivot is clearly scoped. It doesn't require you to "finish" one thing before starting another.

### Phase 3 — Request a bulk deliverable
I asked to share all files for download. Claude noticed that two pages (`AboutUs.jsx`, `Gallery.jsx`) had been cut off earlier in the session due to length, created them on the spot, then packaged everything into a zip. The zip was offered alongside individual file links.

**What this told me:** Claude tracks what it has and hasn't produced. It self-corrected without being told there were missing files.

### Phase 4 — Deep-dive on a specific feature
I asked about configuring image scrolling on the home page. Rather than a text answer, Claude built an interactive widget showing all three scroll patterns (carousel, marquee strip, staggered grid reveal) with live controls, copy-able code blocks, and a decision table. The code was styled to match the existing project design tokens.

**What this told me:** For UI/UX questions, asking for an illustration or demo produces far more useful output than asking for an explanation.

---

## 3. What Worked Well

### Translating a specification document directly into code
Uploading the SRS as the first message set a shared reference for the entire session. Claude mapped every functional requirement (FR-1 through FR-18) and non-functional requirement to specific code locations. Comments like `# Implements FR-7, FR-8` appeared in the generated files without being asked for, making traceability straightforward.

**Recommendation:** Always upload your requirements document (SRS, PRD, Figma annotations, user stories) before writing any prompt. It replaces a lot of back-and-forth.

### Generating coherent multi-file projects
Claude maintained a consistent design system across 31 files — the same CSS variables appeared in `global.css`, `Navbar.css`, `Home.css`, etc. The Flask blueprints shared the same error-handling patterns. The React pages all used the same Axios instance from `utils/api.js`. This coherence would have required careful discipline if done manually.

**Recommendation:** Name the design system early in your prompt ("use CSS custom properties for all colors and spacing"). Claude will honour that instruction across every file it generates.

### Writing security-conscious backend code
Without being prompted, Claude used: parameterised queries via SQLAlchemy (no raw SQL), regex validation on both client and server, a `SECRET_KEY` loaded from environment variables, CORS scoped to explicit origins, and a `db.session.rollback()` in the 500 error handler. The `.env.example` was generated alongside the code, not as an afterthought.

**Recommendation:** You still need to review generated security code — but Claude's defaults lean toward best practices rather than away from them.

### Documentation that matches the actual code
The `README.md` was generated after most of the source files existed, so the deployment instructions reference real file paths, real environment variable names, and real Flask CLI commands that match the `app.py` factory pattern. It is not generic boilerplate.

**Recommendation:** Generate documentation after code, not before. Ask Claude to write the README once the main implementation is done so it can self-reference accurately.

### Interactive visual explanations
When asked about image scroll configuration, Claude produced a working interactive widget — three tabbed demos with live controls (autoplay toggle, speed slider, direction toggle), copy buttons on code blocks, and a decision guide. This was more useful than any written explanation would have been.

**Recommendation:** For UI/UX questions, ask for a "live demo" or "interactive illustration" explicitly. The output is substantially richer than asking Claude to "explain" something.

---

## 4. What Didn't Work As Well

### Long sessions cause context loss
The `AboutUs.jsx` and `Gallery.jsx` pages were started but not completed during the initial file-generation run — the context window filled up mid-session. Claude did not flag this proactively; the gap was only discovered when all files were requested for download. Claude then created the missing files correctly, but the interruption added an extra round-trip.

**Mitigation:** For large projects, break the initial generation into explicit batches: "generate the backend files first, then confirm before starting the frontend." This gives you natural checkpoints to verify completeness.

### No live execution environment
All generated code was syntactically correct and logically sound, but it could not be run and tested inside the session and some libraries or functions used were deprecated. The Flask server could not start, `npm install` could not run, and no browser rendered the React output. Bugs that only surface at runtime — a missing import, a mis-typed CSS class name, an incorrect API URL — would only appear after the session ended.

**Mitigation:** After downloading the files, run the backend tests first (`pytest tests/ -v`) before touching the frontend. They will catch the most common issues. For the frontend, `npm start` will surface any import errors immediately in the terminal. All generate testing files.

### No real images
The Gallery page and all visual placeholders use emoji + CSS background colours as stand-ins for actual photographs. This is the correct approach for a scaffold (you cannot embed real restaurant photos in a code generator), but it means the visual impression of the live site will differ significantly from the generated demo until real images are swapped in. At the end we generated images with Gemini AI and integrate them to the application.

**Mitigation:** Prepare a folder of real photos before integrating. Each gallery item in `Gallery.jsx` has an explicit `bg` (background colour) and `emoji` field — replace those with `src` (image path) and update the `<img>` tags. The CSS grid and lightbox logic require no changes. Make sure to also define appropriates images size for a better rendering during integration.

### Prompt length required careful crafting
The initial prompt was very long and covered many concerns simultaneously. While Claude handled it well in this session, overly broad prompts can sometimes produce code that satisfies all requirements at surface level but lacks depth in any one area. In this case, the reservation logic (FR-7 through FR-9) was fully implemented, but a shorter, more focused session would allow deeper work on, say, admin authentication or email confirmation flows.

**Mitigation:** Treat the generated application as a working scaffold, not a finished product. Use focused follow-up sessions for each feature area: one session for auth, one for email notifications, one for an admin dashboard.

---

## 5. Prompt Patterns That Produced the Best Results

These prompt structures consistently generated high-quality output throughout the session:

```
# Pattern 1 — Spec-anchored generation
"Based on [attached SRS], generate [specific file].
 Map each requirement to a comment in the code."

# Pattern 2 — Constraint-first
"Using React and CSS custom properties (no CSS-in-JS),
 build [component] with [specific behaviour].
 Accessibility: keyboard navigation + aria-labels."

# Pattern 3 — Role-framing
"As an experienced full-stack developer, generate [file].
 Use development best practices: env vars for secrets,
 input validation on both client and server,
 meaningful error messages."

# Pattern 4 — Ask for illustration, not explanation
"Illustrate [concept] with an interactive demo.
 Include copy-able code and a decision guide."

# Pattern 5 — Self-referential documentation
"Now that the source files are written, generate
 a README.md that references the actual file paths
 and command names in the codebase."
```

---

## 6. Recommended Workflow for Future Sessions

Based on this session, the following workflow would be more efficient for a project of similar scope:

```
Session 1 — Scaffold
  Upload: SRS / design spec / wireframes
  Prompt: "Generate the backend — models, routes, app factory.
           Stop before the frontend."
  Action: Download, run pytest, fix any issues locally.

Session 2 — Frontend shell
  Upload: SRS + any brand assets
  Prompt: "Generate the design system (global.css + tokens)
           and shared components (Navbar, Footer).
           Stop before the pages."
  Action: npm start, verify the shell renders correctly.

Session 3 — Pages (one at a time)
  Prompt: "Generate [PageName].jsx and [PageName].css.
           Reference the design tokens in global.css."
  Repeat per page. Shorter prompts = more focused output.

Session 4 — Deployment + docs
  Prompt: "Now that all files exist, write a README.md
           with deployment instructions for Nginx + Gunicorn
           and Docker Compose."

Session 5 — Feature deep-dives
  Prompt: "Show me how to add [specific feature] to the
           existing [file]. Keep the same code style."
```

---

## 7. Things to Always Ask Claude to Do

These additions cost little prompt space but significantly improve output quality:

- `"Add JSDoc / docstring comments to all functions."` — Claude writes thorough inline documentation when asked.
- `"Follow accessibility best practices: aria-labels, keyboard nav, focus management."` — Without this, aria attributes are sometimes sparse.
- `"Use environment variables for all secrets. Generate a .env.example."` — Claude will otherwise sometimes hardcode values.
- `"Add a prefers-reduced-motion media query to all CSS animations."` — Omitted by default unless requested.
- `"Show a decision guide: when to use each approach."` — Particularly useful for architecture and UX pattern questions.

---

## 8. Things Not to Expect From Claude

- **Running the code.** Claude cannot execute the Flask server, run npm, or show a rendered browser screenshot. All verification happens locally after download.
- **Fetching real assets.** Images, fonts beyond Google Fonts, icons, or any external resource that requires authentication cannot be embedded.
- **Remembering previous sessions.** Each new conversation starts fresh unless you use Claude Projects or re-upload the relevant files. Paste key context (design tokens, model names, route prefixes) at the start of any follow-up session.
- **Guaranteeing zero runtime bugs.** Generated code is syntactically correct and logically consistent, but integration bugs — a CORS misconfiguration, a missing or deprecated `npm` package, a PostgreSQL permission error — only surface in a running environment.

---

## 9. Overall Assessment

Using Claude as a development collaborator on this project compressed what would typically be several days of scaffolding work into a single conversation. The highest-value use cases were:

1. **Translating a structured requirements document into working code** — the SRS-to-implementation mapping was accurate and well-annotated.
2. **Maintaining design consistency across many files** — the CSS design system was coherent end-to-end without any manual enforcement.
3. **Generating thorough documentation** — the README covered local dev, two production deployment paths, a full test suite, and a security checklist.
4. **Explaining concepts visually** — the interactive scroll-pattern demo was more useful than any written tutorial.

The session worked best when treated as a **pair programming session with a very fast typist**: you provide intent and constraints, Claude produces a first draft, you review and redirect. The moments it worked least well were when the session grew long enough that context was implicitly lost — a problem solved by breaking large scopes into explicit, bounded phases.

---

*Café Fausse project — Washington, D.C. · Est. June 2026*

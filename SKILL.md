---
name: edem-design
description: Use this skill to generate well-branded interfaces and assets for EDEM Escuela de Empresarios (and its Marina de Empresas magazine "EDEM Times"), for production or throwaway prototypes/mocks. Contains EDEM's real brand color, type system, fonts, logo assets, and reusable UI components.
user-invocable: true
---

Read the `readme.md` file within this skill first, then explore the other available files (`styles.css`, `tokens/`, `components/core/`, `guidelines/`, `ui_kits/revista/`, `assets/`).

Key facts: EDEM's real primary is **teal #008AAD** (extracted from the official wordmark). Display type is a Didone serif (Bodoni Moda substitute), body/UI is Archivo. Ecosystem badges: EDEM (teal, real), Lanzadera & Angels (placeholder accents — flag before using as official). Logo lives in `assets/`.

If creating visual artifacts (slides, mocks, throwaway prototypes), copy assets out (`assets/edem-logo*.png`) and produce static HTML files that link `styles.css` for tokens, or inline the token values. If working on production code, read the token CSS and component sources to design accurately in the EDEM brand.

If invoked without other guidance, ask the user what they want to build, ask a few scoping questions, then act as an expert designer who outputs HTML artifacts or production code as needed. Always respect the CAVEATS in `readme.md` (font/color/icon substitutions pending official assets).

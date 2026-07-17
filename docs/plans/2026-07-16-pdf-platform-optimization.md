# PDF Platform Optimization and New Tools Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Improve production safety and add three useful PDF tools: rotate PDF, extract pages, and add text watermarks.

**Architecture:** Keep the existing Next.js 15 + NestJS + Stirling-PDF architecture and synchronous task/download flow. Add narrowly scoped NestJS endpoints backed by the existing Stirling adapter, then build dedicated frontend pages using the existing conversion shell. Do not restructure the root layout or perform the previously failed locale-route migration in this release.

**Tech Stack:** Next.js 15, React 18, TypeScript, Tailwind CSS, NestJS 10, TypeORM/MySQL, Jest, Stirling-PDF, PM2, Nginx.

---

## Scope and Safety Constraints

- Preserve `frontend/src/app/layout.tsx`, especially the root `body`, `Providers`, `min-h-screen flex flex-col`, Header, `main.flex-1`, and Footer structure.
- Do not add a second `<html>` or `<body>` to new tool routes.
- Do not migrate to `[locale]` routing in this release.
- Do not modify or delete unrelated Nginx server blocks.
- Do not disable TypeORM synchronization until a database backup and schema baseline exist. This release only makes it environment-controlled.
- Use strict TDD for backend behavior and pure frontend utilities.
- Verify every new Stirling endpoint against the running service before enabling production UI.

## Release 1: Production Foundation

### Task 1: Establish a backend test baseline

**Objective:** Make backend tests discoverable and add a minimal test command for the files changed by this release.

**Files:**
- Modify: `backend/package.json`
- Move or adapt: `backend/test/stirling-pdf.smart.spec.ts`
- Create: `backend/src/health/health.controller.spec.ts`

**Steps:**
1. Add a failing health controller test first.
2. Run the focused Jest command and verify it fails because the controller does not exist.
3. Adjust Jest discovery without breaking the existing build.
4. Run all backend tests and record the baseline.
5. Commit as `test: establish backend test baseline`.

### Task 2: Trust only the local reverse proxy

**Objective:** Make `request.ip` represent the real client when requests pass through local Nginx, while preventing forged forwarded headers on direct connections.

**Files:**
- Modify: `backend/src/main.ts`
- Create: `backend/src/common/utils/request-ip.spec.ts` if extraction is needed

**Steps:**
1. Write a failing integration/unit test for trusted loopback proxy behavior.
2. Configure Express `trust proxy` as `loopback` before listening.
3. Bind the backend to `127.0.0.1` in production; preserve development usability.
4. Build and run the focused test.
5. Verify the public Nginx path and direct backend path separately.
6. Commit as `fix: trust local proxy for client ip`.

### Task 3: Add live and ready health endpoints

**Objective:** Expose process liveness and dependency readiness without adding a new package.

**Files:**
- Create: `backend/src/health/health.controller.ts`
- Create: `backend/src/health/health.module.ts`
- Create: `backend/src/health/health.controller.spec.ts`
- Modify: `backend/src/app.module.ts`

**Behavior:**
- `GET /api/health/live` returns 200 with process status and timestamp.
- `GET /api/health/ready` checks MySQL with `SELECT 1` and Stirling-PDF with the existing `healthCheck()` method.
- Readiness returns 503 with per-dependency status when either dependency is unavailable.

**Steps:**
1. Write failing tests for live success, ready success, database failure, and Stirling failure.
2. Implement the minimal controller/module.
3. Run focused tests, then all backend tests.
4. Build backend and verify both endpoints locally.
5. Commit as `feat: add backend health checks`.

### Task 4: Make environment and schema synchronization explicit

**Objective:** Stop relying on ambiguous env loading and prepare production for migrations without risking an immediate schema outage.

**Files:**
- Modify: `backend/src/app.module.ts`
- Modify: `backend/.env.example`
- Modify: `backend/.env.production` only if the file remains intentionally tracked
- Modify: `.gitignore`

**Behavior:**
- Production loads `.env.production`; development loads `.env`.
- `TYPEORM_SYNCHRONIZE` controls synchronization and defaults to false.
- Production deployment explicitly chooses the current safe value until a schema baseline is created.
- Secret env files are ignored; examples contain no credentials.

**Steps:**
1. Add configuration tests for env selection and boolean parsing.
2. Implement explicit env selection and synchronization parsing.
3. Export and retain a database schema backup before setting production synchronization to false.
4. Build and perform a startup test against the current database.
5. Commit as `chore: make production database config explicit`.

## Release 2: Backend PDF Operations

### Task 5: Add validated PDF operation DTOs and task types

**Objective:** Define strict multipart contracts for rotate, extract, and text watermark operations.

**Files:**
- Create: `backend/src/modules/conversion/dto/rotate-pdf.dto.ts`
- Create: `backend/src/modules/conversion/dto/extract-pages.dto.ts`
- Create: `backend/src/modules/conversion/dto/text-watermark.dto.ts`
- Modify: `backend/src/modules/task/task.entity.ts`
- Modify: `backend/src/modules/stirling-pdf/stirling-pdf.interface.ts`
- Create: DTO spec files under `backend/src/modules/conversion/dto/`

**Contracts:**
- Rotate v1: one global angle, `90 | 180 | 270`.
- Extract: `pageNumbers` using `1,3-5,8` syntax; output is one PDF.
- Text watermark: text, font size, rotation, opacity, spacing, and hex color.

**Steps:**
1. Write failing validation tests for valid and invalid multipart strings.
2. Implement DTOs using `class-validator` and `class-transformer`.
3. Add `ROTATE_PDF`, `EXTRACT_PAGES`, and `PDF_TEXT_WATERMARK` task types with `.pdf` output.
4. Run DTO and entity tests.
5. Commit as `feat: define pdf operation contracts`.

### Task 6: Implement Stirling-PDF adapters

**Objective:** Add tested adapter methods for the three PDF operations.

**Files:**
- Modify: `backend/src/modules/stirling-pdf/stirling-pdf.service.ts`
- Create: `backend/src/modules/stirling-pdf/stirling-pdf.operations.spec.ts`

**Endpoints:**
- Rotate: verify the running Stirling endpoint and form field names before coding; expected family is `/api/v1/general/rotate-pdf`.
- Extract: use `/api/v1/general/rearrange-pages` with `customMode=CUSTOM`; never use `remove-pages` to extract.
- Text watermark: verify `/api/v1/misc/add-watermark` and all form field names against the running version.

**Steps:**
1. Probe the running Stirling OpenAPI/Swagger endpoints and save the verified contract in test fixtures or comments.
2. Write failing adapter tests asserting endpoint and multipart fields.
3. Implement `rotatePdf`, `extractPages`, and `addTextWatermark`.
4. Fix `splitPages(mergeAll)` to use extraction/rearrangement rather than deletion, with a regression test.
5. Run focused and full backend tests.
6. Commit as `feat: add stirling pdf operation adapters`.

### Task 7: Implement conversion services and HTTP endpoints

**Objective:** Expose secure task-producing API endpoints for the new operations.

**Files:**
- Modify: `backend/src/modules/conversion/conversion.service.ts`
- Modify: `backend/src/modules/conversion/conversion.controller.ts`
- Modify: `backend/src/modules/upload/upload.service.ts`
- Create: `backend/src/modules/conversion/conversion.operations.spec.ts`
- Create: `backend/src/modules/conversion/conversion.controller.spec.ts`

**Endpoints:**
- `POST /api/convert/rotate`
- `POST /api/convert/extract-pages`
- `POST /api/convert/watermark/text`

**Steps:**
1. Write failing service tests for file validation, task type, output path, expiry, and failures.
2. Extract a private single-PDF operation helper to avoid copying the existing synchronous workflow.
3. Implement the three conversion service methods.
4. Write failing multipart controller tests, then implement routes.
5. Ensure failed operations do not save completed tasks or leave partial output files.
6. Add semantic download names: `-rotated.pdf`, `-extracted.pdf`, `-watermarked.pdf`.
7. Run all backend tests and build.
8. Commit as `feat: expose rotate extract and watermark APIs`.

### Task 8: Verify real Stirling transformations

**Objective:** Prove that generated files contain the expected transformation rather than merely receiving HTTP 200.

**Files:**
- Create: `backend/test/fixtures/multipage.pdf`
- Create: `backend/test/pdf-operations.integration.spec.ts`

**Steps:**
1. Create or add a deterministic three-page fixture with identifiable page content.
2. Verify rotation metadata/rendering.
3. Verify extracted page count and order.
4. Verify watermark output differs from input and remains readable as PDF.
5. Run integration tests against the deployed Stirling container.
6. Commit as `test: verify pdf operations against stirling`.

## Release 3: Frontend Tools

### Task 9: Add shared frontend request and page-expression utilities

**Objective:** Centralize API error handling and page range parsing for the new pages.

**Files:**
- Create: `frontend/src/lib/pdf-tool-request.ts`
- Create: `frontend/src/lib/pdf-page-expression.ts`
- Create: corresponding test files after adding Vitest, or test with a minimal TypeScript runner if dependency changes are deferred

**Steps:**
1. Write failing tests for `1`, `1,3-5`, duplicates, invalid ranges, zero, and out-of-range pages.
2. Implement parser and serializer.
3. Implement a shared multipart task request helper.
4. Run tests and TypeScript checks.
5. Commit as `feat: add shared pdf tool utilities`.

### Task 10: Build the rotate PDF page

**Objective:** Let users upload a PDF, choose a rotation, submit it, and download the result.

**Files:**
- Create: `frontend/src/app/rotate-pdf/page.tsx`
- Create: `frontend/src/app/rotate-pdf/client-page.tsx`
- Reuse: existing `FileUploader`, `ConversionProgress`, `DownloadButton`, and `ConversionPageTemplate` where appropriate

**Scope:**
- Release v1 supports whole-document rotation only, matching the backend contract.
- Per-page rotation is deferred until the Stirling version and page-map contract are verified.

**Steps:**
1. Create SEO metadata and JSON-LD using existing page patterns.
2. Build an editing state that does not upload immediately after file selection.
3. Add 90/180/270 controls and a rotate action.
4. Submit to `/convert/rotate` and reuse task/download components.
5. Verify light/dark themes and mobile layout.
6. Commit as `feat: add rotate pdf page`.

### Task 11: Build the extract pages page

**Objective:** Let users select a page expression and generate one PDF containing only those pages.

**Files:**
- Create: `frontend/src/app/extract-pages/page.tsx`
- Create: `frontend/src/app/extract-pages/client-page.tsx`
- Reuse/adapt: `frontend/src/components/remove-pages/PageExpressionInput.tsx`

**Steps:**
1. Add SEO metadata and JSON-LD.
2. Upload and parse PDF page count in the browser.
3. Add page-expression input with immediate validation and summary.
4. Submit normalized `pageNumbers` to `/convert/extract-pages`.
5. Verify invalid/empty/out-of-range selections never submit.
6. Commit as `feat: add extract pdf pages page`.

### Task 12: Build the PDF text watermark page

**Objective:** Let users configure and preview a text watermark before generating a watermarked PDF.

**Files:**
- Create: `frontend/src/app/pdf-watermark/page.tsx`
- Create: `frontend/src/app/pdf-watermark/client-page.tsx`
- Create: `frontend/src/components/pdf-tools/WatermarkControls.tsx`

**Scope:**
- Release v1 supports text watermarks.
- Image watermarks and per-page scope are deferred until named multipart file support and the deployed Stirling contract are verified.

**Steps:**
1. Add SEO metadata and JSON-LD.
2. Add text, size, color, opacity, rotation, and spacing controls.
3. Add a CSS preview that does not mutate the PDF canvas.
4. Validate fields before submission.
5. Submit to `/convert/watermark/text` and reuse task/download flow.
6. Commit as `feat: add pdf text watermark page`.

### Task 13: Add bilingual navigation and discovery entries

**Objective:** Make all three tools discoverable without breaking current custom i18n.

**Files:**
- Modify: `frontend/messages/zh.json`
- Modify: `frontend/messages/en.json`
- Modify: `frontend/src/components/layout/Header.tsx`
- Modify: `frontend/src/app/page.tsx`
- Modify: `frontend/src/app/sitemap.ts`

**Steps:**
1. Add matching Chinese and English keys.
2. Add all three tools to desktop and mobile navigation; remove the mobile six-item truncation safely.
3. Add homepage Bento cards.
4. Add sitemap entries and canonical metadata paths.
5. Validate both message files have identical key structures.
6. Confirm `frontend/src/app/layout.tsx` is unchanged.
7. Commit as `feat: expose new pdf tools in navigation`.

## Release 4: Deployment and Verification

### Task 14: Align upload and proxy limits

**Objective:** Make frontend, NestJS, and Nginx enforce one documented upload policy.

**Files:**
- Modify: conversion interceptors/config as needed
- Modify: `nginx/nginx.conf` only inside the PDF application's `/api/` locations
- Modify: frontend upload copy/constants

**Steps:**
1. Decide and document one single-file limit and a safe aggregate merge limit.
2. Add backend Multer limits and tests.
3. Add Nginx `client_max_body_size` and 130-second API proxy timeouts to the two PDF API locations only.
4. Run `nginx -t`; do not alter unrelated servers.
5. Test below-limit and above-limit uploads.
6. Commit as `fix: align upload and proxy limits`.

### Task 15: Full regression and production rollout

**Objective:** Verify, build, restart, and smoke-test the complete release.

**Verification commands:**
- `npm --prefix backend test -- --runInBand`
- `npm --prefix backend run build`
- `npm --prefix frontend run build`
- `npx tsc --noEmit` from `frontend/`
- `nginx -t`
- PM2 reload using the existing ecosystem file

**Smoke tests:**
- Existing PDF-to-Word flow still completes and downloads.
- Rotate 90 degrees produces a readable rotated PDF.
- Extract `1,3` from a three-page fixture produces a two-page PDF in order.
- Text watermark produces a readable watermarked PDF.
- `/api/health/live` and `/api/health/ready` return expected statuses.
- Home, Header, mobile menu, dark mode, English switch, and sitemap expose all tools.
- Git diff confirms no unintended root-layout or unrelated Nginx changes.

**Commit:** `feat: release pdf platform optimization and tools`

## Deferred Backlog

- Image watermarks for PDF.
- Per-page rotation and thumbnail editor virtualization.
- Separate-page extraction as ZIP.
- Full `/zh` and `/en` server-rendered locale routing and hreflang SEO.
- Redis/atomic rate limiting for horizontal scaling.
- Bull queue activation for large asynchronous jobs.
- OCR-to-searchable-PDF and PDF-to-Markdown.
- AI PDF summary and chat with quotas/cost controls.

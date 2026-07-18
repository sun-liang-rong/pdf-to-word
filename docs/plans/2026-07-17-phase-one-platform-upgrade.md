# Phase One Platform Upgrade Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Upgrade the existing synchronous document converter with reliable error contracts, resumable recent tasks, quota visibility, explicit OCR controls, sequential batch conversion, richer results, and stronger readiness checks without changing the current deployment architecture.

**Architecture:** Keep the existing synchronous conversion and task/download flow for this release. Add stable API response types and browser-side task persistence, then build batch conversion as a bounded sequential client over the existing endpoint. Defer real cancellation/retry, Bull workers, PDF password tools, and ZIP batching until migrations and live Stirling contracts are established.

**Tech Stack:** NestJS 10, TypeORM/MySQL, Next.js 15 App Router, React 18, TypeScript, Axios, Jest, localStorage, Stirling PDF.

**Protected surfaces:** Do not modify `frontend/src/app/layout.tsx`, Nginx configuration, Docker service topology, root theme initialization, or unrelated dirty UI files. Preserve existing changes in every dirty file.

---

### Task 1: Establish stable API errors

**Objective:** Return safe, machine-readable errors while preserving the existing top-level `message` field.

**Files:**
- Create: `backend/src/common/errors/application-error.ts`
- Modify: `backend/src/common/filters/global-exception.filter.ts`
- Modify: `backend/src/main.ts`
- Create: `backend/src/common/filters/global-exception.filter.spec.ts`
- Modify: `frontend/src/lib/pdf-tool-request.ts`

**Steps:**
1. Write failing filter tests for typed errors, validation errors, request IDs, and hidden internal details.
2. Run the focused Jest test and confirm expected failures.
3. Implement `ApplicationError`, stable codes, request-id propagation, and production-safe fallback messages.
4. Register the filter globally and centralize frontend error parsing.
5. Run focused tests and the backend suite.

### Task 2: Enrich task status and output metadata

**Objective:** Make the task endpoint the single source of truth for downloads, expiration, names, and file sizes.

**Files:**
- Modify: `backend/src/modules/task/task.controller.ts`
- Modify: `backend/src/modules/task/task.service.ts`
- Modify: `backend/src/modules/upload/upload.service.ts`
- Modify: `backend/src/modules/upload/upload.controller.ts`
- Create/modify: task and upload Jest specs
- Create: `frontend/src/types/task.ts`
- Modify: `frontend/src/components/conversion/ConversionProgress.tsx`
- Modify: `frontend/src/components/conversion/DownloadButton.tsx`

**Steps:**
1. Add failing tests for completed, failed, expired, and missing-output task responses.
2. Return `updatedAt`, `expiresAt`, `outputFileName`, `inputSize`, `outputSize`, and `canDownload`.
3. Handle download stream errors safely.
4. Consume the typed task result in the frontend; stop guessing output names.
5. Verify focused tests, backend build, and frontend typecheck.

### Task 3: Add recent tasks and refresh recovery

**Objective:** Restore current and completed anonymous tasks after refresh without exposing tasks by IP.

**Files:**
- Create: `frontend/src/lib/recent-tasks.ts`
- Create: `frontend/src/components/conversion/RecentTasks.tsx`
- Modify: `frontend/src/components/conversion/ConversionPageTemplate.tsx`

**Steps:**
1. Define and test pure storage parsing, deduplication, expiry, and maximum-history behavior.
2. Save each received task ID with conversion type and timestamp.
3. On mount, query saved IDs, remove stale entries, and restore active/completed state.
4. Render recent task status, expiration, download, and local removal controls.
5. Verify frontend typecheck and build.

### Task 4: Add quota API and indicator

**Objective:** Show anonymous users their daily limit and stop charging read-only tool discovery requests.

**Files:**
- Create: `backend/src/modules/rate-limit/rate-limit.service.ts`
- Modify: `backend/src/modules/rate-limit/rate-limit.guard.ts`
- Modify: `backend/src/modules/rate-limit/rate-limit.module.ts`
- Create: `backend/src/modules/rate-limit/rate-limit.controller.ts`
- Create/modify: rate-limit Jest specs
- Create: `frontend/src/components/conversion/QuotaIndicator.tsx`
- Modify: `frontend/src/components/conversion/ConversionPageTemplate.tsx`

**Steps:**
1. Write failing tests for initial quota, reset window, exhausted quota, and non-consuming `GET /quota`.
2. Move quota calculations into a service and apply the guard only to cost-producing endpoints.
3. Return `limit`, `used`, `remaining`, and `resetAt`; add standard response headers.
4. Render quota status inside the conversion workbench.
5. Verify tests and builds.

### Task 5: Add explicit OCR modes

**Objective:** Let PDF-to-Word users choose `auto`, `force`, or `off` before submitting.

**Files:**
- Modify: `backend/src/modules/conversion/dto/create-conversion.dto.ts`
- Modify: `backend/src/modules/conversion/conversion.controller.ts`
- Modify carefully: `backend/src/modules/conversion/conversion.service.ts`
- Modify: `backend/src/modules/stirling-pdf/stirling-pdf.interface.ts`
- Modify: `backend/src/modules/stirling-pdf/stirling-pdf.service.ts`
- Modify existing backend operation specs
- Create: `frontend/src/components/conversion/OcrOptions.tsx`
- Modify: `frontend/src/app/pdf-to-word/client-page.tsx`
- Modify carefully: `frontend/src/components/conversion/ConversionPageTemplate.tsx`

**Steps:**
1. Write failing DTO/service tests for all three modes and force-mode OCR failure.
2. Pass typed OCR options through controller and conversion service.
3. Keep auto fallback behavior, make force failure explicit, and bypass OCR for off.
4. Change the generic template to select/configure first and submit explicitly.
5. Display OCR controls only on PDF-to-Word.
6. Verify all conversion tests and both builds.

### Task 6: Add bounded sequential batch conversion

**Objective:** Process up to five files sequentially with independent statuses and retries of files still held in browser memory.

**Files:**
- Create: `frontend/src/lib/batch-conversion.ts`
- Create: `frontend/src/components/conversion/BatchConversionPanel.tsx`
- Create: `frontend/src/app/batch-convert/page.tsx`
- Create: `frontend/src/app/batch-convert/client-page.tsx`
- Modify: `frontend/src/components/layout/Header.tsx`
- Modify: `frontend/src/app/page.tsx`
- Modify: `frontend/src/app/sitemap.ts`
- Patch translation JSON without reformatting

**Steps:**
1. Test the pure sequential runner: order, single concurrency, continuation after failure, and retry state.
2. Build a parameterized multi-file picker with duplicate/size/count checks.
3. Submit one file at a time to the current conversion endpoint and save each task ID immediately.
4. Add per-item progress, error, retry, and download actions.
5. Add navigation, homepage discovery, sitemap, and bilingual copy.
6. Verify JSON, typecheck, and frontend build.

### Task 7: Strengthen readiness checks

**Objective:** Report MySQL, Stirling, Redis, and writable storage readiness without changing liveness semantics.

**Files:**
- Modify: `backend/src/health/health.controller.ts`
- Modify: `backend/src/health/health.module.ts`
- Modify: `backend/src/health/health.controller.spec.ts`
- Modify: `backend/src/modules/queue/queue.service.ts`

**Steps:**
1. Write failing tests for Redis down, storage unavailable, and dependency timeout.
2. Add bounded Redis ping and writable-storage checks.
3. Include structured checks in readiness while keeping `/health/live` process-only.
4. Run health tests, backend suite, and backend build.

### Task 8: Final integration verification

**Objective:** Prove the release is compatible with existing tools and protected files.

**Steps:**
1. Run backend focused and full tests.
2. Run backend build.
3. Run frontend typecheck and production build.
4. Validate translation JSON and `git diff --check`.
5. Confirm protected root layout and deployment files were not modified by this implementation.
6. Review changed routes and one representative flow from conversion, PDF operation, image tool, blog, and static pages.

**Deferred to Phase 1.1:** Real Bull workers, server-side cancellation/retry, encrypted-input persistence, PDF protect/unlock, ZIP batch downloads, authenticated history, and database migrations.
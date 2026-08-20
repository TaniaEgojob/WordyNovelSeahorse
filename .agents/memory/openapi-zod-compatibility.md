---
name: OpenAPI and Zod compatibility
description: Compatibility constraint between the workspace Orval output and the installed Zod runtime.
---

When adding API schemas in this workspace, represent dashboard counters as numeric fields without OpenAPI `integer` types or integer formats.

**Why:** The installed Orval/Zod combination generated `zod.int()`, but the resolved Zod runtime only exposes the Zod 3 API and fails the library typecheck.

**How to apply:** After changing `lib/api-spec/openapi.yaml`, run codegen and the library typecheck before wiring generated hooks into an app.
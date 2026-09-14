# Repository Guidance

- Preserve the asynchronous analyzer API, CommonJS constructor and native ESM default imports.
- Use Yahoo's documented JSON-RPC morphological analysis protocol; keep existing surface_form, pos and reading fields.
- Keep runtime compatibility separate from development tooling. Retain .babelrc and edit src/, not generated lib/.
- Use npm ci for an unchanged lockfile. Commit package-lock.json for dependency changes.
- Run npm test and npm pack --dry-run before submitting changes.
- Offline HTTP fixtures do not prove live Yahoo service compatibility. Run npm run test:live with an explicitly supplied YAHOO_APP_ID for live verification.
- Never commit application IDs or print request credentials. Do not put live credentials into pull-request CI.
- Keep package version changes for release preparation.
- Use English Conventional Commits.

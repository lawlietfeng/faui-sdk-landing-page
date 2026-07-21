// Stub for `undici` — a Node-only HTTP library.
// pi-ai dynamically imports undici only when running under Node
// (guarded by `process.versions?.node`), so in the browser this code path
// is never reached. We alias undici to this empty module to keep it out of
// the bundle (saves ~485K). See vite.config.ts resolve.alias.
export const EnvHttpProxyAgent = undefined;
export const setGlobalDispatcher = undefined;

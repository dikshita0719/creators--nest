import { copyFile } from 'node:fs/promises';

await copyFile(new URL('../../../docs/api/openapi.yaml', import.meta.url), new URL('../../../docs/api/openapi.yaml', import.meta.url));
console.log('OpenAPI source is maintained at docs/api/openapi.yaml.');

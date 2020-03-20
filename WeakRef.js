import { makeRequire } from 'nodejs:module';

const require = makeRequire(new URL(import.meta.url));

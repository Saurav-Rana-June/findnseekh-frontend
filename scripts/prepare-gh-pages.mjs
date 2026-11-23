import { copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const browserDir = join(root, 'dist', 'findnseekh', 'browser');

copyFileSync(join(browserDir, 'index.html'), join(browserDir, '404.html'));
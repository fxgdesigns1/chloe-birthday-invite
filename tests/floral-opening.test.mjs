import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';

const root = process.cwd();
const appSource = readFileSync(resolve(root, 'src/App.tsx'), 'utf8');
const stylesSource = readFileSync(resolve(root, 'src/styles.css'), 'utf8');
const floralAsset = resolve(root, 'public/assets/media/floral/chloe-floral-bloom.png');

assert.equal(existsSync(floralAsset), true, 'floral bloom asset should exist in public assets');
assert.match(appSource, /floralBackdrop:\s*['"]\/assets\/media\/floral\/chloe-floral-bloom\.png['"]/, 'App assets should expose the floral backdrop');
assert.match(appSource, /floral-atmosphere/, 'gate and intro stages should render the floral atmosphere');
assert.match(stylesSource, /\.floral-atmosphere/, 'floral atmosphere styles should be defined');
assert.match(stylesSource, /prefers-reduced-motion:\s*reduce/, 'decorative floral motion should respect reduced motion');

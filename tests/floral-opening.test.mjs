import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const assetsSource = readFileSync(resolve(root, 'src/data/event.ts'), 'utf8');
const gateSource = readFileSync(resolve(root, 'src/components/ActivationGate.tsx'), 'utf8');
const hologramSource = readFileSync(resolve(root, 'src/components/HologramStage.tsx'), 'utf8');
const stylesSource = readFileSync(resolve(root, 'src/styles.css'), 'utf8');
const floralAsset = resolve(root, 'public/assets/media/floral/chloe-floral-bloom.png');

assert.equal(existsSync(floralAsset), true, 'floral bloom asset should exist in public assets');
assert.match(assetsSource, /floralBackdrop:\s*['"].\/assets\/media\/floral\/chloe-floral-bloom\.png['"]/, 'cinematic assets should expose the floral backdrop');
assert.match(gateSource, /className="gate-floral"/, 'activation gate should render the floral backdrop');
assert.match(gateSource, /Chloe's birthday blooms\./, 'activation gate headline should read as a warm birthday invite');
assert.match(hologramSource, /className="stage-floral"/, 'welcome-film stage should render the floral backdrop');
assert.match(stylesSource, /\.petal-field/, 'decorative floral styling should be defined');
assert.match(
  stylesSource,
  /\.gate-copy h1,\s*\.premiere-copy h2\s*{[^}]*line-height:\s*0\.98/s,
  'opening display headings should keep wrapped lines from colliding',
);
assert.match(stylesSource, /prefers-reduced-motion:\s*reduce/, 'decorative motion should respect reduced motion');

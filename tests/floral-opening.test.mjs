import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const assetsSource = readFileSync(resolve(root, 'src/data/event.ts'), 'utf8');
const gateSource = readFileSync(resolve(root, 'src/components/ActivationGate.tsx'), 'utf8');
const hologramSource = readFileSync(resolve(root, 'src/components/HologramStage.tsx'), 'utf8');
const stylesSource = readFileSync(resolve(root, 'src/styles.css'), 'utf8');
const floralAsset = resolve(root, 'public/assets/media/floral/chloe-floral-bloom.png');
const floralLoopAsset = resolve(root, 'public/assets/media/floral/chloe-floral-loop.mp4');
const editorialCutoutAsset = resolve(root, 'public/assets/media/editorial/chloe-editorial-cutout.png');

assert.equal(existsSync(floralAsset), true, 'floral bloom asset should exist in public assets');
assert.equal(existsSync(floralLoopAsset), true, 'Remotion floral loop should exist in public assets');
assert.equal(existsSync(editorialCutoutAsset), true, 'transparent Chloe cutout should exist in public assets');
assert.match(assetsSource, /floralBackdrop:\s*['"].\/assets\/media\/floral\/chloe-floral-bloom\.png['"]/, 'cinematic assets should expose the floral backdrop');
assert.match(assetsSource, /floralLoop:\s*['"].\/assets\/media\/floral\/chloe-floral-loop\.mp4['"]/, 'cinematic assets should expose the floral loop');
assert.match(assetsSource, /editorialCutout:\s*['"].\/assets\/media\/editorial\/chloe-editorial-cutout\.png['"]/, 'cinematic assets should expose the transparent cutout');
assert.match(gateSource, /className="gate-floral-loop"/, 'activation gate should render the floral video loop');
assert.match(gateSource, /poster=\{cinematicAssets\.floralBackdrop\}/, 'floral video should keep the PNG fallback as poster');
assert.match(gateSource, /className="gate-floral gate-floral--fallback"/, 'activation gate should keep the fallback floral PNG');
assert.match(gateSource, /cinematicAssets\.editorialCutout/, 'activation gate should use the transparent editorial cutout');
assert.match(gateSource, /Chloe's birthday blooms\./, 'activation gate headline should read as a warm birthday invite');
assert.match(hologramSource, /className="stage-floral"/, 'welcome-film stage should render the floral backdrop');
assert.match(stylesSource, /\.petal-field/, 'decorative floral styling should be defined');
assert.doesNotMatch(stylesSource, /\.invitation-seal img\s*{[^}]*mask-image/s, 'opening portrait should not use the old hard fade mask');
assert.doesNotMatch(stylesSource, /\.invitation-seal img\s*{[^}]*border-radius:\s*999px 999px 8px 8px/s, 'opening portrait should not use the old arched frame');
assert.match(
  stylesSource,
  /\.gate-copy h1,\s*\.premiere-copy h2\s*{[^}]*line-height:\s*0\.98/s,
  'opening display headings should keep wrapped lines from colliding',
);
assert.match(stylesSource, /prefers-reduced-motion:\s*reduce/, 'decorative motion should respect reduced motion');

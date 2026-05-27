import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const assetsSource = readFileSync(resolve(root, 'src/data/event.ts'), 'utf8');
const gateSource = readFileSync(resolve(root, 'src/components/ActivationGate.tsx'), 'utf8');
const hologramSource = readFileSync(resolve(root, 'src/components/HologramStage.tsx'), 'utf8');
const appSource = readFileSync(resolve(root, 'src/App.tsx'), 'utf8');
const stylesSource = readFileSync(resolve(root, 'src/styles.css'), 'utf8');
const floralAsset = resolve(root, 'public/assets/media/floral/chloe-floral-bloom.png');
const floralLoopAsset = resolve(root, 'public/assets/media/floral/chloe-floral-loop.mp4');
const editorialCutoutAsset = resolve(root, 'public/assets/media/editorial/chloe-editorial-cutout.png');
const hairlineBloomCoverAsset = resolve(root, 'public/assets/media/editorial/chloe-hairline-bloom-cover.png');

assert.equal(existsSync(floralAsset), true, 'floral bloom asset should exist in public assets');
assert.equal(existsSync(floralLoopAsset), true, 'Remotion floral loop should exist in public assets');
assert.equal(existsSync(editorialCutoutAsset), true, 'transparent Chloe cutout should exist in public assets');
assert.equal(existsSync(hairlineBloomCoverAsset), true, 'hairline bloom cover should exist in public assets');
assert.match(assetsSource, /floralBackdrop:\s*['"].\/assets\/media\/floral\/chloe-floral-bloom\.png['"]/, 'cinematic assets should expose the floral backdrop');
assert.match(assetsSource, /floralLoop:\s*['"].\/assets\/media\/floral\/chloe-floral-loop\.mp4['"]/, 'cinematic assets should expose the floral loop');
assert.match(assetsSource, /editorialCutout:\s*['"].\/assets\/media\/editorial\/chloe-editorial-cutout\.png['"]/, 'cinematic assets should expose the transparent cutout');
assert.match(assetsSource, /hairlineBloomCover:\s*['"].\/assets\/media\/editorial\/chloe-hairline-bloom-cover\.png['"]/, 'cinematic assets should expose the hairline bloom cover');
assert.match(gateSource, /className="gate-floral-loop"/, 'activation gate should render the floral video loop');
assert.match(gateSource, /poster=\{cinematicAssets\.floralBackdrop\}/, 'floral video should keep the PNG fallback as poster');
assert.match(gateSource, /className="gate-floral gate-floral--fallback"/, 'activation gate should keep the fallback floral PNG');
assert.match(gateSource, /cinematicAssets\.editorialCutout/, 'activation gate should use the transparent editorial cutout');
assert.match(gateSource, /cinematicAssets\.hairlineBloomCover/, 'activation gate should cover the damaged hairline edge with a foreground bloom');
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
assert.match(gateSource, /Best viewed sideways if your screen feels tight/, 'opening screen should offer optional sideways guidance');
assert.match(hologramSource, /Continue to invite/, 'welcome stage should provide a mobile-safe continue fallback');
assert.match(stylesSource, /100svh/, 'opening and welcome stages should use small viewport height for mobile browsers');
assert.match(stylesSource, /safe-area-inset-bottom/, 'bottom CTA should respect mobile safe areas');
assert.match(stylesSource, /@media \(max-width:\s*640px\)[\s\S]*\.access-dock[\s\S]*position:\s*fixed/, 'mobile CTA dock should stay fixed and tappable');
assert.match(stylesSource, /@media \(max-width:\s*900px\) and \(orientation:\s*landscape\)/, 'landscape phones should get a dedicated compact layout');
assert.match(stylesSource, /@media \(max-height:\s*520px\)/, 'short in-app browser viewports should get a compact layout');
assert.match(
  appSource,
  /setStage\('hologram'\);[\s\S]*try\s*{[\s\S]*await unlockAmbientLoop/,
  'audio startup should not block the transition into the invite',
);

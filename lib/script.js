// Loads the script content from content/<lang>.script.md and combines
// them into the shape the rest of the app relies on:
// {
//   steps: [{ player1: { en, de }, player2: { en, de } }, ...],
//   roleNames: { en: { player1, player2 }, de: { player1, player2 } },
// }
// Each player's step text is markdown, rendered client-side. Role
// names come from each file's optional "# Roles" section; null means
// "not customized for this language" (UI falls back to the default
// "Player 1"/"Player 2" label).
//
// To add a step: add a new "# Step" section to both content files, in
// the same position. To add a language: add content/<lang>.script.md,
// list it in LANGUAGES below, and add a matching dictionary in lib/i18n.js.

const fs = require('fs');
const path = require('path');
const { parseScriptMarkdown } = require('./parseScriptMarkdown');

const LANGUAGES = ['en', 'de', 'es'];
const CONTENT_DIR = path.join(process.cwd(), 'content');

const parsedByLanguage = {};
for (const lang of LANGUAGES) {
  const filePath = path.join(CONTENT_DIR, `${lang}.script.md`);
  parsedByLanguage[lang] = parseScriptMarkdown(fs.readFileSync(filePath, 'utf8'));
}

const stepCounts = LANGUAGES.map((lang) => parsedByLanguage[lang].steps.length);
const stepCount = Math.max(...stepCounts);

if (stepCounts.some((count) => count !== stepCount)) {
  console.warn(
    `[script] Step count mismatch across languages (${LANGUAGES.map((lang, i) => `${lang}=${stepCounts[i]}`).join(', ')}). ` +
      'Every content/script.<lang>.md file needs the same number of "# Step" sections, in the same order — ' +
      'missing ones will show a placeholder below until you add them.'
  );
}

const steps = [];
for (let i = 0; i < stepCount; i++) {
  const step = { player1: {}, player2: {} };
  for (const lang of LANGUAGES) {
    const langStep = parsedByLanguage[lang].steps[i];
    step.player1[lang] = langStep ? langStep.player1 : `*(missing step ${i + 1} content for "${lang}")*`;
    step.player2[lang] = langStep ? langStep.player2 : `*(missing step ${i + 1} content for "${lang}")*`;
  }
  steps.push(step);
}

const roleNames = {};
for (const lang of LANGUAGES) {
  roleNames[lang] = {
    player1: parsedByLanguage[lang].roles.player1 || null,
    player2: parsedByLanguage[lang].roles.player2 || null,
  };
}

module.exports = { steps, roleNames };

// Loads the About page text from content/<lang>.about.md.
// Returns { en: '...md...', de: '...md...', es: '...md...' }. Edit
// those files directly; no code change needed for new wording.

const fs = require('fs');
const path = require('path');

const LANGUAGES = ['en', 'de', 'es'];
const CONTENT_DIR = path.join(process.cwd(), 'content');

const about = {};
for (const lang of LANGUAGES) {
  const filePath = path.join(CONTENT_DIR, `${lang}.about.md`);
  about[lang] = fs.readFileSync(filePath, 'utf8').trim();
}

module.exports = about;

// Parses a script content file into { roles, steps }.
//
// Format:
// - An optional "# Roles" section, anywhere before the first step,
//   with "## Player 1" / "## Player 2" bodies giving the display name
//   for each role in this language (e.g. "Mentor" / "Seeker"). If
//   omitted, the app falls back to the default "Player 1"/"Player 2"
//   UI label for that language.
// - Then each step starts at an H1 line (any text — "# Step",
//   "# Schritt", ...).
// Within both, "## Player 1" / "## Player 2" (English keywords, kept
// the same across language files since they're authoring syntax, not
// displayed text) mark whose markdown body follows, up to the next
// heading.

const ROLES_HEADING = /^#\s*Roles\b/i;
const STEP_HEADING = /^#\s+\S/; // H1, but not H2 ("##...") and not "# Roles"
const PLAYER1_HEADING = /^##\s*Player\s*1\b/i;
const PLAYER2_HEADING = /^##\s*Player\s*2\b/i;

function parseScriptMarkdown(markdown) {
  const lines = markdown.split(/\r?\n/);
  const steps = [];
  const roles = { player1: '', player2: '' };

  let section = null; // 'roles' | 'step'
  let currentStep = null;
  let currentPlayerKey = null;
  let buffer = [];

  function appendText(target, key, text) {
    if (!text) return;
    target[key] = target[key] ? `${target[key]}\n\n${text}` : text;
  }

  function flushBuffer() {
    if (currentPlayerKey) {
      const text = buffer.join('\n').trim();
      if (section === 'roles') {
        appendText(roles, currentPlayerKey, text);
      } else if (section === 'step' && currentStep) {
        appendText(currentStep, currentPlayerKey, text);
      }
    }
    buffer = [];
  }

  for (const line of lines) {
    if (ROLES_HEADING.test(line)) {
      flushBuffer();
      section = 'roles';
      currentStep = null;
      currentPlayerKey = null;
    } else if (STEP_HEADING.test(line)) {
      flushBuffer();
      section = 'step';
      currentStep = { player1: '', player2: '' };
      steps.push(currentStep);
      currentPlayerKey = null;
    } else if (PLAYER1_HEADING.test(line)) {
      flushBuffer();
      currentPlayerKey = 'player1';
    } else if (PLAYER2_HEADING.test(line)) {
      flushBuffer();
      currentPlayerKey = 'player2';
    } else {
      buffer.push(line);
    }
  }
  flushBuffer();

  return { roles, steps };
}

module.exports = { parseScriptMarkdown };

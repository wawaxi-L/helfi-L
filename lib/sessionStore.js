// In-memory session store. Sessions are lost on server restart.
// To move to production, replace the body of these functions with
// calls to a real database/cache (e.g. Redis or Postgres) — the
// function signatures below are the only contract the rest of the
// app relies on.

const { steps: SCRIPT, roleNames: ROLE_NAMES } = require('./script');

const sessions = new Map();

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous chars (0/O, 1/I)
const CODE_LENGTH = 5;

function generateCode() {
  let code;
  do {
    code = Array.from(
      { length: CODE_LENGTH },
      () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
    ).join('');
  } while (sessions.has(code));
  return code;
}

function createSession() {
  const code = generateCode();
  const session = {
    code,
    currentStepIndex: 0,
    doneStatus: { player1: false, player2: false },
    sockets: { player1: null, player2: null },
  };
  sessions.set(code, session);
  return session;
}

function getSession(code) {
  return sessions.get(code) || null;
}

function joinSession(code, socketId) {
  const session = getSession(code);
  if (!session) return { error: 'session_not_found' };
  if (session.sockets.player1) return { error: 'player1_taken' };
  session.sockets.player1 = socketId;
  return { session };
}

function rejoinSession(code, role, socketId) {
  if (role !== 'player1' && role !== 'player2') return { error: 'invalid_role' };
  const session = getSession(code);
  if (!session) return { error: 'session_not_found' };
  session.sockets[role] = socketId;
  return { session };
}

function clearSocket(code, socketId) {
  const session = getSession(code);
  if (!session) return;
  for (const role of ['player1', 'player2']) {
    if (session.sockets[role] === socketId) {
      session.sockets[role] = null;
    }
  }
}

function markDone(session, role) {
  if (session.currentStepIndex >= SCRIPT.length) return session;
  session.doneStatus[role] = true;
  if (session.doneStatus.player1 && session.doneStatus.player2) {
    session.currentStepIndex += 1;
    session.doneStatus = { player1: false, player2: false };
  }
  return session;
}

function getPublicState(session) {
  const step = SCRIPT[session.currentStepIndex] || null;
  return {
    code: session.code,
    currentStepIndex: session.currentStepIndex,
    totalSteps: SCRIPT.length,
    finished: session.currentStepIndex >= SCRIPT.length,
    step: step ? { player1: step.player1, player2: step.player2 } : null,
    roleNames: ROLE_NAMES,
    doneStatus: { ...session.doneStatus },
    connected: {
      player1: !!session.sockets.player1,
      player2: !!session.sockets.player2,
    },
  };
}

module.exports = {
  createSession,
  getSession,
  joinSession,
  rejoinSession,
  clearSocket,
  markDone,
  getPublicState,
};

const {
  createSession,
  getSession,
  joinSession,
  rejoinSession,
  clearSocket,
  markDone,
  getPublicState,
} = require('./sessionStore');

function initSocket(io) {
  io.on('connection', (socket) => {
    socket.data.code = null;
    socket.data.role = null;

    socket.on('create-session', (_payload, callback) => {
      const session = createSession();
      session.sockets.player2 = socket.id;
      socket.data.code = session.code;
      socket.data.role = 'player2';
      socket.join(session.code);
      callback({ code: session.code, role: 'player2', state: getPublicState(session) });
    });

    socket.on('join-session', (rawCode, callback) => {
      const code = String(rawCode || '').trim().toUpperCase();
      const result = joinSession(code, socket.id);
      if (result.error) {
        callback({ error: result.error });
        return;
      }
      socket.data.code = code;
      socket.data.role = 'player1';
      socket.join(code);
      callback({ code, role: 'player1', state: getPublicState(result.session) });
      io.to(code).emit('state', getPublicState(result.session));
    });

    socket.on('rejoin-session', ({ code, role } = {}, callback) => {
      const result = rejoinSession(code, role, socket.id);
      if (result.error) {
        callback({ error: result.error });
        return;
      }
      socket.data.code = code;
      socket.data.role = role;
      socket.join(code);
      callback({ code, role, state: getPublicState(result.session) });
      io.to(code).emit('state', getPublicState(result.session));
    });

    socket.on('mark-done', () => {
      const { code, role } = socket.data;
      if (!code || !role) return;
      const session = getSession(code);
      if (!session) return;
      markDone(session, role);
      io.to(code).emit('state', getPublicState(session));
    });

    socket.on('disconnect', () => {
      const { code } = socket.data;
      if (!code) return;
      clearSocket(code, socket.id);
      const session = getSession(code);
      if (!session) return;
      io.to(code).emit('state', getPublicState(session));
    });
  });
}

module.exports = { initSocket };

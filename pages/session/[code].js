import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ReactMarkdown from 'react-markdown';
import { SocketContext, I18nContext } from '../../lib/contexts';
import PreviewToggle from '../../components/PreviewToggle';
import LanguageSwitcher from '../../components/LanguageSwitcher';

export default function SessionPage() {
  const socket = useContext(SocketContext);
  const { t, lang } = useContext(I18nContext);
  const router = useRouter();
  const { code } = router.query;

  const [role, setRole] = useState(null);
  const [state, setState] = useState(null);
  const [error, setError] = useState('');
  const [previewRole, setPreviewRole] = useState(null);

  useEffect(() => {
    if (!socket || !code) return;

    const storedRole = localStorage.getItem(`session:${code}`);
    if (!storedRole) {
      setError('no_role_found');
      return;
    }

    function onState(newState) {
      setState(newState);
    }
    socket.on('state', onState);

    socket.emit('rejoin-session', { code, role: storedRole }, (res) => {
      if (res.error) {
        setError(res.error);
        return;
      }
      setRole(res.role);
      setState(res.state);
    });

    return () => {
      socket.off('state', onState);
    };
  }, [socket, code]);

  function handleMarkDone() {
    socket.emit('mark-done');
  }

  function playerLabel(playerRole) {
    const custom = state?.roleNames?.[lang]?.[playerRole];
    return custom || t(`session.${playerRole}`);
  }

  if (error) {
    return (
      <main className="session">
        <p className="error">{t(`errors.${error}`)}</p>
        <a href="/">{t('nav.backToHome')}</a>
      </main>
    );
  }

  if (!state || !role) {
    return (
      <main className="session">
        <p>{t('session.connecting')}</p>
      </main>
    );
  }

  const displayRole = previewRole || role;
  const youDone = state.doneStatus[role];
  const stepText = state.step ? state.step[displayRole][lang] || state.step[displayRole].en : null;

  return (
    <main className="session">
      <header className="session-header">
        <div>
          <strong>{t('session.sessionLabel', { code: state.code })}</strong>
          <span className="role-badge">{t('session.youAre', { player: playerLabel(role) })}</span>
        </div>
        <div className="header-right">
          <LanguageSwitcher />
          {process.env.NODE_ENV !== 'production' && (
            <PreviewToggle
              previewRole={previewRole}
              setPreviewRole={setPreviewRole}
              realRole={role}
              playerLabel={playerLabel}
            />
          )}
        </div>
      </header>

      <div className="connection-status">
        <span className={state.connected.player1 ? 'on' : 'off'}>
          {state.connected.player1
            ? t('session.connected', { player: playerLabel('player1') })
            : t('session.waiting', { player: playerLabel('player1') })}
        </span>
        <span className={state.connected.player2 ? 'on' : 'off'}>
          {state.connected.player2
            ? t('session.connected', { player: playerLabel('player2') })
            : t('session.waiting', { player: playerLabel('player2') })}
        </span>
      </div>

      {!state.connected.player1 && role === 'player2' && (
        <p className="share-code">{t('session.shareCode', { code: state.code })}</p>
      )}

      {state.finished ? (
        <p className="finished">{t('session.finished')}</p>
      ) : (
        <section className="step">
          <p className="step-counter">
            {t('session.stepCounter', { current: state.currentStepIndex + 1, total: state.totalSteps })}
            {previewRole && previewRole !== role
              ? t('session.previewingSuffix', { player: playerLabel(previewRole) })
              : ''}
          </p>
          <div className="step-text">
            <ReactMarkdown>{stepText}</ReactMarkdown>
          </div>
          <button onClick={handleMarkDone} disabled={youDone}>
            {youDone ? t('session.waitingForOther') : t('session.markDone')}
          </button>
          <div className="done-status">
            <span className={state.doneStatus.player1 ? 'on' : 'off'}>
              {state.doneStatus.player1
                ? t('session.done', { player: playerLabel('player1') })
                : t('session.notDone', { player: playerLabel('player1') })}
            </span>
            <span className={state.doneStatus.player2 ? 'on' : 'off'}>
              {state.doneStatus.player2
                ? t('session.done', { player: playerLabel('player2') })
                : t('session.notDone', { player: playerLabel('player2') })}
            </span>
          </div>
        </section>
      )}
    </main>
  );
}

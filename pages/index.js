import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ReactMarkdown from 'react-markdown';
import { SocketContext, I18nContext } from '../lib/contexts';
import LanguageSwitcher from '../components/LanguageSwitcher';
import homeIntroContent from '../lib/home';
import { getCooldownRemainingMs, markPlayedNow } from '../lib/playCooldown';

export async function getStaticProps() {
  return { props: { homeIntro: homeIntroContent } };
}

export default function Home({ homeIntro }) {
  const socket = useContext(SocketContext);
  const { t, lang } = useContext(I18nContext);
  const router = useRouter();
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [cooldownRemainingMs, setCooldownRemainingMs] = useState(0);

  useEffect(() => {
    setCooldownRemainingMs(getCooldownRemainingMs('player2'));
  }, []);

  function goToSession(res) {
    localStorage.setItem(`session:${res.code}`, res.role);
    if (res.role === 'player2') {
      markPlayedNow();
    }
    router.push(`/session/${res.code}`);
  }

  function handleCreate() {
    if (!socket) return;
    setError('');
    setBusy(true);
    socket.emit('create-session', null, (res) => {
      setBusy(false);
      if (res.error) {
        setError(res.error);
        return;
      }
      goToSession(res);
    });
  }

  function handleJoin(e) {
    e.preventDefault();
    if (!socket || !joinCode.trim()) return;
    setError('');
    setBusy(true);
    socket.emit('join-session', joinCode.trim(), (res) => {
      setBusy(false);
      if (res.error) {
        setError(res.error);
        return;
      }
      goToSession(res);
    });
  }

  return (
    <main className="home">
      <header className="home-header">
        <h1>{t('home.title')}</h1>
        <div className="header-right">
          <LanguageSwitcher />
        </div>
      </header>

      <section className="panel">
        <div className="step-text">
          <ReactMarkdown>
            {(homeIntro[lang] || homeIntro.en).split('{title}').join(t('home.title'))}
          </ReactMarkdown>
        </div>
      </section>

      {cooldownRemainingMs > 0 ? (
        <section className="panel">
          <p>
            {t('home.cooldownActive', {
              hours: Math.ceil(cooldownRemainingMs / (60 * 60 * 1000)),
            })}
          </p>
        </section>
      ) : (
        <section className="panel">
          <h2>{t('home.createHeading')}</h2>
          <p>{t('home.createDescription')}</p>
          <button onClick={handleCreate} disabled={!socket || busy}>
            {t('home.createButton')}
          </button>
        </section>
      )}

      <section className="panel">
        <h2>{t('home.joinHeading')}</h2>
        <p>{t('home.joinDescription')}</p>
        <form onSubmit={handleJoin}>
          <input
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            placeholder={t('home.joinPlaceholder')}
            maxLength={5}
          />
          <button type="submit" disabled={!socket || busy}>
            {t('home.joinButton')}
          </button>
        </form>
      </section>

      {error && <p className="error">{t(`errors.${error}`)}</p>}
    </main>
  );
}

import { useEffect, useMemo, useState } from 'react';
import io from 'socket.io-client';
import { SocketContext, I18nContext } from '../lib/contexts';
import { translate, DEFAULT_LANGUAGE } from '../lib/i18n';
import '../styles/globals.css';

const LANGUAGE_STORAGE_KEY = 'language';

export default function App({ Component, pageProps }) {
  const [socket, setSocket] = useState(null);
  const [lang, setLangState] = useState(DEFAULT_LANGUAGE);

  useEffect(() => {
    const s = io();
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored === 'en' || stored === 'de') setLangState(stored);
  }, []);

  function setLang(newLang) {
    setLangState(newLang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
  }

  const i18n = useMemo(
    () => ({
      lang,
      setLang,
      t: (key, vars) => translate(lang, key, vars),
    }),
    [lang]
  );

  return (
    <SocketContext.Provider value={socket}>
      <I18nContext.Provider value={i18n}>
        <Component {...pageProps} />
      </I18nContext.Provider>
    </SocketContext.Provider>
  );
}

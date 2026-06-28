import { useContext } from 'react';
import { I18nContext } from '../lib/contexts';
import { SUPPORTED_LANGUAGES } from '../lib/i18n';

const LABELS = { en: 'EN', de: 'DE', es: 'ES' };

export default function LanguageSwitcher() {
  const { lang, setLang } = useContext(I18nContext);

  return (
    <div className="language-switcher">
      {SUPPORTED_LANGUAGES.map((code) => (
        <button
          key={code}
          className={code === lang ? 'lang-button active' : 'lang-button'}
          onClick={() => setLang(code)}
          disabled={code === lang}
        >
          {LABELS[code]}
        </button>
      ))}
    </div>
  );
}

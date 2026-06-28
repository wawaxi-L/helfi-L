import { useContext } from 'react';
import { I18nContext } from '../lib/contexts';
import LanguageSwitcher from '../components/LanguageSwitcher';
import CollapsibleMarkdown from '../components/CollapsibleMarkdown';
import about from '../lib/about';

export async function getStaticProps() {
  return { props: { about } };
}

export default function About({ about: aboutText }) {
  const { t, lang } = useContext(I18nContext);
  const text = (aboutText[lang] || aboutText.en).split('{title}').join(t('about.title'));

  return (
    <main className="about">
      <div className="about-header">
        <LanguageSwitcher />
      </div>
      <div className="step">
        <div className="step-text">
          <CollapsibleMarkdown>{text}</CollapsibleMarkdown>
        </div>
      </div>
      <p>
        <a href="/">{t('nav.backToHome')}</a>
      </p>
    </main>
  );
}

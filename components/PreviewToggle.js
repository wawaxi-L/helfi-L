import { useContext } from 'react';
import { I18nContext } from '../lib/contexts';

// Dev-only convenience: lets one person preview the other player's
// view locally without affecting their real role or actions.
// Safe to delete this component (and its usage) for production.
export default function PreviewToggle({ previewRole, setPreviewRole, realRole, playerLabel }) {
  const { t } = useContext(I18nContext);
  const otherRole = realRole === 'player1' ? 'player2' : 'player1';

  function cycle() {
    setPreviewRole(previewRole ? null : otherRole);
  }

  const label = previewRole
    ? t('preview.toggleActive', { player: playerLabel(previewRole) })
    : t('preview.toggleDefault');

  return (
    <button className="preview-toggle" onClick={cycle} title={t('preview.title')}>
      {label}
    </button>
  );
}

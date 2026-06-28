export const SUPPORTED_LANGUAGES = ['en', 'de', 'es'];
export const DEFAULT_LANGUAGE = 'de';

// UI text only. Script content lives in lib/script.js with its own
// per-language fields, since that's data, not interface copy.
const translations = {
  en: {
    'home.title': 'Helfi',
    'home.createHeading': 'Help',
    'home.createDescription': 'You will become "Helfi" and get a code to share.',
    'home.createButton': 'Create session',
    'home.joinHeading': 'Be heard',
    'home.joinDescription': "Do you want to be heard? Find someone you believe wants to help you and is able and willing to help right now. If you don't have anyone with you right now, you can also play over the phone. Enter the helper's code to join as the person seeking help.",
    'home.joinPlaceholder': 'e.g. AB3F9',
    'home.joinButton': 'Join session',
    'home.cooldownActive': "You've already played Helfi recently. Come back in about {hours}h.",

    'about.title': 'Helfi',

    'nav.about': 'About Helfi',
    'nav.backToHome': 'Back to home',

    'session.title': 'Helfi',
    'session.sessionLabel': 'Session {code}',
    'session.youAre': 'You are {player}',
    'session.player1': 'Helpee',
    'session.player2': 'Helper',
    'session.connected': '{player} connected',
    'session.waiting': '{player} waiting…',
    'session.shareCode': 'Share this code with the helpee: {code}',
    'session.finished': 'Session complete! 🎉',
    'session.stepCounter': 'Step {current} of {total}',
    'session.previewingSuffix': ' (previewing {player})',
    'session.markDone': 'Mark step as done',
    'session.waitingForOther': 'Waiting for the other player…',
    'session.done': '{player} done',
    'session.notDone': '{player} not done',
    'session.connecting': 'Connecting…',

    'preview.toggleDefault': 'Preview other view (dev)',
    'preview.toggleActive': 'Previewing {player} — click to reset',
    'preview.title': "Dev-only: preview the other player's view",

    'errors.session_not_found': 'Session not found',
    'errors.player1_taken': 'Session already has a Player 1',
    'errors.invalid_role': 'Invalid role',
    'errors.no_role_found': 'No role found for this session on this device. Go back and create or join again.',
  },
  de: {
    'home.title': 'Helfi',
    'home.createHeading': 'Helfen',
    'home.createDescription': 'Du wirst "Helfi" und erhältst einen Code zum Teilen.',
    'home.createButton': 'Sitzung erstellen',
    'home.joinHeading': 'Gehört werden',
    'home.joinDescription': 'Möchtest du gehört werden? Such dir jemanden, von dem du glaubst, dass er dir helfen möchte und jetzt gerade helfen kann und will. Wenn du jetzt gerade niemanden bei dir hast, könnt ihr auch über das Telefon spielen. Gib den Code vom Helfenden ein, um als Hilfesuchender beizutreten.',
    'home.joinPlaceholder': 'z. B. AB3F9',
    'home.joinButton': 'Sitzung beitreten',
    'home.cooldownActive': 'Du hast in der letzten Zeit schon den Helfi gespielt. Komm in etwa {hours} Std. wieder.',

    'about.title': 'Helfi',

    'nav.about': 'Über Helfi',
    'nav.backToHome': 'Zurück zur Startseite',

    'session.title':'Helfi',
    'session.sessionLabel': 'Sitzung {code}',
    'session.youAre': 'Du bist {player}',
    'session.player1': 'Hilfesuchender',
    'session.player2': 'Helfender',
    'session.connected': '{player} verbunden',
    'session.waiting': '{player} wartet…',
    'session.shareCode': 'Teile diesen Code mit dem Hilfesuchenden: {code}',
    'session.finished': 'Sitzung abgeschlossen! 🎉',
    'session.stepCounter': 'Schritt {current} von {total}',
    'session.previewingSuffix': ' (Vorschau: {player})',
    'session.markDone': 'Schritt als erledigt markieren',
    'session.waitingForOther': 'Warte auf den anderen Spieler…',
    'session.done': '{player} fertig',
    'session.notDone': '{player} nicht fertig',
    'session.connecting': 'Verbindung wird aufgebaut…',

    'preview.toggleDefault': 'Andere Ansicht anzeigen (Entwicklung)',
    'preview.toggleActive': 'Vorschau: {player} — klicken zum Zurücksetzen',
    'preview.title': 'Nur für Entwickler: Ansicht des anderen Spielers in der Vorschau anzeigen',

    'errors.session_not_found': 'Sitzung nicht gefunden',
    'errors.player1_taken': 'Diese Sitzung hat bereits einen Spieler 1',
    'errors.invalid_role': 'Ungültige Rolle',
    'errors.no_role_found': 'Für diese Sitzung wurde auf diesem Gerät keine Rolle gefunden. Gehe zurück und erstelle oder tritt erneut bei.',
  },
  es: {
    'home.title': 'Helfi',
    'home.createHeading': 'Ayudar',
    'home.createDescription': 'Te convertirás en "Helfi" y recibirás un código para compartir.',
    'home.createButton': 'Crear sesión',
    'home.joinHeading': 'Ser escuchado',
    'home.joinDescription': '¿Quieres ser escuchado? Busca a alguien de quien creas que quiere ayudarte y que ahora mismo puede y quiere ayudarte. Si ahora mismo no tienes a nadie cerca, también podéis jugar por teléfono. Introduce el código de quien ayuda para unirte como quien busca ayuda.',
    'home.joinPlaceholder': 'p. ej. AB3F9',
    'home.joinButton': 'Unirse a la sesión',
    'home.cooldownActive': 'Ya has jugado a Helfi hace poco. Vuelve en aproximadamente {hours} h.',

    'about.title': 'Helfi',

    'nav.about': 'Sobre Helfi',
    'nav.backToHome': 'Volver al inicio',

    'session.title': 'Helfi',
    'session.sessionLabel': 'Sesión {code}',
    'session.youAre': 'Eres {player}',
    'session.player1': 'Quien busca ayuda',
    'session.player2': 'Quien ayuda',
    'session.connected': '{player} conectado/a',
    'session.waiting': '{player} esperando…',
    'session.shareCode': 'Comparte este código con quien busca ayuda: {code}',
    'session.finished': '¡Sesión completada! 🎉',
    'session.stepCounter': 'Paso {current} de {total}',
    'session.previewingSuffix': ' (viendo como: {player})',
    'session.markDone': 'Marcar paso como completado',
    'session.waitingForOther': 'Esperando a la otra persona…',
    'session.done': '{player} ha terminado',
    'session.notDone': '{player} no ha terminado',
    'session.connecting': 'Conectando…',

    'preview.toggleDefault': 'Vista previa de la otra persona (dev)',
    'preview.toggleActive': 'Viendo como {player} — clic para restablecer',
    'preview.title': 'Solo para desarrolladores: vista previa de la otra persona',

    'errors.session_not_found': 'Sesión no encontrada',
    'errors.player1_taken': 'Esta sesión ya tiene un Jugador 1',
    'errors.invalid_role': 'Rol no válido',
    'errors.no_role_found': 'No se encontró ningún rol para esta sesión en este dispositivo. Vuelve atrás y crea o únete de nuevo.',
  },
};

export function translate(lang, key, vars) {
  const dict = translations[lang] || translations[DEFAULT_LANGUAGE];
  const raw = dict[key] !== undefined ? dict[key] : translations[DEFAULT_LANGUAGE][key];
  if (raw === undefined) return key;
  if (!vars) return raw;
  return Object.entries(vars).reduce(
    (str, [name, value]) => str.split(`{${name}}`).join(value),
    raw
  );
}

import ReactMarkdown from 'react-markdown';

// Splits a markdown string into a tree of sections based on ATX headings
// (# .. ######), nesting deeper heading levels under their parent. Lines
// inside fenced code blocks are never treated as headings.
function parseSections(markdown) {
  const root = { level: 0, heading: null, lines: [], children: [] };
  const stack = [root];
  let inFence = false;

  for (const line of markdown.split('\n')) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      stack[stack.length - 1].lines.push(line);
      continue;
    }

    const match = !inFence && line.match(/^(#{1,6})\s+(.*)$/);
    if (match) {
      const level = match[1].length;
      while (stack.length > 1 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }
      const section = { level, heading: match[2].trim(), lines: [], children: [] };
      stack[stack.length - 1].children.push(section);
      stack.push(section);
    } else {
      stack[stack.length - 1].lines.push(line);
    }
  }

  return root;
}

function Section({ section }) {
  const body = section.lines.join('\n').trim();

  return (
    <details className="md-section" open>
      <summary className={`md-heading md-h${section.level}`}>{section.heading}</summary>
      <div className="md-section-body">
        {body && <ReactMarkdown>{body}</ReactMarkdown>}
        {section.children.map((child, i) => (
          <Section key={i} section={child} />
        ))}
      </div>
    </details>
  );
}

// Renders markdown where every headline becomes a collapsible <details>
// toggle for the content that follows it (down to the next same-or-higher
// level heading).
export default function CollapsibleMarkdown({ children }) {
  const root = parseSections(children || '');
  const preamble = root.lines.join('\n').trim();

  return (
    <div className="collapsible-markdown">
      {preamble && <ReactMarkdown>{preamble}</ReactMarkdown>}
      {root.children.map((section, i) => (
        <Section key={i} section={section} />
      ))}
    </div>
  );
}

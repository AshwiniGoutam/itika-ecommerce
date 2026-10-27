// "*text*" in any content string renders in the brand orange.
export function parseHL(text = '') {
  return String(text)
    .split(/(\*[^*]+\*)/g)
    .filter(Boolean)
    .map((seg) =>
      seg.length > 2 && seg.startsWith('*') && seg.endsWith('*')
        ? { text: seg.slice(1, -1), hl: true }
        : { text: seg, hl: false }
    );
}

export function words(text = '') {
  return parseHL(text).flatMap((s) =>
    s.text
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => ({ w, hl: s.hl }))
  );
}

export const plain = (text = '') => String(text).replace(/\*/g, '');

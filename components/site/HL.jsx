import { parseHL } from '@/lib/highlight';

export default function HL({ text, className = 'text-orange' }) {
  return parseHL(text).map((s, i) =>
    s.hl ? <span key={i} className={className}>{s.text}</span> : <span key={i}>{s.text}</span>
  );
}

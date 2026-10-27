export default function Logo({ brand = {}, light = true }) {
  if (brand.logo) {
    return <img src={brand.logo} alt={brand.fullName || brand.name} className="h-10 w-auto object-contain" />;
  }
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden="true">
        <rect width="40" height="40" rx="12" fill="#FF6A13" />
        <circle cx="15" cy="11" r="4" fill="#fff" />
        <path d="M10 30 C 16 26, 20 22, 22 17" stroke="#0A1A4A" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M18 30 L 30 14 M 30 14 L 24 15 M 30 14 L 30 20" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
      <span className="leading-none">
        <span className={`block font-display text-lg font-medium tracking-[0.1em] ${light ? 'text-navy' : 'text-white'}`}>
          {brand.name || 'ITIKA'}
        </span>
        <span className="block text-[11px] font-medium text-orange">e-commerce</span>
      </span>
    </span>
  );
}

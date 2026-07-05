export default function Logo({ size = 36, variant = "default" }: { size?: number; variant?: "default" | "white" }) {
  // VITA brand mark — white V with green leaf. Matches the ERP exactly.
  const isWhite = variant === "white"
  const ring = isWhite ? "#ffffff" : "#1a4d2e"
  const v = isWhite ? "#ffffff" : "#ffffff"
  const bg = isWhite ? "transparent" : "#1a4d2e"
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-label="Vita Fresh">
      <circle cx="50" cy="50" r="49" fill={bg} />
      <circle cx="50" cy="50" r="44" fill="none" stroke={ring} strokeWidth="3.5" />
      <path d="M23,24 L50,73 L77,24" fill="none" stroke={v} strokeWidth="9.5" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M65,20 C77,4,97,4,98,14 C87,32,63,28,65,20 Z" fill="#4ade80" />
      <path d="M71,18 C81,11,93,9,97,13" stroke={ring} strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

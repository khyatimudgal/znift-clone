import { Link } from 'react-router-dom'

export default function Logo({ to = '/', big = false, className = '' }) {
  return (
    <Link to={to} className={`flex items-center gap-2.5 ${className}`}>
      <span className={`flex items-center justify-center rounded-xl bg-brand ${big ? 'size-12' : 'size-10'}`}>
        <svg viewBox="0 0 32 32" className={big ? 'size-7' : 'size-6'} fill="none" aria-hidden="true">
          <path
            d="M9.5 11C13.5 8.5 19 8.5 22.5 11L10.5 22C14.5 24.5 19 24.5 22.5 22"
            stroke="white"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className={`font-bold tracking-tight text-white ${big ? 'text-4xl' : 'text-3xl'}`}>Znift</span>
    </Link>
  )
}

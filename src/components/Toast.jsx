import { useEffect } from 'react'
import { CircleCheck } from 'lucide-react'

export default function Toast({ open, message, onUndo, onClose, duration = 5000 }) {
  useEffect(() => {
    if (!open) return
    const t = setTimeout(onClose, duration)
    return () => clearTimeout(t)
  }, [open, duration, onClose])

  if (!open) return null

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-4 rounded-lg border border-white/10 bg-[#13142c] px-5 py-3 shadow-2xl">
        <CircleCheck className="size-5 text-white" />
        <span className="text-sm text-white">{message}</span>
        {onUndo && (
          <button
            onClick={() => { onUndo(); onClose() }}
            className="ml-2 rounded-md bg-white px-3 py-1 text-sm font-medium text-[#0a0b1e] hover:bg-white/90 transition-colors"
          >
            Undo
          </button>
        )}
      </div>
    </div>
  )
}

import { useEffect } from 'react'
import Button from './Button'

export default function Modal({ isOpen, onClose, title, children, footer }) {
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose()
    if (isOpen) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-dark-surface border border-dark-border rounded-xl shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-dark-border">
          <h2 className="text-base font-semibold text-gray-200">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors bg-transparent border-none cursor-pointer text-xl leading-none">×</button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 px-5 py-4 border-t border-dark-border">{footer}</div>
        )}
      </div>
    </div>
  )
}
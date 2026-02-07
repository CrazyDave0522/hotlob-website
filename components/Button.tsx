import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
}

export function Button({
  children,
  onClick,
  disabled = false,
  className
}: ButtonProps) {
  const baseClasses = 'inline-block font-medium transition-colors cursor-pointer border-none'

  return (
    <button
      className={`${baseClasses}${className ? ` ${className}` : ''}`}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 'clamp(80px, 10vw, 120px)',
        height: 'clamp(20px, 2.5vw, 32px)',
        padding: 'var(--space-12) var(--space-24)',
        borderRadius: 'var(--radius-20)',
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-white)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </button>
  )
}
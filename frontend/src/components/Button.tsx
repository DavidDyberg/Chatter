import { cn } from '@/utils/classnames'
import { Loader2 } from 'lucide-react'

type ButtonProps = {
  label: string
  variant: 'Primary' | 'Seacondary' | 'Delete'
  className?: string
  OnClick?: () => void
  isLoading?: boolean
  disabled?: boolean
}

export const ButtonComponent: React.FC<ButtonProps> = ({
  label,
  variant,
  OnClick,
  isLoading = false,
  disabled = false,
  className,
}) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        `p-3 pl-6 pr-6 rounded-3xl font-bold cursor-pointer hover:opacity-90
        ${disabled ? 'opacity-60 cursor-default hover:opacity-60' : ''}
        ${variant === 'Primary' ? 'bg-purple-dark' : variant === 'Seacondary' ? 'bg-white text-primary-black' : 'border border-red-600 text-red-600 hover:opacity-80'}`,
        className,
      )}
      onClick={OnClick}
    >
      <div className="flex justify-center gap-2 items-center">
        <p>{label}</p>
        {isLoading && <Loader2 className="animate-spin" size={16} />}
      </div>
    </button>
  )
}

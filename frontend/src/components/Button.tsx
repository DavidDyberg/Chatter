import { cn } from '@/utils/classnames'

type ButtonProps = {
  label: string
  variant: 'Primary' | 'Seacondary'
  className?: string
  OnClick?: () => void
}

export const ButtonComponent: React.FC<ButtonProps> = ({
  label,
  variant,
  OnClick,
  className,
}) => {
  return (
    <button
      className={cn(
        `p-3 pl-6 pr-6 rounded-3xl font-bold cursor-pointer hover:opacity-90
        ${variant === 'Primary' ? 'bg-purple-dark' : 'bg-white text-primary-black'}`,
        className,
      )}
      onClick={OnClick}
    >
      {label}
    </button>
  )
}

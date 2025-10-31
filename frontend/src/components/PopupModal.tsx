import { cn } from '@/utils/classnames'
import { ButtonComponent } from './Button'
import { useEffect } from 'react'

type ModalProps = {
  title: string
  content: string
  buttonCloseLabel: string
  buttonActionLabel: string
  onClose: () => void
  action: () => void
  className?: string
  isLoading?: boolean
}

export const PopupModal: React.FC<ModalProps> = ({
  title,
  content,
  onClose,
  action,
  buttonCloseLabel,
  buttonActionLabel,
  className,
  isLoading = false,
}) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        className,
      )}
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-slate-900 rounded-2xl w-[90%] max-w-sm p-6 z-10 animate-fadeIn">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-3 text-white">{title}</h2>
          <p className="text-gray-300 mb-6 text-center">{content}</p>

          <div className="flex justify-center gap-3">
            <ButtonComponent
              label={buttonCloseLabel}
              variant="Delete"
              onClick={onClose}
              disabled={isLoading}
            />
            <ButtonComponent
              label={buttonActionLabel}
              variant="Primary"
              onClick={action}
              isLoading={isLoading}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

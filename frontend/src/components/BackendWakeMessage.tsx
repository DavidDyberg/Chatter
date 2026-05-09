import { useEffect, useState } from 'react'

type BackendWakeMessageProps = {
  isLoading: boolean
  message?: string
}

export const BackendWakeMessage: React.FC<BackendWakeMessageProps> = ({
  isLoading,
  message = 'Backend service is starting from being idle, and an estimated time of 1-5 minutes.',
}) => {
  const [showMessage, setShowMessage] = useState(false)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null

    if (isLoading) {
      timer = setTimeout(() => {
        setShowMessage(true)
      }, 3000)
    } else {
      setShowMessage(false)
    }

    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [isLoading])

  if (!showMessage) return null

  return (
    <div className="rounded-2xl border border-purple-light bg-purple-50 p-4 text-sm text-purple-dark shadow-sm">
      <p className="font-semibold">Backend warmup in progress</p>
      <p>{message}</p>
    </div>
  )
}

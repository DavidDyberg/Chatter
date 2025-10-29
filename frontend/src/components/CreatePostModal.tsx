import { useEffect, useState } from 'react'
import { ButtonComponent } from './Button'

type PostModalProps = {
  user_id?: string
  onSave: () => void
  onClose: () => void
}

export const CreatePostModal: React.FC<PostModalProps> = ({
  user_id,
  onSave,
  onClose,
}) => {
  const [content, setContent] = useState('')
  const [image, setImage] = useState<File | null>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <form className="relative bg-slate-900 w-full max-w-xl mx-4 rounded-lg p-6 z-10">
        <h2 className="text-xl font-semibold mb-4">Create Post</h2>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full min-h-[120px] bg-transparent border border-gray-600 rounded-lg p-3 focus:border-purple-light focus:outline-none"
        />

        <div className="flex justify-end gap-2 mt-6">
          <ButtonComponent label="Cancel" variant="Delete" onClick={onClose} />
          <ButtonComponent label="Post" variant="Primary" type="submit" />
        </div>
      </form>
    </div>
  )
}

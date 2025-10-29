import { useEffect, useState } from 'react'
import { ButtonComponent } from './Button'
import { useMutation } from '@tanstack/react-query'
import { createPost } from '@/api-routes/posts'
import { useAuth0Context } from '@/auth/auth0'
import toast from 'react-hot-toast'

type PostModalProps = {
  onSave: () => void
  onClose: () => void
}

export const CreatePostModal: React.FC<PostModalProps> = ({
  onSave,
  onClose,
}) => {
  const [content, setContent] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [isContent, setIsContent] = useState(false)

  const { appUser } = useAuth0Context()

  const { mutate, isPending } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      toast.success('Your post was created successfully!')
      onSave()
    },
    onError: (error: any) => {
      console.error('Edit user failed:', error)
      toast.error('Something went wrong, please try again later')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) {
      toast.error('Please enter content')
      return
    }

    if (!appUser?.id) {
      toast.error('You must be logged in to post')
      return
    }

    const formData = new FormData()
    formData.append('content', content)
    if (image) formData.append('image', image)
    formData.append('userId', appUser.id)

    mutate(formData)
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="relative bg-slate-900 w-full max-w-xl mx-4 rounded-lg p-6 z-10"
      >
        <h2 className="text-xl font-semibold mb-4">Create Post</h2>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full min-h-[120px] bg-transparent border border-gray-600 rounded-lg p-3 focus:border-purple-light focus:outline-none"
        />

        <div className="flex justify-end gap-2 mt-6">
          <ButtonComponent label="Cancel" variant="Delete" onClick={onClose} />
          <ButtonComponent
            label="Post"
            variant="Primary"
            type="submit"
            isLoading={isPending}
            disabled={isPending}
          />
        </div>
      </form>
    </div>
  )
}

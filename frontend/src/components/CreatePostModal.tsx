import { useEffect, useState } from 'react'
import { ButtonComponent } from './Button'
import { useMutation } from '@tanstack/react-query'
import { createPost } from '@/api-routes/posts'
import { useAuth0Context } from '@/auth/auth0'
import toast from 'react-hot-toast'
import FileUploader from '@/components/FileUploader'

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
  const [contentError, setContentError] = useState(false)

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
      setContentError(true)
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
    setContentError(false)
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
          onChange={(e) => {
            setContent(e.target.value)
            if (contentError && e.target.value.trim()) {
              setContentError(false)
            }
          }}
          placeholder="What's on your mind?"
          className={`w-full min-h-[120px] bg-transparent border rounded-lg p-3 focus:outline-none ${contentError ? 'border-primary-red focus:border-primary-red' : 'border-gray-600 focus:border-purple-light'}`}
        />

        {contentError && (
          <p className="text-red-500 text-sm mt-1">Content is required</p>
        )}

        <div className="mt-4">
          <FileUploader onFileSelect={setImage}>
            {({ preview, openFileDialog }) => (
              <div
                className="cursor-pointer border border-gray-600 rounded-lg p-2 flex items-center justify-center"
                onClick={openFileDialog}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-48 object-contain"
                  />
                ) : (
                  <p className="text-gray-400">Click to add an image</p>
                )}
              </div>
            )}
          </FileUploader>
        </div>

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

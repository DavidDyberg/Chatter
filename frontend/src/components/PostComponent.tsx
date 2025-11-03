import { BadgeCheck, Heart, MessageCircle, Trash2, X } from 'lucide-react'
import { cn } from '@/utils/classnames'
import { formatDate } from '@/utils/formatDate'
import { useAuth0Context } from '@/auth/auth0'
import { PopupModal } from './PopupModal'
import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'

type PostComponentProps = {
  content: string
  authorName: string
  authorImage: string
  postImage: string
  authorId: string
  likesAmmount: number
  commentsAmmount: number
  created_at: string
  isAdmin: boolean
  onClick?: () => void
  onDelete?: () => void
  isDeleting?: boolean
  className?: string
  navigateTo?: string
}

export const PostComponent: React.FC<PostComponentProps> = ({
  content,
  authorName,
  authorImage,
  postImage,
  authorId,
  likesAmmount,
  commentsAmmount,
  created_at,
  isAdmin,
  onClick,
  onDelete,
  isDeleting = false,
  className,
}) => {
  const [popUpModal, setPopUpModal] = useState(false)
  const [isImagePreview, setIsImagePreview] = useState(false)
  const { isUserMe, user } = useAuth0Context()

  const isMyPost = isUserMe(authorId)

  useEffect(() => {
    if (isImagePreview) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
  }, [isImagePreview])

  return (
    <section onClick={onClick} className={cn('flex gap-2', className)}>
      <Link params={{ profileId: authorId }} to="/profile/$profileId">
        <img
          className="max-w-12 min-h-12 rounded-full object-cover"
          src={authorImage}
          alt={`${authorName}´s profile image`}
        />
      </Link>

      <div className="flex items-start flex-col">
        <div className="flex flex-col">
          <div className="flex gap-1 items-center">
            <Link params={{ profileId: authorId }} to="/profile/$profileId">
              <p className="hover:underline">{authorName}</p>
            </Link>
            {isAdmin && <BadgeCheck color="#6B5FF3" size={20} />}
          </div>
          <p className="text-sm text-purple-light">{formatDate(created_at)}</p>
        </div>

        <div className="flex flex-col pt-2 gap-2">
          <p>{content}</p>

          {postImage && (
            <img
              src={postImage}
              alt="Post image"
              onClick={(e) => {
                e.stopPropagation()
                setIsImagePreview(true)
              }}
              className="rounded-xl max-w-[500px] w-full cursor-pointer transition-transform hover:scale-[1.01]"
            />
          )}

          <div className="flex gap-3 text-sm text-purple-light">
            <div className="flex gap-1">
              <Heart size={20} color="#aea7ff" />
              <p>{likesAmmount} Likes</p>
            </div>
            <div className="flex gap-1">
              <MessageCircle size={20} color="#aea7ff" />
              <p>{commentsAmmount} Comments</p>
            </div>
            {(isMyPost || user?.role === 'ADMIN') && (
              <div
                onClick={(e) => {
                  e.stopPropagation()
                  setPopUpModal(true)
                }}
                className="flex gap-1 cursor-pointer"
              >
                <Trash2 size={20} color="#aea7ff" />
                <p>Delete</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {popUpModal && (
        <PopupModal
          title="Delete post"
          content="Are you sure you want to delete this post? It can't be undone"
          buttonCloseLabel="Cancel"
          buttonActionLabel="Delete"
          onClose={() => setPopUpModal(false)}
          action={() => onDelete?.()}
          isLoading={isDeleting}
        />
      )}

      {isImagePreview && (
        <div
          onClick={() => setIsImagePreview(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
        >
          <X
            className="cursor-pointer absolute top-6 right-6 text-white hover:text-gray-300"
            size={32}
          />
          <img
            src={postImage}
            alt="Full preview"
            className="max-w-[90vw] max-h-[90vh] rounded-xl object-contain shadow-lg"
          />
        </div>
      )}
    </section>
  )
}

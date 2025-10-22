import { BadgeCheck, Heart, MessageCircle } from 'lucide-react'
import { cn } from '@/utils/classnames'
import { formatDate } from '@/utils/formatDate'

type PostComponentProps = {
  content: string
  authorName: string
  authorImage: string
  postImage: string
  likesAmmount: number
  commentsAmmount: number
  created_at: string
  isAdmin: boolean
  onClick?: () => void
  className?: string
}

export const PostComponent: React.FC<PostComponentProps> = ({
  content,
  authorName,
  authorImage,
  postImage,
  likesAmmount,
  commentsAmmount,
  created_at,
  isAdmin,
  onClick,
  className,
}) => {
  return (
    <section onClick={onClick} className={cn('flex gap-2', className)}>
      <img
        className="w-12 h-12 rounded-full object-cover"
        src={authorImage}
        alt={`${authorName}´s profile image`}
      />
      <div className="flex items-start flex-col">
        <div className="flex flex-col">
          <div className="flex gap-1 items-center">
            <p>{authorName}</p>
            {isAdmin && <BadgeCheck color="#6B5FF3" size={20} />}
          </div>
          <p className="text-sm text-purple-light">{formatDate(created_at)}</p>
        </div>

        <div className="flex flex-col pt-2 gap-2">
          <p>{content}</p>
          {postImage && (
            <img src={postImage} alt="Post image" className="rounded-xl" />
          )}
          <div className="flex gap-3">
            <div className="flex gap-1">
              <Heart size={20} color="#aea7ff" />
              <p className="text-sm text-purple-light">{likesAmmount} Likes</p>
            </div>
            <div className="flex gap-1">
              <MessageCircle size={20} color="#aea7ff" />
              <p className="text-sm text-purple-light">
                {commentsAmmount} Comments
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

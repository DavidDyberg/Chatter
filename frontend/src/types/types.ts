export type User = {
  id: string
  userName: string
  email: string
  bio?: string
  profileImage: string | null
  profileImageId?: string
  profileBanner?: string
  profileBannerId?: string
  role: 'USER' | 'ADMIN'
  createdAt?: string
  updatedAt?: string
}

export type Post = {
  id: string
  content: string
  image: string | null
  imageId?: string
  createdAt: string
  updatedAt: string
  user_id: string
  _count: Count
  comments: Comment[]
  user: User
}

export type Comment = {
  id: string
  content: string
  createdAt: string
  updatedAt: string
  user_id: string
  post_id: string
  user: User
}

export type Count = {
  likes: number
  comments: number
}

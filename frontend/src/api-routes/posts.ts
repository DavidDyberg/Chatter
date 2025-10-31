import axios from 'axios'
import type { Post } from '@/types/types'

export const fetchPosts = async () => {
  const { data } = await axios.get<Post[]>(
    'https://chatter-r8i2.onrender.com/api/post',
  )
  return data
}

export const createPost = async (postData: FormData) => {
  const { data } = await axios.post<Post>(
    'https://chatter-r8i2.onrender.com/api/post',
    postData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )

  return data
}

export const deletePost = async (id: string) => {
  const { data } = await axios.delete<Post>(
    `https://chatter-r8i2.onrender.com/api/post/${id}`,
  )

  return data
}

import axios from 'axios'
import type { Post } from '@/types/types'

export const fetchPosts = async () => {
  const { data } = await axios.get<Post[]>(
    'https://chatter-r8i2.onrender.com/api/post',
  )
  return data
}

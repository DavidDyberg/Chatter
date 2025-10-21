import axios from 'axios'
import type { Post } from '@/types/types'

export const fetchPosts = async () => {
  const { data } = await axios.get<Post[]>('http://localhost:8080/api/post')
  return data
}

import axios from 'axios'
import type { User } from '@/types/types'

export const getUser = async (id: string) => {
  const { data } = await axios.get<User>(`http://localhost:8080/api/user/${id}`)

  return data
}

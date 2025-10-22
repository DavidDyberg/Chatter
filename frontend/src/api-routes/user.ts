import axios from 'axios'
import type { User } from '@/types/types'

export const getUser = async (id: string) => {
  const { data } = await axios.get<User>(
    `https://chatter-r8i2.onrender.com/api/user/${id}`,
  )

  return data
}

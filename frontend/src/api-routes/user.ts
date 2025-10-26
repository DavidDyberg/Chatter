import axios from 'axios'
import type { User } from '@/types/types'

export const getUser = async (id: string) => {
  const { data } = await axios.get<User>(
    `https://chatter-r8i2.onrender.com/api/user/${id}`,
  )

  return data
}

export const editUser = async (id: string, updatedData: Partial<User>) => {
  const { data } = await axios.put<User>(
    `http://localhost:8080/api/user/${id}`,
    updatedData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )

  return data
}

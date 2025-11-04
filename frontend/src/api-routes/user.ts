import axios from 'axios'
import type { User } from '@/types/types'

export const searchUsers = async (searchTerm: string) => {
  const { data } = await axios.get<User[]>(
    `https://chatter-r8i2.onrender.com/api/user?search=${searchTerm}`,
  )

  return data
}

export const getUser = async (id: string) => {
  const { data } = await axios.get<User>(
    `https://chatter-r8i2.onrender.com/api/user/${id}`,
  )

  return data
}

export const editUser = async (
  id: string,
  updatedData: FormData | Partial<User>,
) => {
  const { data } = await axios.put<User>(
    `https://chatter-r8i2.onrender.com/api/user/${id}`,
    updatedData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )

  return data
}

export const deleteAccount = async (id: string) => {
  const { data } = await axios.delete<User>(
    `https://chatter-r8i2.onrender.com/api/user/${id}`,
  )

  return data
}

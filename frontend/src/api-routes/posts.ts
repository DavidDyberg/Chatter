import axios from 'axios'

export const fetchPosts = async () => {
  const { data } = await axios.get('https://chatter-r8i2.onrender.com/api/post')
  return data
}

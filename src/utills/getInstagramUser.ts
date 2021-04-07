import axios from 'axios'

export const getInstagramUser = async (userId: string) => {
  return await axios.get(`https://www.instagram.com/${userId}/?__a=1`, {
    headers: { cookie: process.env.INSTAGRAM_COOKIE },
  })
}

import axios from 'axios'

export const getVideoURLs = async (query: string) => {
  return await axios.get('https://www.googleapis.com/youtube/v3/search', {
    params: {
      q: query,
      maxResults: 3,
      part: 'snippet',
      key: process.env.YOUTUBE_API_KEY,
    },
  })
}

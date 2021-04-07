import axios from 'axios'

export const getPlaylistURLs = async (playlistId: string) => {
  return await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
    params: {
      part: 'snippet',
      maxResults: 50,
      playlistId,
      key: process.env.YOUTUBE_API_KEY,
    },
  })
}

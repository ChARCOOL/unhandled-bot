import axios from 'axios'

export const getExchangeRates = async (from: string, to: string) => {
  return await axios.get('https://free.currconv.com/api/v7/convert', {
    params: { apiKey: process.env.EXCHANGERATESAPI_KEY, compact: 'ultra', q: `${from}_${to}` },
  })
}

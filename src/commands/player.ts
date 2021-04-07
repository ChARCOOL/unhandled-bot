import { Client, Command, Message, MessageEmbed, TextChannel, VoiceConnection } from 'discord.js'
import ytdl from 'discord-ytdl-core'

import { getPlaylistURLs, getVideoURLs } from '../utills'

let vc: VoiceConnection
let queue: { title: string; videoId: string; thumbnail: string; published: string }[] = []
let playing = false
let volume = 1

const command: Command = {
  name: 'player',
  description: 'Music player',
  async execute(client: Client, message: Message, args: string[]) {
    const guild = client.guilds.cache.get(message.guild.id)
    const member = guild.members.cache.get(message.author.id)
    const channel = guild.channels.cache.get(message.channel.id) as TextChannel

    const getEmbed = (i: number) => {
      return new MessageEmbed()
        .setColor('#AC3232')
        .setTitle(queue[i].title)
        .setImage(queue[i].thumbnail)
        .addField('Published', queue[i].published, true)
        .setURL(`https://youtube.com/watch?v=${queue[i].videoId}`)
    }

    const queueCount = () => {
      if (queue.length > 1) channel.send(`**Sıradaki şarkılar: ${queue.length - 1}**`)
    }

    const play = async () => {
      if (queue.length === 0) {
        vc.disconnect()
        vc = null

        return channel.send('**Güle güle 👋**')
      }

      if (vc == null) {
        vc = await member.voice.channel.join()
        play()
      }

      if (!playing) {
        const stream = ytdl(queue[0].videoId, {
          opusEncoded: true,
          encoderArgs: ['-ac', '2', '-b:a', '64k', '-map', 'a', '-application', 'voip'],
        })

        vc.play(stream, { type: 'opus', highWaterMark: 128, volume }).on('finish', () => {
          playing = false

          stream.destroy()
          queue.shift()
          play()
        })

        playing = true
      }
    }

    const loadURLs = async (URL: string) => {
      if (!member.voice.channel)
        return message.reply('**Müzik çalmak için herhangi bir ses kanalına bağlanmanız gerekir**')

      if (URL.includes('list=') && URL.includes('youtube')) {
        const playlistId = URL.match('list=([a-zA-Z0-9-_]+)&?')[1]

        const { data } = await getPlaylistURLs(playlistId)

        data.items.forEach(({ snippet }) => {
          queue.push({
            title: snippet.title,
            videoId: snippet.resourceId.videoId,
            thumbnail: snippet.thumbnails.high.url,
            published: new Date(snippet.publishedAt).toDateString(),
          })
        })
      } else if (URL.includes('v=') && URL.includes('youtube')) {
        const videoId = URL.match('v=([a-zA-Z0-9_-]+)&?')[1]

        const { videoDetails } = await ytdl.getBasicInfo(videoId)

        queue.push({
          videoId: videoId,
          title: videoDetails.title,
          thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          published: new Date(videoDetails.publishDate).toDateString(),
        })
      } else {
        return message.reply('**Geçerli bir youtube linki giriniz**')
      }

      queueCount()
      play()
    }

    if (args.includes('play')) loadURLs(args[1] || '')

    if (args.includes('search')) {
      const query = args.slice(1).join(' ')

      if (!query) return message.reply('**Bişeyler arayın**')

      const { data } = await getVideoURLs(query)

      data.items.forEach(({ id, snippet }, i: number) => {
        const embed = new MessageEmbed()
          .setColor('#AC3232')
          .setTitle(snippet.title)
          .addField('ID', i + 1, true)
          .setThumbnail(snippet.thumbnails.high.url)
          .setURL(
            id.videoId
              ? `https://www.youtube.com/watch?v=${id.videoId}`
              : `https://www.youtube.com/playlist?list=${id.playlistId}`
          )
          .addField('Published', new Date(snippet.publishedAt).toDateString(), true)

        channel.send(embed)
      })

      message.channel
        .awaitMessages((m) => m.author.id == message.author.id, { max: 1, time: 20000 })
        .then((collected) => {
          if (['1', '2', '3'].includes(collected.first().content)) {
            channel.messages.fetch({ limit: 4 }).then((messages) => {
              const songs = messages
                .array()
                .filter((message) => message.author.id === '823911345723670580')

              const song = songs.find(({ embeds }) => {
                return embeds.some((embed) => embed.fields[0].value === collected.first().content)
              }).embeds[0]

              loadURLs(song.url)
            })
          }
        })
        .catch(() => {
          message.reply('**Yanıt vermeye geç kaldın**')
        })
    }

    if (args.includes('volume')) {
      if (!playing) return message.reply('**Şuan zaten çalmıyor**')

      const option = parseInt(args[1]) || -1

      if (option > 200 || option < 0) return message.reply('**0 - 200 arası bir sayı girin**')

      volume = option / 100
      vc.dispatcher.setVolume(volume)
    }

    if (args.includes('queue')) {
      if (queue.length < 1) return channel.send('**Şuan sırada bir şarkı yok**')

      if (args.includes('next')) return channel.send(getEmbed(1))
      else if (args.includes('current')) return channel.send(getEmbed(0))

      queueCount()
    }

    if (args.includes('skip')) {
      const count = parseInt(args[1]) || 1

      if (!count) return message.reply('**Geçerli bir sayı girin**')

      if (count >= queue.length)
        return message.reply('**Atlamak istediğiniz şarkılar sıradakilerden fazla**')

      vc.dispatcher.destroy()
      playing = false

      queue = queue.slice(count)

      queueCount()
      play()
    }

    if (args.includes('pause')) {
      if (!playing) return message.reply('**Şuan zaten çalmıyor**')

      vc.dispatcher.pause()
      playing = false
    }

    if (args.includes('resume')) {
      if (playing) return message.reply('**Şuan zaten çalıyor**')

      vc.dispatcher.resume()
      playing = true
    }

    if (args.includes('stop')) {
      if (!playing) return message.reply('**Şuan zaten çalmıyor**')

      vc.disconnect()

      vc = null
      playing = false
      volume = 1
      queue = []

      channel.send('**Güle güle 👋**')
    }
  },
}

export = command

import { Client, Command, Message, MessageAttachment, MessageEmbed, TextChannel } from 'discord.js'
import { getInstagramUser } from '../utills'
import axios from 'axios'

const command: Command = {
  name: 'instagram',
  description: 'Get latest post of instagram user',
  async execute(client: Client, message: Message, args: string[]) {
    const channel = client.channels.cache.get(message.channel.id) as TextChannel

    const input = args.join(' ').split('|')

    const userId = input[0].trim()
    const page = Math.abs(parseInt(input[1]?.trim().split(':')[1])) || 0

    if (!userId) return message.reply('**Bir instagram kullanıcı ismi girin**')
    if (page > 10) return message.reply('**Page 10 den büyük olamaz**')

    try {
      const {
        data: {
          graphql: { user },
        },
      } = (await getInstagramUser(userId)) as any

      const post = {
        name: user.username,

        code: user.edge_owner_to_timeline_media.edges[page].node.shortcode,

        source: user.edge_owner_to_timeline_media.edges[page].node.video_url
          ? user.edge_owner_to_timeline_media.edges[page].node.video_url
          : user.edge_owner_to_timeline_media.edges[page].node.display_url,

        caption: user.edge_owner_to_timeline_media.edges[
          page
        ].node.edge_media_to_caption.edges[0]?.node.text.substring(0, 1024),

        published: new Date(
          user.edge_owner_to_timeline_media.edges[page].node.taken_at_timestamp * 1000
        ).toDateString(),
      }

      if (post.source.includes('mp4')) {
        const { data } = await axios.get(post.source, { responseType: 'arraybuffer' })

        const attachment = new MessageAttachment(data, 'file.mp4')

        const embed = new MessageEmbed()
          .setTitle(post.name)
          .setURL(`https://instagram.com/p/${post.code}/`)
          .addField('Published', post.published)

        post.caption && embed.addField('Caption', post.caption)

        channel.send(embed).then(() => channel.send(attachment))
      } else {
        const embed = new MessageEmbed()
          .setTitle(post.name)
          .setImage(post.source)
          .setURL(`https://instagram.com/p/${post.code}/`)
          .addField('Published', post.published)

        post.caption && embed.addField('Caption', post.caption)

        channel.send(embed)
      }
    } catch (err) {
      message.reply('**Hesap bulunamadı**')
    }
  },
}

export = command

import { Command, TextChannel } from 'discord.js'

const command: Command = {
  name: 'purge',
  description: 'Purge bot commands',
  execute(client, message, args) {
    let limit = parseInt(args[0]) || 15

    if (limit > 100) return message.reply('**Maksimum 100**')

    const guild = client.guilds.cache.get(message.guild.id)
    const channel = guild.channels.cache.get(message.channel.id) as TextChannel

    channel.messages.fetch({ limit }).then((messages) => {
      messages
        .array()
        .filter((message) => message.author.id === '823911345723670580')
        .forEach((message) => message.delete())
    })
  },
}

export = command

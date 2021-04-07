import { Client, Command, Message, MessageAttachment, MessageEmbed, TextChannel } from 'discord.js'
import { getExchangeRates } from '../utills'

const command: Command = {
  name: 'exchange',
  description: 'Get latest exchange rates',
  async execute(client: Client, message: Message, args: string[]) {
    const [amount, from, to] = args

    const { data } = await getExchangeRates(from, to)

    const exchanged = data[`${from}_${to}`.toUpperCase()] * parseFloat(amount)

    if (isNaN(exchanged)) return message.reply('**Para birimi bulunamadı**')

    await message.channel.send(
      `**\`${amount}\` ${from.toUpperCase()} is \`${exchanged}\` ${to.toUpperCase()}**`
    )
  },
}

export = command

import { Client, Command, Message, MessageAttachment, TextChannel } from 'discord.js'
import text2png from 'text2png'

const command: Command = {
  name: 'txt2img',
  description: 'Convert text to image',
  execute(client: Client, message: Message, args: string[]) {
    const channel = client.channels.cache.get(message.channel.id) as TextChannel

    const input = args.join(' ').split('|')

    const text = input[0].trim()
    const options = input[1]?.trim().split(' ')

    if (!text) return message.reply('**Bişeyler yazın**')

    const optionsObj = {
      font: '30px sans-serif',
      textAlign: 'left',
      color: 'black',
      backgroundColor: 'transparent',
      lineSpacing: 0,
      strokeWidth: 0,
      strokeColor: 'white',
      padding: 0,
      borderWidth: 0,
      borderColor: 'black',
      output: 'buffer',
    }

    options?.forEach((option, i) => {
      let [key, value]: [string, string | number] = option.split(':') as any
      value = +value ? +value : value

      if (key.startsWith('size')) {
        optionsObj.font = `${value} ${optionsObj.font.split(' ')[1]}`
        return
      }

      if (key.startsWith('font')) {
        optionsObj.font = `${optionsObj.font.split(' ')[0]} ${value}`
        return
      }

      optionsObj[key] = value
    })

    try {
      channel.send(new MessageAttachment(text2png(text, options && optionsObj)))
    } catch (err) {
      message.reply('**Yanlış parametre**')
    }
  },
}

export = command

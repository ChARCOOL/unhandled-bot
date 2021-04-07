import { Client, Command, Message, TextChannel } from 'discord.js'
import { textSync, fontsSync } from 'figlet'

const command: Command = {
  name: 'ascii',
  description: 'Convert text to ascii art',
  execute(client: Client, message: Message, args: string[]) {
    const channel = client.channels.cache.get(message.channel.id) as TextChannel

    const input = args.join(' ').split('|')

    const text = input[0].trim()
    const option = input[1]?.trim() || 'Standard'

    if (!text) return message.reply('**Bişeyler yazın**')
    if (text.length > 200) return message.reply('**200 karakteri geçmemeli**')

    const font = fontsSync().find((font) => font.toLowerCase() == option.toLowerCase())
    if (!font) return message.reply('**İstediğiniz yazı tipi bulunamadı**')

    channel.send(`\`\`\`${textSync(text, { font })}\`\`\``)
  },
}

export = command

import Discord, { MessageAttachment, TextChannel } from 'discord.js'
import express from 'express'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()

const app = express()

app.get('/', (req, res) => res.end('Unhandled Bot'))

const port = process.env.PORT
app.listen(port, () => console.info(`Unhandled Bot listening at port: ${port}`))

const prefix = '!'

const client = new Discord.Client()
client.commands = new Discord.Collection()

const commandFiles = fs.readdirSync(__dirname + '/commands').filter((file) => file.endsWith('.ts'))

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  client.commands.set(command.name, command)
}

client.on('guildMemberAdd', (member) => {
  const fruits = [
    '🌽',
    '🍇',
    '🍈',
    '🍉',
    '🍊',
    '🍋',
    '🍌',
    '🍍',
    '🍎',
    '🍏',
    '🍐',
    '🍑',
    '🍒',
    '🍓',
    '🥝',
    '🥥',
    '🥭',
  ]

  const channel = member.guild.channels.cache.find(
    (channel) => channel.name === 'general'
  ) as TextChannel

  channel.send(
    `**Hoş geldin ${member.toString()} bir adet ${
      fruits[Math.floor(Math.random() * fruits.length)]
    } almaz mısın ?**`
  )
})

client.on('message', (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return

  const args = message.content.slice(prefix.length).trim().split(/ +/)
  const commandName = args.shift().toLowerCase()
  const command = client.commands.get(commandName)

  switch (commandName) {
    case 'player':
      command.execute(client, message, args)
      break

    case 'purge':
      command.execute(client, message, args)
      break

    case 'ascii':
      command.execute(client, message, args)
      break

    case 'txt2img':
      command.execute(client, message, args)
      break

    case 'instagram':
      command.execute(client, message, args)
      break

    case 'exchange':
      command.execute(client, message, args)
      break

    case 'kawga':
      message.reply(new MessageAttachment('./images/KAWGA.jpg'))
      break

    case 'dovuj':
      message.reply(new MessageAttachment('./images/DOVUJ.jpg'))
      break

    case 'nasiya':
      message.reply(new MessageAttachment('./images/NASIYA.jpg'))
      break

    case 'lagaluga':
      message.reply(new MessageAttachment('./images/LAGALUGA.jpg'))
      break

    case 'think':
      message.reply(new MessageAttachment('./images/THINK.gif'))
      break

    case 'exception':
      message.reply(new MessageAttachment('./images/EXCEPTION.gif'))
      break

    default:
      break
  }
})

client.login(process.env.DISCORD_TOKEN)

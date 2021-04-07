declare module 'discord.js' {
  export interface Client {
    commands: Collection<unknown, Command>
  }

  export interface Command {
    name: string
    description: string
    execute: (client: Client, message: Message, args: string[]) => any | Promise<any>
  }
}

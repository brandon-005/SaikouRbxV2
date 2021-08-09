import { Client, WebhookClient, Intents, Collection } from 'discord.js';
import { config } from 'dotenv';
import { errorEmbed } from './utils/embeds';

config();

const webhookClient: WebhookClient = new WebhookClient({ id: `${BigInt(String(process.env.WEBHOOK_ID))}`, token: `${process.env.WEBHOOK_TOKEN}` });

const bot: Client = new Client({
	intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS],
	allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
	presence: { activities: [{ name: '🤖 Starting up...' }] },
});

bot.commands = new Collection();
bot.cooldowns = new Collection();
bot.aliases = new Collection();

['commands', 'aliases'].forEach((collection: string) => {
	// @ts-ignore
	bot[collection] = new Collection();
});
['load-commands', 'load-events'].forEach((handlerFile: string): string => require(`./handlers/${handlerFile}.js`)(bot));

process.on('uncaughtException', (error: Error) => {
	console.error(error);
	errorEmbed(webhookClient, bot, error.name, error.message);
});

process.on('unhandledRejection', (error: Error) => {
	console.error(error);
	errorEmbed(webhookClient, bot, error.name, error.message);
});

bot.login(process.env.DISCORD_TOKEN);
